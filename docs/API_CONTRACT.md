# API Contract

## GET `/api/health`

Returns API health and environment information.

### Response

```json
{
  "status": "ok",
  "app_name": "Ornava",
  "environment": "development"
}
```

## POST `/api/restorations`

Restores one uploaded image. Deterministic restoration remains the default. Gemini can be requested when configured.

### Request

Multipart form data:

- `file`: required image file.
- `mode`: optional restoration mode. Defaults to `conservative`.
- `use_ai`: optional boolean. `true` requests Gemini, `false` forces deterministic restoration, omitted uses `USE_AI_RESTORATION`.

Accepted modes:

- `conservative`
- `balanced`
- `strong`

Accepted extensions:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Accepted MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`

### Response

```json
{
  "id": "01HX...",
  "original_file_name": "ornament.jpg",
  "input_url": "/uploads/input/01HX...jpg",
  "output_url": "/uploads/output/01HX...jpg",
  "provider": "deterministic",
  "fallback_used": false,
  "ai_model": null,
  "provider_error_code": null,
  "provider_error_message": null,
  "mode": "conservative",
  "message": "Restoration completed using deterministic conservative enhancement."
}
```

When Gemini succeeds:

```json
{
  "id": "01HX...",
  "original_file_name": "ornament.jpg",
  "input_url": "/uploads/input/01HX...jpg",
  "output_url": "/uploads/output/01HX...png",
  "provider": "gemini",
  "fallback_used": false,
  "ai_model": "gemini-2.0-flash-preview-image-generation",
  "provider_error_code": null,
  "provider_error_message": null,
  "mode": "conservative",
  "message": "Restoration completed using gemini with authenticity safeguards."
}
```

When Gemini is requested but unavailable:

```json
{
  "id": "01HX...",
  "original_file_name": "ornament.jpg",
  "input_url": "/uploads/input/01HX...jpg",
  "output_url": "/uploads/output/01HX...jpg",
  "provider": "deterministic",
  "fallback_used": true,
  "ai_model": null,
  "provider_error_code": "gemini_api_key_missing",
  "provider_error_message": "Gemini API key is missing.",
  "mode": "conservative",
  "message": "AI restoration was requested but no configured provider was available. Used deterministic conservative fallback."
}
```

Provider error codes are short, non-secret diagnostics:

- `gemini_api_key_missing`
- `gemini_model_not_configured`
- `gemini_quota_exceeded`
- `gemini_sdk_error`
- `gemini_no_image_output`
- `gemini_invalid_image_output`
- `gemini_unknown_error`

When `use_ai=false`, `provider_error_code` and `provider_error_message` are always `null`.

### Errors

- `400 unsupported_file_type`
- `400 invalid_mime_type`
- `400 corrupted_image`
- `413 file_too_large`
- `500 processing_error`

AI provider failures should not return `500` if deterministic fallback succeeds.

## Manual Test Cases

- Deterministic: send `use_ai=false`; expect provider diagnostics to be `null`.
- Gemini: set `GEMINI_API_KEY`, use a model that supports image responses, and send `use_ai=true`.
- Missing key fallback: unset `GEMINI_API_KEY` and send `use_ai=true`; expect `provider=deterministic`, `fallback_used=true`, and `provider_error_code=gemini_api_key_missing`.
- Quota fallback: if Gemini returns `429 RESOURCE_EXHAUSTED`, expect `provider=deterministic`, `fallback_used=true`, `provider_error_code=gemini_quota_exceeded`, and `provider_error_message=Gemini quota or rate limit exceeded.`
- Invalid file: upload a `.txt` file; expect `400 unsupported_file_type`.
- Large file: upload a file above `MAX_UPLOAD_MB`; expect `413 file_too_large`.

## Gemini Debugging

The configured image model is:

```text
GEMINI_MODEL=gemini-2.0-flash-preview-image-generation
```

If `provider_error_code` remains `gemini_sdk_error`, inspect backend logs for the non-secret `exception_class` and short sanitized `debug` value. Common checks:

- Confirm `google-genai` is installed in the active virtual environment.
- Confirm the API key is present in `apps/api/.env`.
- Confirm the server was restarted after changing `.env`.
- Confirm the configured model supports image output.
- Confirm the Google AI Studio project has access to the Gemini API.
- If the log mentions `429` or `RESOURCE_EXHAUSTED`, Ornava should report `gemini_quota_exceeded`.
