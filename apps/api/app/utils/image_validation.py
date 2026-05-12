from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.core import errors
from app.utils.file_names import original_display_name


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
FORMAT_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


@dataclass(frozen=True)
class ValidatedUpload:
    content: bytes
    original_file_name: str
    extension: str
    image_format: str


async def validate_upload(
    file: UploadFile,
    max_upload_bytes: int,
    max_upload_mb: int,
) -> ValidatedUpload:
    original_name = original_display_name(file.filename)
    requested_extension = Path(original_name).suffix.lower()
    if requested_extension not in ALLOWED_EXTENSIONS:
        raise errors.unsupported_file_type()

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise errors.invalid_mime_type()

    content = await _read_with_size_limit(file, max_upload_bytes, max_upload_mb)
    image_format = _verify_image(content)

    extension = FORMAT_EXTENSIONS.get(image_format)
    if extension is None:
        raise errors.unsupported_file_type()

    return ValidatedUpload(
        content=content,
        original_file_name=original_name,
        extension=extension,
        image_format=image_format,
    )


async def _read_with_size_limit(
    file: UploadFile,
    max_upload_bytes: int,
    max_upload_mb: int,
) -> bytes:
    chunks: list[bytes] = []
    total = 0

    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_upload_bytes:
            raise errors.file_too_large(max_upload_mb)
        chunks.append(chunk)

    return b"".join(chunks)


def _verify_image(content: bytes) -> str:
    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()
            image_format = image.format
    except (UnidentifiedImageError, OSError):
        raise errors.corrupted_image()

    if image_format not in FORMAT_EXTENSIONS:
        raise errors.unsupported_file_type()

    return image_format
