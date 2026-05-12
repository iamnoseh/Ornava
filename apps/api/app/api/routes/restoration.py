from fastapi import APIRouter, File, Form, UploadFile

from app.core.config import get_settings
from app.schemas.restoration import RestorationMode, RestorationResponse
from app.services.restoration_service import RestorationService
from app.services.storage_service import StorageService
from app.utils.image_validation import validate_upload


router = APIRouter(tags=["restorations"])


@router.post("/restorations", response_model=RestorationResponse)
async def create_restoration(
    file: UploadFile = File(...),
    mode: RestorationMode = Form(default=RestorationMode.CONSERVATIVE),
) -> RestorationResponse:
    settings = get_settings()
    upload = await validate_upload(file, settings.max_upload_bytes, settings.max_upload_mb)
    storage = StorageService(settings.input_dir, settings.output_dir)
    service = RestorationService(storage)
    return service.restore(upload, mode)
