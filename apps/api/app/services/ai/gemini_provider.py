import asyncio
import base64
from io import BytesIO
import logging
import re

from PIL import Image, UnidentifiedImageError

from app.services.ai.base import (
    AIRestorationProvider,
    AIRestorationRequest,
    AIRestorationResult,
    AIProviderError,
)
from app.services.ai.prompts import GEMINI_RESTORATION_INSTRUCTIONS


logger = logging.getLogger(__name__)


class GeminiRestorationProvider(AIRestorationProvider):
    provider_name = "gemini"

    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        return await asyncio.to_thread(self._restore_sync, request)

    def _restore_sync(self, request: AIRestorationRequest) -> AIRestorationResult:
        try:
            from google import genai
            from google.genai import types
        except ImportError as exc:
            raise self._sdk_error(exc, "Gemini SDK is unavailable.") from exc

        try:
            image = Image.open(BytesIO(request.image_bytes)).convert("RGB")
            client = genai.Client(api_key=self.api_key)
            prompt = self._build_prompt(request)

            response = client.models.generate_content(
                model=self.model,
                contents=[prompt, image],
                config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"]),
            )
        except (UnidentifiedImageError, OSError) as exc:
            raise AIProviderError(
                "gemini_invalid_image_output",
                "Gemini input image was unreadable.",
                exception_class=exc.__class__.__name__,
                debug_message=self._sanitize_message(str(exc)),
            ) from exc
        except Exception as exc:
            raise self._sdk_error(exc, "Gemini request failed.") from exc

        image_bytes, text_preview = self._extract_image_bytes_and_text_preview(response)
        if image_bytes is None:
            if text_preview:
                logger.warning("Gemini response had text but no image. text_preview=%s", text_preview)
            raise AIProviderError(
                "gemini_no_image_output",
                "Gemini returned no image output.",
                exception_class="GeminiNoImageOutput",
                debug_message=f"text_preview={text_preview}" if text_preview else None,
            )

        return AIRestorationResult(
            image_bytes=image_bytes,
            provider=self.provider_name,
            model=self.model,
            notes="Gemini returned an image candidate.",
        )

    @staticmethod
    def _build_prompt(request: AIRestorationRequest) -> str:
        return (
            f"{GEMINI_RESTORATION_INSTRUCTIONS}\n\n"
            f"Restoration mode: {request.mode.value}.\n"
            "Use the mode only to choose restoration strength, never to increase creativity.\n"
            f"Additional preservation rules:\n{request.preservation_rules}"
        )

    @staticmethod
    def _extract_image_bytes_and_text_preview(response: object) -> tuple[bytes | None, str | None]:
        text_parts: list[str] = []

        response_parts = getattr(response, "parts", None) or []
        image_bytes = GeminiRestorationProvider._extract_from_parts(response_parts, text_parts)
        if image_bytes is not None:
            return image_bytes, GeminiRestorationProvider._text_preview(text_parts)

        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", None) or []
            image_bytes = GeminiRestorationProvider._extract_from_parts(parts, text_parts)
            if image_bytes is not None:
                return image_bytes, GeminiRestorationProvider._text_preview(text_parts)

        return None, GeminiRestorationProvider._text_preview(text_parts)

    @staticmethod
    def _extract_from_parts(parts: object, text_parts: list[str]) -> bytes | None:
        for part in parts:
            text = getattr(part, "text", None)
            if text:
                text_parts.append(str(text))

            inline_data = getattr(part, "inline_data", None)
            if inline_data is None:
                continue

            data = getattr(inline_data, "data", None)
            if isinstance(data, bytes):
                return data
            if isinstance(data, str):
                return base64.b64decode(data)

        return None

    @staticmethod
    def _text_preview(text_parts: list[str]) -> str | None:
        if not text_parts:
            return None
        return GeminiRestorationProvider._sanitize_message(" ".join(text_parts), max_length=160)

    @staticmethod
    def _sdk_error(exc: Exception, fallback_message: str) -> AIProviderError:
        if GeminiRestorationProvider._is_quota_error(exc):
            summary = GeminiRestorationProvider._sanitize_exception_summary(exc)
            return AIProviderError(
                "gemini_quota_exceeded",
                "Gemini quota or rate limit exceeded.",
                exception_class=exc.__class__.__name__,
                debug_message=summary,
            )

        summary = GeminiRestorationProvider._sanitize_exception_summary(exc)
        return AIProviderError(
            "gemini_sdk_error",
            f"{fallback_message}: {summary}" if summary else fallback_message,
            exception_class=exc.__class__.__name__,
            debug_message=summary,
        )

    @staticmethod
    def _is_quota_error(exc: Exception) -> bool:
        status_code = getattr(exc, "status_code", None) or getattr(exc, "code", None)
        status = str(getattr(exc, "status", "") or getattr(exc, "reason", "")).upper()
        message = str(exc).upper()

        return (
            str(status_code) == "429"
            or "RESOURCE_EXHAUSTED" in status
            or "RESOURCE_EXHAUSTED" in message
            or ("429" in message and ("QUOTA" in message or "RATE" in message))
        )

    @staticmethod
    def _sanitize_exception_summary(exc: Exception) -> str:
        message = str(exc) or exc.__class__.__name__
        return GeminiRestorationProvider._sanitize_message(message, max_length=90)

    @staticmethod
    def _sanitize_message(message: str, max_length: int = 120) -> str:
        sanitized = re.sub(r"AIza[0-9A-Za-z_-]+", "[redacted]", message)
        sanitized = re.sub(r"(?i)(api[_-]?key=)[^&\s]+", r"\1[redacted]", sanitized)
        sanitized = re.sub(r"(?i)(x-goog-api-key:?\s*)[^\s]+", r"\1[redacted]", sanitized)
        sanitized = " ".join(sanitized.split())
        if len(sanitized) > max_length:
            return f"{sanitized[: max_length - 3]}..."
        return sanitized
