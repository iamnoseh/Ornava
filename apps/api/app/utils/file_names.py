from pathlib import Path
from uuid import uuid4


def original_display_name(file_name: str | None) -> str:
    if not file_name:
        return "uploaded-image"
    return Path(file_name).name


def unique_file_stem() -> str:
    return uuid4().hex


def build_file_name(stem: str, extension: str) -> str:
    normalized = extension.lower()
    if not normalized.startswith("."):
        normalized = f".{normalized}"
    return f"{stem}{normalized}"
