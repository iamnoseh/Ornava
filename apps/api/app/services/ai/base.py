from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.schemas.restoration import RestorationMode


@dataclass(frozen=True)
class AIRestorationRequest:
    image_bytes: bytes
    mode: RestorationMode
    mime_type: str
    preservation_rules: str


@dataclass(frozen=True)
class AIRestorationResult:
    image_bytes: bytes
    provider: str
    model: str
    notes: str


class AIProviderError(Exception):
    def __init__(
        self,
        code: str,
        safe_message: str,
        exception_class: str | None = None,
        debug_message: str | None = None,
    ) -> None:
        super().__init__(safe_message)
        self.code = code
        self.safe_message = safe_message
        self.exception_class = exception_class
        self.debug_message = debug_message


class AIRestorationProvider(ABC):
    provider_name: str

    @abstractmethod
    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        """Restore an image while preserving original cultural and geometric details."""
