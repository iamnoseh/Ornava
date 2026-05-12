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


class AIRestorationProvider(ABC):
    provider_name: str

    @abstractmethod
    async def restore(self, request: AIRestorationRequest) -> AIRestorationResult:
        """Restore an image while preserving original cultural and geometric details."""
