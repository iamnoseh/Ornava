# API Contract

## GET `/api/health`

Returns API health and environment information.

```json
{
  "status": "ok",
  "app_name": "Ornava",
  "environment": "development"
}
```

## POST `/api/restorations`

Restores one uploaded image. Deterministic restoration is used when `use_ai=false`. OpenAI restoration is used when `use_ai=true`. If OpenAI fails, deterministic restoration is used as fallback.

### Request

Multipart form data:

- `file`: required image file.
- `mode`: optional restoration mode. Defaults to `conservative`.
- `use_ai`: optional boolean. `true` requests OpenAI, `false` forces deterministic restoration, omitted uses `USE_AI_RESTORATION`.

Accepted modes:

- `conservative`
- `balanced`
- `strong`

Accepted extensions and MIME types:

- `.jpg`, `.jpeg` / `image/jpeg`
- `.png` / `image/png`
- `.webp` / `image/webp`

### Response

The response shape is stable for deterministic, OpenAI, and fallback paths:

```json
{
  "id": "01HX...",
  "original_file_name": "ornament.jpg",
  "input_url": "/uploads/input/01HX...jpg",
  "output_url": "/uploads/output/01HX...png",
  "provider": "openai",
  "fallback_used": false,
  "ai_model": "gpt-image-1",
  "provider_error_code": null,
  "provider_error_message": null,
  "mode": "balanced",
  "message": "Restoration completed using openai with authenticity safeguards."
}
```

When `use_ai=false`:

```json
{
  "provider": "deterministic",
  "fallback_used": false,
  "ai_model": null,
  "provider_error_code": null,
  "provider_error_message": null
}
```

When OpenAI fails:

```json
{
  "provider": "deterministic",
  "fallback_used": true,
  "ai_model": null,
  "provider_error_code": "openai_api_key_missing",
  "provider_error_message": "OpenAI API key is missing."
}
```

Supported AI provider error codes:

- `openai_api_key_missing`
- `openai_model_not_configured`
- `openai_request_failed`
- `openai_no_image_output`
- `openai_invalid_image_output`
- `openai_quota_exceeded`
- `openai_rate_limited`
- `openai_unknown_error`

### Errors

- `400 unsupported_file_type`
- `400 invalid_mime_type`
- `400 corrupted_image`
- `413 file_too_large`
- `500 processing_error`

OpenAI failures should not return `500` if deterministic fallback succeeds.

## Manual Test Cases

- Deterministic: send `use_ai=false`; expect `provider=deterministic`, `fallback_used=false`, and null provider diagnostics.
- OpenAI: set `OPENAI_API_KEY` and send `use_ai=true`; expect `provider=openai`, `fallback_used=false`.
- Missing key fallback: unset `OPENAI_API_KEY` and send `use_ai=true`; expect `provider=deterministic`, `fallback_used=true`, and `provider_error_code=openai_api_key_missing`.
- Quota/rate-limit fallback: expect `provider=deterministic`, `fallback_used=true`, and `provider_error_code=openai_quota_exceeded` or `openai_rate_limited`.

## OpenAI Setup

```text
USE_AI_RESTORATION=true
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=auto
OPENAI_IMAGE_QUALITY=high
OPENAI_IMAGE_OUTPUT_FORMAT=png
```

The API key is read only by the backend. It must not be sent to the frontend or committed to source control.
