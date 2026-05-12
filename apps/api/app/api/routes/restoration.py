from fastapi import APIRouter, File, Form, UploadFile

from app.core.config import get_settings
from app.schemas.restoration import RestorationMode, RestorationResponse
from app.services.ai.base import AIProviderError
from app.services.ai.factory import build_ai_provider
from app.services.restoration_service import RestorationService
from app.services.storage_service import StorageService
from app.utils.image_validation import validate_upload


router = APIRouter(tags=["restorations"])


@router.post("/restorations", response_model=RestorationResponse)
async def create_restoration(
    file: UploadFile = File(...),
    mode: RestorationMode = Form(default=RestorationMode.CONSERVATIVE),
    use_ai: bool | None = Form(default=None),
) -> RestorationResponse:
    settings = get_settings()
    upload = await validate_upload(file, settings.max_upload_bytes, settings.max_upload_mb)
    storage = StorageService(settings.input_dir, settings.output_dir)
    service = RestorationService(storage)
    should_use_ai = settings.use_ai_restoration if use_ai is None else use_ai
    ai_provider_error = None
    ai_provider = None
    if should_use_ai:
        try:
            ai_provider = build_ai_provider(settings)
        except AIProviderError as exc:
            ai_provider_error = exc

    return await service.restore(upload, mode, should_use_ai, ai_provider, ai_provider_error)
