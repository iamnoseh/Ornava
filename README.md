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
```

## Current Limitations

- Restoration is deterministic only; Gemini/OpenAI are not called yet.
- No database or user accounts.
- Local filesystem storage only.
- Uploaded input and output files are served by the local FastAPI app for MVP convenience.
- No frontend is included yet.
