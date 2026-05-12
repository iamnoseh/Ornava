from app.core.config import Settings
from app.services.ai.base import AIRestorationProvider, AIProviderError
from app.services.ai.gemini_provider import GeminiRestorationProvider


def build_ai_provider(settings: Settings) -> AIRestorationProvider | None:
    if settings.ai_provider.lower() != "gemini":
        return None

    api_key = settings.gemini_api_key.strip() if settings.gemini_api_key else ""
    model = settings.gemini_model.strip() if settings.gemini_model else ""

    if not api_key:
        raise AIProviderError("gemini_api_key_missing", "Gemini API key is missing.")

    if not model:
        raise AIProviderError("gemini_model_not_configured", "Gemini model is not configured.")

    return GeminiRestorationProvider(
        api_key=api_key,
        model=model,
    )
