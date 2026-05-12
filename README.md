# Ornava

Ornava restores old, damaged, low-quality historical and national ornament images using conservative, authenticity-first image restoration.

The MVP backend uses deterministic image processing before any generative AI. It improves readability through safe denoising, contrast enhancement, color correction, sharpening, and optional upscaling while preserving the original composition and geometry.

## Product Rule

Ornava must enhance and restore the original image only. It must not invent new ornaments, add new objects, remove cultural details, redesign patterns, change geometry, change faces, change text, change borders, or hallucinate missing details.

## Repository Layout

```text
apps/api/        FastAPI backend
docs/            Product and technical documentation
samples/         Sample input and expected reference folders
scripts/         Future maintenance scripts
```

## Setup

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Optional Gemini setup:

```powershell
Copy-Item ..\..\.env.example .env
notepad .env
```

Set `GEMINI_API_KEY` in `.env` only. Keep `USE_AI_RESTORATION=false` unless AI restoration should be enabled by default.

## Run Backend

```powershell
uvicorn app.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

## Test Health Endpoint

PowerShell:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/health
```

curl:

```bash
curl http://127.0.0.1:8000/api/health
```

## Test Image Upload

PowerShell:

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item "..\..\samples\input\sample.jpg"
    mode = "conservative"
  }
```

curl:

```bash
curl -X POST "http://127.0.0.1:8000/api/restorations" \
  -F "file=@../../samples/input/sample.jpg" \
  -F "mode=conservative"
```

## Configuration

Copy `.env.example` to `.env` if you need local overrides.

```text
APP_NAME=Ornava
ENVIRONMENT=development
MAX_UPLOAD_MB=10
AI_PROVIDER=gemini
USE_AI_RESTORATION=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash-preview-image-generation
```

## Current Limitations

- Gemini is optional and disabled by default. If enabled but unavailable, the API falls back to deterministic restoration.
- Gemini image output depends on using a model that supports image responses.
- No database or user accounts.
- Local filesystem storage only.
- Uploaded input and output files are served by the local FastAPI app for MVP convenience.
- No frontend is included yet.

## AI Restoration Tests

Deterministic mode:

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item "..\..\samples\input\sample.jpg"
    mode = "conservative"
    use_ai = "false"
  }
```

Expected diagnostic fields: `provider_error_code` and `provider_error_message` are `null`.

Gemini mode:

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item "..\..\samples\input\sample.jpg"
    mode = "conservative"
    use_ai = "true"
  }
```

Expected diagnostic fields: `provider_error_code` and `provider_error_message` are `null` when Gemini succeeds.

Fallback with missing API key:

```powershell
$env:GEMINI_API_KEY=""
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item "..\..\samples\input\sample.jpg"
    mode = "conservative"
    use_ai = "true"
}
```

Expected diagnostic fields: `fallback_used` is `true` and `provider_error_code` is `gemini_api_key_missing`.

Quota or rate-limit fallback:

If Gemini returns `429 RESOURCE_EXHAUSTED`, the request falls back to deterministic restoration with:

```text
provider_error_code=gemini_quota_exceeded
provider_error_message=Gemini quota or rate limit exceeded.
```

If `provider_error_code` remains `gemini_sdk_error`, check:

- `GEMINI_MODEL=gemini-2.0-flash-preview-image-generation`
- `google-genai` is installed in the active `apps/api/.venv`
- the API key is valid and enabled for the Gemini API
- the server was restarted after editing `.env`
- the backend logs for `exception_class` and the short sanitized `debug` value
- whether the configured model is available in your Google AI Studio account and region
- if logs mention `429` or `RESOURCE_EXHAUSTED`, Ornava should report `gemini_quota_exceeded`

Invalid file:

```powershell
Set-Content -Path .\not-an-image.txt -Value "not an image"
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item ".\not-an-image.txt"
    mode = "conservative"
  }
```

Large file:

```powershell
$bytes = New-Object byte[] (11MB)
[System.IO.File]::WriteAllBytes(".\too-large.jpg", $bytes)
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/restorations `
  -Method Post `
  -Form @{
    file = Get-Item ".\too-large.jpg"
    mode = "conservative"
  }
```
