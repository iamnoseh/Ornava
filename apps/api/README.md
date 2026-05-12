# Ornava API

FastAPI backend for the Ornava restoration MVP.

## Run Locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Optional Gemini Configuration

Create `apps/api/.env` from the root `.env.example` and set:

```text
AI_PROVIDER=gemini
USE_AI_RESTORATION=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash-preview-image-generation
```

Gemini is disabled by default. Use `use_ai=true` per request or set `USE_AI_RESTORATION=true` to opt in globally.

## Endpoints

- `GET /api/health`
- `POST /api/restorations`

`POST /api/restorations` accepts multipart form data:

- `file`: image upload
- `mode`: `conservative`, `balanced`, or `strong`
- `use_ai`: optional boolean override for Gemini usage

The response includes `provider`, `fallback_used`, and `ai_model` metadata.

## Storage

Input files are saved to `uploads/input`.
Restored files are saved to `uploads/output`.

The upload folders are ignored by Git except for `.gitkeep` placeholders.
