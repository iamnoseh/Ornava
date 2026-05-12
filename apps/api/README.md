# Ornava API

FastAPI backend for Ornava restoration.

## Run Locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item ..\..\.env.example .env
uvicorn app.main:app --reload
```

## OpenAI Configuration

```text
USE_AI_RESTORATION=true
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=auto
OPENAI_IMAGE_QUALITY=high
OPENAI_IMAGE_OUTPUT_FORMAT=png
```

`OPENAI_API_KEY` is backend-only. Never expose it to the frontend or commit it.

## Endpoints

- `GET /api/health`
- `POST /api/restorations`

`POST /api/restorations` accepts multipart form data:

- `file`: image upload
- `mode`: `conservative`, `balanced`, or `strong`
- `use_ai`: optional boolean override for AI usage

The response includes `provider`, `fallback_used`, `ai_model`, and safe provider error metadata.

If OpenAI fails, the backend falls back to deterministic restoration and returns a safe code such as `openai_api_key_missing`, `openai_quota_exceeded`, `openai_rate_limited`, `openai_no_image_output`, or `openai_request_failed`.

## Manual Test Commands

Deterministic:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "conservative"
  use_ai = "false"
}
```

OpenAI:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "balanced"
  use_ai = "true"
}
```

Missing key fallback:

```powershell
$env:OPENAI_API_KEY=""
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "conservative"
  use_ai = "true"
}
```

Expected quota/rate-limit fallback codes:

```text
openai_quota_exceeded
openai_rate_limited
```

## Storage

Input files are saved to `uploads/input`.
Restored files are saved to `uploads/output`.

The upload folders are ignored by Git except for `.gitkeep` placeholders.
