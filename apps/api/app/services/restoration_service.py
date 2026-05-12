from io import BytesIO
import logging
import re

import cv2
import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core import errors
from app.schemas.restoration import RestorationMode, RestorationResponse
from app.services.ai.base import AIRestorationProvider, AIRestorationRequest, AIProviderError
from app.services.storage_service import StorageService
from app.utils.file_names import build_file_name, unique_file_stem
from app.utils.image_validation import FORMAT_EXTENSIONS, ValidatedUpload, verify_image_bytes


logger = logging.getLogger(__name__)


class RestorationService:
    def __init__(self, storage: StorageService) -> None:
        self.storage = storage

    async def restore(
        self,
        upload: ValidatedUpload,
        mode: RestorationMode,
        use_ai: bool,
        ai_provider: AIRestorationProvider | None = None,
        ai_provider_error: AIProviderError | None = None,
    ) -> RestorationResponse:
        restoration_id = unique_file_stem()
        input_name = build_file_name(restoration_id, upload.extension)

        self.storage.save_input(input_name, upload.content)

        provider_name = "deterministic"
        ai_model = None
        fallback_used = False
        provider_error_code = None
        provider_error_message = None
        message = f"Restoration completed using deterministic {mode.value} enhancement."

        if use_ai and ai_provider_error is not None:
            restored = self._deterministic_or_error(upload.content, mode, upload.image_format)
            output_extension = upload.extension
            fallback_used = True
            provider_error_code = ai_provider_error.code
            provider_error_message = ai_provider_error.safe_message
            self._log_provider_fallback(
                restoration_id,
                mode,
                provider_error_code,
                provider_error_message,
                ai_provider_error.exception_class,
                ai_provider_error.debug_message,
            )
            message = (
                f"AI restoration was requested but no configured provider was available. "
                f"Used deterministic {mode.value} fallback."
            )
        elif use_ai and ai_provider is None:
            restored = self._deterministic_or_error(upload.content, mode, upload.image_format)
            output_extension = upload.extension
            fallback_used = True
            provider_error_code = "gemini_unknown_error"
            provider_error_message = "Gemini provider is unavailable."
            self._log_provider_fallback(
                restoration_id,
                mode,
                provider_error_code,
                provider_error_message,
            )
            message = (
                f"AI restoration was requested but no configured provider was available. "
                f"Used deterministic {mode.value} fallback."
            )
        elif use_ai and ai_provider is not None:
            try:
                ai_result = await ai_provider.restore(
                    AIRestorationRequest(
                        image_bytes=upload.content,
                        mode=mode,
                        mime_type=self._mime_type_for_format(upload.image_format),
                        preservation_rules=_PRESERVATION_RULES,
                    )
                )
                try:
                    output_format = verify_image_bytes(ai_result.image_bytes)
                except Exception as exc:
                    raise AIProviderError(
                        "gemini_invalid_image_output",
                        "Gemini returned invalid image output.",
                        exception_class=exc.__class__.__name__,
                        debug_message=self._sanitize_log_message(str(exc)),
                    ) from exc
                output_extension = FORMAT_EXTENSIONS[output_format]
                restored = ai_result.image_bytes
                provider_name = ai_result.provider
                ai_model = ai_result.model
                message = f"Restoration completed using {ai_result.provider} with authenticity safeguards."
            except AIProviderError as exc:
                restored = self._deterministic_or_error(upload.content, mode, upload.image_format)
                output_extension = upload.extension
                fallback_used = True
                provider_error_code = exc.code
                provider_error_message = exc.safe_message
                self._log_provider_fallback(
                    restoration_id,
                    mode,
                    provider_error_code,
                    provider_error_message,
                    exc.exception_class,
                    exc.debug_message,
                )
                message = (
                    f"Gemini restoration was unavailable or returned no valid image. "
                    f"Used deterministic {mode.value} fallback."
                )
            except Exception as exc:
                restored = self._deterministic_or_error(upload.content, mode, upload.image_format)
                output_extension = upload.extension
                fallback_used = True
                provider_error_code = "gemini_unknown_error"
                provider_error_message = "Gemini restoration failed."
                self._log_provider_fallback(
                    restoration_id,
                    mode,
                    provider_error_code,
                    provider_error_message,
                    exc.__class__.__name__,
                    self._sanitize_log_message(str(exc)),
                )
                message = (
                    f"Gemini restoration was unavailable or returned no valid image. "
                    f"Used deterministic {mode.value} fallback."
                )
        else:
            restored = self._deterministic_or_error(upload.content, mode, upload.image_format)
            output_extension = upload.extension

        output_name = build_file_name(f"{restoration_id}_restored", output_extension)
        self.storage.save_output(output_name, restored)

        return RestorationResponse(
            id=restoration_id,
            original_file_name=upload.original_file_name,
            input_url=f"/uploads/input/{input_name}",
            output_url=f"/uploads/output/{output_name}",
            provider=provider_name,
            fallback_used=fallback_used,
            ai_model=ai_model,
            provider_error_code=provider_error_code,
            provider_error_message=provider_error_message,
            mode=mode,
            message=message,
        )

    @staticmethod
    def _log_provider_fallback(
        restoration_id: str,
        mode: RestorationMode,
        code: str,
        safe_message: str,
        exception_class: str | None = None,
        debug_message: str | None = None,
    ) -> None:
        logger.warning(
            "AI restoration fallback used. id=%s provider=gemini mode=%s code=%s reason=%s exception_class=%s debug=%s",
            restoration_id,
            mode.value,
            code,
            safe_message,
            exception_class,
            debug_message,
        )

    @staticmethod
    def _sanitize_log_message(message: str, max_length: int = 120) -> str:
        sanitized = re.sub(r"AIza[0-9A-Za-z_-]+", "[redacted]", message)
        sanitized = re.sub(r"(?i)(api[_-]?key=)[^&\s]+", r"\1[redacted]", sanitized)
        sanitized = re.sub(r"(?i)(x-goog-api-key:?\s*)[^\s]+", r"\1[redacted]", sanitized)
        sanitized = " ".join(sanitized.split())
        if len(sanitized) > max_length:
            return f"{sanitized[: max_length - 3]}..."
        return sanitized

    def _deterministic_or_error(
        self,
        content: bytes,
        mode: RestorationMode,
        image_format: str,
    ) -> bytes:
        try:
            return self._restore_image(content, mode, image_format)
        except (UnidentifiedImageError, OSError, cv2.error, ValueError):
            raise errors.processing_error()

    def _restore_image(
        self,
        content: bytes,
        mode: RestorationMode,
        image_format: str,
    ) -> bytes:
        with Image.open(BytesIO(content)) as image:
            rgb_image = ImageOps.exif_transpose(image).convert("RGB")

        rgb = np.array(rgb_image)
        restored = self._apply_pipeline(rgb, mode)

        output = BytesIO()
        Image.fromarray(restored).save(output, format=image_format, **self._save_options(image_format))
        return output.getvalue()

    def _apply_pipeline(self, rgb: np.ndarray, mode: RestorationMode) -> np.ndarray:
        profile = _MODE_PROFILES[mode]

        bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        denoised = cv2.fastNlMeansDenoisingColored(
            bgr,
            None,
            profile["denoise_luma"],
            profile["denoise_color"],
            7,
            21,
        )

        contrasted = self._enhance_contrast(denoised, profile["clahe_clip"])
        corrected = self._safe_color_balance(contrasted, profile["color_gain_limit"])
        sharpened = self._sharpen(corrected, profile["sharpen_amount"])
        upscaled = self._upscale_if_needed(sharpened, profile["upscale"])

        return cv2.cvtColor(upscaled, cv2.COLOR_BGR2RGB)

    @staticmethod
    def _enhance_contrast(bgr: np.ndarray, clip_limit: float) -> np.ndarray:
        lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
        lightness, channel_a, channel_b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
        enhanced_lightness = clahe.apply(lightness)
        return cv2.cvtColor(cv2.merge((enhanced_lightness, channel_a, channel_b)), cv2.COLOR_LAB2BGR)

    @staticmethod
    def _safe_color_balance(bgr: np.ndarray, gain_limit: float) -> np.ndarray:
        channels = cv2.split(bgr.astype(np.float32))
        means = [float(channel.mean()) for channel in channels]
        gray_mean = sum(means) / len(means)
        balanced = []

        for channel, mean in zip(channels, means, strict=True):
            if mean <= 0:
                balanced.append(channel)
                continue
            gain = np.clip(gray_mean / mean, 1.0 - gain_limit, 1.0 + gain_limit)
            balanced.append(np.clip(channel * gain, 0, 255))

        return cv2.merge(balanced).astype(np.uint8)

    @staticmethod
    def _sharpen(bgr: np.ndarray, amount: float) -> np.ndarray:
        blurred = cv2.GaussianBlur(bgr, (0, 0), sigmaX=1.0)
        return cv2.addWeighted(bgr, 1.0 + amount, blurred, -amount, 0)

    @staticmethod
    def _upscale_if_needed(bgr: np.ndarray, scale: float) -> np.ndarray:
        if scale <= 1.0:
            return bgr
        height, width = bgr.shape[:2]
        size = (int(round(width * scale)), int(round(height * scale)))
        return cv2.resize(bgr, size, interpolation=cv2.INTER_CUBIC)

    @staticmethod
    def _save_options(image_format: str) -> dict[str, int | bool]:
        if image_format == "JPEG":
            return {"quality": 95, "optimize": True}
        if image_format == "WEBP":
            return {"quality": 95, "method": 6}
        if image_format == "PNG":
            return {"optimize": True}
        return {}

    @staticmethod
    def _mime_type_for_format(image_format: str) -> str:
        if image_format == "JPEG":
            return "image/jpeg"
        if image_format == "PNG":
            return "image/png"
        if image_format == "WEBP":
            return "image/webp"
        return "application/octet-stream"


_MODE_PROFILES = {
    RestorationMode.CONSERVATIVE: {
        "denoise_luma": 3,
        "denoise_color": 3,
        "clahe_clip": 1.2,
        "color_gain_limit": 0.04,
        "sharpen_amount": 0.18,
        "upscale": 1.0,
    },
    RestorationMode.BALANCED: {
        "denoise_luma": 5,
        "denoise_color": 5,
        "clahe_clip": 1.6,
        "color_gain_limit": 0.06,
        "sharpen_amount": 0.25,
        "upscale": 1.25,
    },
    RestorationMode.STRONG: {
        "denoise_luma": 7,
        "denoise_color": 7,
        "clahe_clip": 2.0,
        "color_gain_limit": 0.08,
        "sharpen_amount": 0.32,
        "upscale": 1.5,
    },
}


_PRESERVATION_RULES = """
- Preserve exact composition and original geometry.
- Preserve all ornaments, motifs, lines, borders, text, and faces if present.
- Do not invent missing details or redesign any cultural pattern.
- Do not add or remove objects.
- Do not crop, rotate, stretch, or change aspect ratio.
- Enhance clarity only.
""".strip()
