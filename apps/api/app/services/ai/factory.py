from app.core.config import Settings
from app.services.ai.base import AIRestorationProvider, AIProviderError
from app.services.ai.openai_provider import OpenAIRestorationProvider


def build_ai_provider(settings: Settings) -> AIRestorationProvider:
    api_key = settings.openai_api_key.strip() if settings.openai_api_key else ""
    model = settings.openai_image_model.strip() if settings.openai_image_model else ""

    if not api_key:
        raise AIProviderError("openai_api_key_missing", "OpenAI API key is missing.")

    if not model:
        raise AIProviderError("openai_model_not_configured", "OpenAI image model is not configured.")

    return OpenAIRestorationProvider(
        api_key=api_key,
        model=model,
        size=settings.openai_image_size.strip() if settings.openai_image_size else "auto",
        quality=settings.openai_image_quality.strip() if settings.openai_image_quality else "high",
        output_format=settings.openai_image_output_format.strip()
        if settings.openai_image_output_format
        else "png",
    )
