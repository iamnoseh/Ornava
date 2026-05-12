# Technical Specification

## Stack

- Python
- FastAPI
- Pillow
- OpenCV
- NumPy
- Local filesystem storage

## Architecture

Routes are thin HTTP adapters. Business logic lives in services. Validation and filename generation live in utilities. AI providers live behind an abstraction and are not called by the MVP restoration flow.

## Backend Modules

- `app/main.py`: FastAPI app factory, middleware, routers, static upload serving.
- `app/core/config.py`: environment-driven settings.
- `app/core/errors.py`: consistent HTTP errors.
- `app/api/routes/health.py`: health endpoint.
- `app/api/routes/restoration.py`: upload endpoint.
- `app/services/storage_service.py`: local file writes.
- `app/services/restoration_service.py`: deterministic restoration pipeline.
- `app/services/ai/*`: future provider interfaces.
- `app/utils/image_validation.py`: extension, MIME, size, and image validation.
- `app/utils/file_names.py`: safe unique filename generation.

## Upload Storage

The API stores files under:

- `apps/api/uploads/input`
- `apps/api/uploads/output`

These directories are ignored except for `.gitkeep`.

## Restoration Pipeline

1. Read and validate upload.
2. Verify image with Pillow.
3. Convert to RGB.
4. Apply mode-specific denoise.
5. Apply conservative CLAHE contrast enhancement in LAB color space.
6. Apply safe gray-world color correction with bounded gain.
7. Apply light unsharp masking.
8. Optionally upscale for balanced or strong mode.
9. Save restored output without cropping or aspect-ratio changes.

## AI Provider Abstraction

`AIRestorationProvider` defines the future interface for AI-assisted restoration. Gemini and OpenAI providers implement the interface as placeholders and raise `NotImplementedError` until real provider integrations are approved.
