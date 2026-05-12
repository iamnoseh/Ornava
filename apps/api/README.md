# Ornava API

FastAPI backend for the Ornava restoration MVP.

## Run Locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints

- `GET /api/health`
- `POST /api/restorations`

`POST /api/restorations` accepts multipart form data:

- `file`: image upload
- `mode`: `conservative`, `balanced`, or `strong`

## Storage

Input files are saved to `uploads/input`.
Restored files are saved to `uploads/output`.

The upload folders are ignored by Git except for `.gitkeep` placeholders.
