from io import BytesIO

import cv2
import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core import errors
from app.schemas.restoration import RestorationMode, RestorationResponse
from app.services.storage_service import StorageService
from app.utils.file_names import build_file_name, unique_file_stem
from app.utils.image_validation import ValidatedUpload


class RestorationService:
    def __init__(self, storage: StorageService) -> None:
        self.storage = storage

    def restore(self, upload: ValidatedUpload, mode: RestorationMode) -> RestorationResponse:
        restoration_id = unique_file_stem()
        input_name = build_file_name(restoration_id, upload.extension)
        output_name = build_file_name(f"{restoration_id}_restored", upload.extension)

        self.storage.save_input(input_name, upload.content)

        try:
            restored = self._restore_image(upload.content, mode, upload.image_format)
        except (UnidentifiedImageError, OSError, cv2.error, ValueError):
            raise errors.processing_error()

        self.storage.save_output(output_name, restored)

        return RestorationResponse(
            id=restoration_id,
            original_file_name=upload.original_file_name,
            input_url=f"/uploads/input/{input_name}",
            output_url=f"/uploads/output/{output_name}",
            mode=mode,
            message=f"Restoration completed using deterministic {mode.value} enhancement.",
        )

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
