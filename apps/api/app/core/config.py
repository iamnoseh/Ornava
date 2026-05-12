from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Ornava", alias="APP_NAME")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    max_upload_mb: int = Field(default=10, alias="MAX_UPLOAD_MB")
    use_ai_restoration: bool = Field(default=False, alias="USE_AI_RESTORATION")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_image_model: str = Field(default="gpt-image-1", alias="OPENAI_IMAGE_MODEL")
    openai_image_size: str = Field(default="auto", alias="OPENAI_IMAGE_SIZE")
    openai_image_quality: str = Field(default="high", alias="OPENAI_IMAGE_QUALITY")
    openai_image_output_format: str = Field(default="png", alias="OPENAI_IMAGE_OUTPUT_FORMAT")
    upload_input_dir: str = Field(default="uploads/input", alias="UPLOAD_INPUT_DIR")
    upload_output_dir: str = Field(default="uploads/output", alias="UPLOAD_OUTPUT_DIR")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def api_root(self) -> Path:
        return Path(__file__).resolve().parents[2]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

    @property
    def input_dir(self) -> Path:
        return self._resolve_upload_dir(self.upload_input_dir)

    @property
    def output_dir(self) -> Path:
        return self._resolve_upload_dir(self.upload_output_dir)

    def _resolve_upload_dir(self, value: str) -> Path:
        path = Path(value)
        if not path.is_absolute():
            path = self.api_root / path
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()
