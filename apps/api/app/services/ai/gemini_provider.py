from app.services.ai.base import AIRestorationProvider, AIRestorationRequest, AIRestorationResult


class GeminiRestorationProvider(AIRestorationProvider):
    provider_name = "gemini"

    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        raise NotImplementedError("Gemini restoration is intentionally not enabled in the MVP.")
