# Technical Specification

## Stack

- Python
- FastAPI
- Pillow
- OpenCV
- NumPy
- Google Gen AI SDK (`google-genai`)
- Local filesystem storage

## Architecture

Routes are thin HTTP adapters. Business logic lives in services. Validation and filename generation live in utilities. AI providers live behind an abstraction and are called only by the restoration service when AI restoration is explicitly enabled.

## Backend Modules

- `app/main.py`: FastAPI app factory, middleware, routers, static upload serving.
- `app/core/config.py`: environment-driven settings.
- `app/core/errors.py`: consistent HTTP errors.
- `app/api/routes/health.py`: health endpoint.
- `app/api/routes/restoration.py`: upload endpoint.
- `app/services/storage_service.py`: local file writes.
- `app/services/restoration_service.py`: deterministic restoration pipeline.
- `app/services/ai/*`: provider interfaces, prompt rules, factory, and Gemini implementation.
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

`AIRestorationProvider` defines the interface for AI-assisted restoration. Routes do not import or call Gemini directly. The flow is:

```text
route -> RestorationService -> AIRestorationProvider
```

Gemini is selected through `AI_PROVIDER=gemini`. OpenAI remains a placeholder behind the same interface.

## AI Configuration

- `USE_AI_RESTORATION=false` by default.
- `GEMINI_API_KEY` must be set locally to call Gemini.
- `GEMINI_MODEL` defaults to `gemini-2.0-flash-preview-image-generation`, a model documented by Google for image responses with `response_modalities=["TEXT", "IMAGE"]`.

If Gemini is not configured, fails, or returns no valid image bytes, Ornava falls back to deterministic restoration and marks `fallback_used=true`.

## Gemini Limitation

Gemini image restoration depends on the selected model returning image output. Some Gemini models can understand images but only return text. Those models will trigger deterministic fallback rather than failing the request.
