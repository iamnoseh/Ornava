# Ornava

Ornava restores old, damaged, low-quality historical and national ornament images using authenticity-first restoration.

The backend uses deterministic image processing when AI is disabled and OpenAI image restoration when AI is requested. If OpenAI is missing, unavailable, rate-limited, over quota, or returns invalid output, Ornava falls back to deterministic restoration without breaking the public API contract.

## Product Rule

Ornava must enhance and restore the original image only. It must not invent new ornaments, add new objects, remove cultural details, redesign patterns, change geometry, change faces, change text, change borders, or hallucinate unsupported details.

## Repository Layout

```text
apps/api/        FastAPI backend
apps/web/        Next.js frontend
docs/            Product and technical documentation
samples/         Sample input and expected reference folders
scripts/         Future maintenance scripts
```

## Backend Setup

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item ..\..\.env.example .env
notepad .env
```

Set `OPENAI_API_KEY` in `.env` only. Do not commit real API keys.

## Backend Configuration

```text
APP_NAME=Ornava
ENVIRONMENT=development
MAX_UPLOAD_MB=10
USE_AI_RESTORATION=true
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=auto
OPENAI_IMAGE_QUALITY=high
OPENAI_IMAGE_OUTPUT_FORMAT=png
UPLOAD_INPUT_DIR=uploads/input
UPLOAD_OUTPUT_DIR=uploads/output
```

## Run Backend

```powershell
cd apps/api
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

## Run Frontend

```powershell
cd apps/web
npm install
npm run dev
```

The web app runs at `http://localhost:3000`.

## Manual Tests

Deterministic:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "conservative"
  use_ai = "false"
}
```

Expected: `provider=deterministic`, `fallback_used=false`, `provider_error_code=$null`.

OpenAI:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "balanced"
  use_ai = "true"
}
```

Expected: `provider=openai`, `fallback_used=false`, `provider_error_code=$null`.

Missing OpenAI key fallback:

```powershell
$env:OPENAI_API_KEY=""
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/restorations -Method Post -Form @{
  file = Get-Item "C:\path\to\historical-image.jpg"
  mode = "conservative"
  use_ai = "true"
}
```

Expected: `provider=deterministic`, `fallback_used=true`, `provider_error_code=openai_api_key_missing`.

Quota or rate-limit fallback returns deterministic output with `openai_quota_exceeded` or `openai_rate_limited`.

## Current Limitations

- No database or user accounts.
- Local filesystem storage only.
- Uploaded input and output files are served by the local FastAPI app for MVP convenience.
- AI restoration depends on OpenAI image API availability and account limits.
