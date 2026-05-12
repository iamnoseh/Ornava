from app.services.ai.base import AIRestorationProvider, AIRestorationRequest, AIRestorationResult


class OpenAIRestorationProvider(AIRestorationProvider):
    provider_name = "openai"

    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        raise NotImplementedError("OpenAI restoration is intentionally not enabled in the MVP.")
