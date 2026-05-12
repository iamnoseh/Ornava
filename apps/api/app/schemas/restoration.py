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
    mode: RestorationMode
    message: str
