from enum import Enum

from pydantic import BaseModel


class RestorationMode(str, Enum):
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    STRONG = "strong"


class RestorationResponse(BaseModel):
    id: str
    original_file_name: str
    input_url: str
    output_url: str
    provider: str
    fallback_used: bool
    ai_model: str | None
    provider_error_code: str | None
    provider_error_message: str | None
    mode: RestorationMode
    message: str
