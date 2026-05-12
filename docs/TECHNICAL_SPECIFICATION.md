# Technical Specification

## Stack

- Python
- FastAPI
- Pillow
- OpenCV
- NumPy
- OpenAI Python SDK (`openai`)
- Local filesystem storage

## Architecture

Routes are thin HTTP adapters. Business logic lives in services. Validation and filename generation live in utilities. AI restoration lives behind an abstraction and is called only by the restoration service when AI restoration is enabled.

```text
route -> RestorationService -> OpenAIRestorationProvider
```

The frontend calls the same public API regardless of deterministic, OpenAI, or fallback behavior.

## Backend Modules

- `app/main.py`: FastAPI app factory, middleware, routers, static upload serving.
- `app/core/config.py`: environment-driven settings.
- `app/core/errors.py`: consistent HTTP errors.
- `app/api/routes/health.py`: health endpoint.
- `app/api/routes/restoration.py`: upload endpoint.
- `app/services/storage_service.py`: local file writes.
- `app/services/restoration_service.py`: deterministic pipeline, OpenAI orchestration, and fallback handling.
- `app/services/ai/*`: provider interface, OpenAI prompt rules, factory, and OpenAI implementation.
- `app/utils/image_validation.py`: extension, MIME, size, and image validation.
- `app/utils/file_names.py`: safe unique filename generation.

## Upload Storage

The API stores files under:

- `apps/api/uploads/input`
- `apps/api/uploads/output`

These directories are ignored except for `.gitkeep`.

## Deterministic Restoration Pipeline

1. Read and validate upload.
2. Verify image with Pillow.
3. Convert to RGB.
4. Apply mode-specific denoise.
5. Apply conservative CLAHE contrast enhancement in LAB color space.
6. Apply safe gray-world color correction with bounded gain.
7. Apply light unsharp masking.
8. Optionally upscale for balanced or strong mode.
9. Save restored output without cropping or aspect-ratio changes.

## OpenAI Image Restoration

`OpenAIRestorationProvider` uses the official OpenAI SDK from the backend only. It sends the validated source image and preservation prompt to the image editing API, requests the configured output format, validates returned image bytes with Pillow, and returns bytes plus metadata through `AIRestorationResult`.

OpenAI configuration:

- `USE_AI_RESTORATION` controls the default AI behavior when `use_ai` is omitted.
- `OPENAI_API_KEY` must be set locally to call OpenAI.
- `OPENAI_IMAGE_MODEL` defaults to `gpt-image-1`.
- `OPENAI_IMAGE_SIZE` defaults to `auto`.
- `OPENAI_IMAGE_QUALITY` defaults to `high`.
- `OPENAI_IMAGE_OUTPUT_FORMAT` defaults to `png`.

OpenAI failures are converted to short provider error codes:

- `openai_api_key_missing`
- `openai_model_not_configured`
- `openai_request_failed`
- `openai_no_image_output`
- `openai_invalid_image_output`
- `openai_quota_exceeded`
- `openai_rate_limited`
- `openai_unknown_error`

The provider never overwrites uploaded input files and never logs or returns API keys.

## Fallback Behavior

If `use_ai=false`, deterministic restoration is used and provider diagnostics are null.

If `use_ai=true` and OpenAI succeeds, the response uses `provider="openai"`, `fallback_used=false`, and the configured OpenAI model.

If OpenAI is missing, unavailable, rate-limited, over quota, or returns invalid image bytes, the response uses deterministic output with `provider="deterministic"`, `fallback_used=true`, and an `openai_*` error code.
