import asyncio
import base64
from io import BytesIO
import re

from PIL import Image, UnidentifiedImageError

from app.services.ai.base import (
    AIRestorationProvider,
    AIRestorationRequest,
    AIRestorationResult,
    AIProviderError,
)
from app.services.ai.prompts import OPENAI_MODE_INSTRUCTIONS, OPENAI_RESTORATION_INSTRUCTIONS


class OpenAIRestorationProvider(AIRestorationProvider):
    provider_name = "openai"

    def __init__(
        self,
        api_key: str,
        model: str,
        size: str,
        quality: str,
        output_format: str,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.size = size
        self.quality = quality
        self.output_format = output_format

    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        return await asyncio.to_thread(self._restore_sync, request)

    def _restore_sync(self, request: AIRestorationRequest) -> AIRestorationResult:
        try:
            from openai import APIConnectionError, APIStatusError, OpenAI, OpenAIError, RateLimitError
        except ImportError as exc:
            raise AIProviderError(
                "openai_request_failed",
                "OpenAI SDK is unavailable.",
                exception_class=exc.__class__.__name__,
            ) from exc

        try:
            prompt = self._build_prompt(request)
            client = OpenAI(api_key=self.api_key)
            with self._open_image_file(request) as image_file:
                response = client.images.edit(**self._request_payload(image_file, prompt))
        except (UnidentifiedImageError, OSError) as exc:
            raise AIProviderError(
                "openai_invalid_image_output",
                "OpenAI input image was unreadable.",
                exception_class=exc.__class__.__name__,
                debug_message=self._sanitize_message(str(exc)),
            ) from exc
        except RateLimitError as exc:
            raise self._rate_limit_error(exc) from exc
        except (APIStatusError, APIConnectionError, OpenAIError) as exc:
            raise self._request_error(exc) from exc
        except Exception as exc:
            raise AIProviderError(
                "openai_unknown_error",
                "OpenAI restoration failed.",
                exception_class=exc.__class__.__name__,
                debug_message=self._sanitize_message(str(exc)),
            ) from exc

        image_bytes = self._extract_image_bytes(response)
        if image_bytes is None:
            raise AIProviderError(
                "openai_no_image_output",
                "OpenAI returned no image output.",
                exception_class="OpenAINoImageOutput",
            )

        self._validate_image_bytes(image_bytes)

        return AIRestorationResult(
            image_bytes=image_bytes,
            provider=self.provider_name,
            model=self.model,
            notes="OpenAI returned a restored image.",
        )

    def _request_payload(self, image_file: object, prompt: str) -> dict[str, object]:
        payload: dict[str, object] = {
            "model": self.model,
            "image": image_file,
            "prompt": prompt,
            "size": self.size,
            "quality": self.quality,
            "output_format": self.output_format,
        }

        if self.model == "gpt-image-1":
            payload["input_fidelity"] = "high"

        return payload

    def _open_image_file(self, request: AIRestorationRequest) -> BytesIO:
        if request.image_path is not None:
            image_bytes = request.image_path.read_bytes()
        else:
            image_bytes = request.image_bytes

        image_file = BytesIO(image_bytes)
        image_file.name = f"ornava-source{self._extension_for_mime_type(request.mime_type)}"
        return image_file

    @staticmethod
    def _build_prompt(request: AIRestorationRequest) -> str:
        mode_instruction = OPENAI_MODE_INSTRUCTIONS[request.mode.value]
        return (
            f"{OPENAI_RESTORATION_INSTRUCTIONS}\n\n"
            f"{mode_instruction}\n\n"
            "Additional preservation rules from Ornava:\n"
            f"{request.preservation_rules}"
        )

    @staticmethod
    def _extract_image_bytes(response: object) -> bytes | None:
        data = getattr(response, "data", None) or []
        if not data:
            return None

        first_image = data[0]
        b64_json = getattr(first_image, "b64_json", None)
        if isinstance(b64_json, str) and b64_json:
            return base64.b64decode(b64_json)

        return None

    @staticmethod
    def _validate_image_bytes(image_bytes: bytes) -> None:
        try:
            with Image.open(BytesIO(image_bytes)) as image:
                image.verify()
        except (UnidentifiedImageError, OSError) as exc:
            raise AIProviderError(
                "openai_invalid_image_output",
                "OpenAI returned invalid image output.",
                exception_class=exc.__class__.__name__,
                debug_message=OpenAIRestorationProvider._sanitize_message(str(exc)),
            ) from exc

    @staticmethod
    def _extension_for_mime_type(mime_type: str) -> str:
        if mime_type == "image/jpeg":
            return ".jpg"
        if mime_type == "image/png":
            return ".png"
        if mime_type == "image/webp":
            return ".webp"
        return ".png"

    @staticmethod
    def _rate_limit_error(exc: Exception) -> AIProviderError:
        code = "openai_quota_exceeded" if OpenAIRestorationProvider._is_quota_error(exc) else "openai_rate_limited"
        safe_message = (
            "OpenAI quota was exceeded."
            if code == "openai_quota_exceeded"
            else "OpenAI rate limit was exceeded."
        )
        return AIProviderError(
            code,
            safe_message,
            exception_class=exc.__class__.__name__,
            debug_message=OpenAIRestorationProvider._sanitize_exception_summary(exc),
        )

    @staticmethod
    def _request_error(exc: Exception) -> AIProviderError:
        code = "openai_quota_exceeded" if OpenAIRestorationProvider._is_quota_error(exc) else "openai_request_failed"
        safe_message = "OpenAI quota was exceeded." if code == "openai_quota_exceeded" else "OpenAI request failed."
        return AIProviderError(
            code,
            safe_message,
            exception_class=exc.__class__.__name__,
            debug_message=OpenAIRestorationProvider._sanitize_exception_summary(exc),
        )

    @staticmethod
    def _is_quota_error(exc: Exception) -> bool:
        error_code = str(getattr(exc, "code", "") or "").lower()
        body = getattr(exc, "body", None)
        if isinstance(body, dict):
            error = body.get("error")
            if isinstance(error, dict):
                error_code = f"{error_code} {error.get('code', '')}".lower()
        message = str(exc).lower()
        return "insufficient_quota" in error_code or "quota" in message

    @staticmethod
    def _sanitize_exception_summary(exc: Exception) -> str:
        message = str(exc) or exc.__class__.__name__
        return OpenAIRestorationProvider._sanitize_message(message, max_length=90)

    @staticmethod
    def _sanitize_message(message: str, max_length: int = 120) -> str:
        sanitized = re.sub(r"sk-[0-9A-Za-z_-]+", "[redacted]", message)
        sanitized = re.sub(r"(?i)(api[_-]?key=)[^&\s]+", r"\1[redacted]", sanitized)
        sanitized = re.sub(r"(?i)(authorization:\s*bearer\s+)[^\s]+", r"\1[redacted]", sanitized)
        sanitized = " ".join(sanitized.split())
        if len(sanitized) > max_length:
            return f"{sanitized[: max_length - 3]}..."
        return sanitized
