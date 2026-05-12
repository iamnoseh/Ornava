# Ornava Web

Production-quality multilingual frontend for Ornava, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Axios.

## Setup

```powershell
cd apps/web
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

The web app runs at:

```text
http://localhost:3000
```

## Environment

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

The API URL is read from `NEXT_PUBLIC_API_BASE_URL`; components do not hardcode the backend URL.

## Backend Dependency

Start the FastAPI backend before testing restoration:

```powershell
cd apps/api
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

## Language Support

The UI supports:

- Тоҷикӣ
- Русский
- English

Tajik is the default language. Visible UI copy comes from the typed dictionaries in:

```text
i18n/dictionaries.ts
i18n/types.ts
```

## Theme Support

The header includes a light/dark theme toggle.

- Initial theme respects system preference.
- Theme choice is persisted in `localStorage`.
- Dark mode uses a museum-tech palette.
- Light mode uses an old-paper heritage palette.

## Scripts

```powershell
npm run dev
npm run lint
npm run build
npm run typecheck
```

## Upload Flow

1. Start the FastAPI backend from `apps/api`.
2. Start the Next.js frontend from `apps/web`.
3. Open `http://localhost:3000`.
4. Choose a language in the header.
5. Toggle dark/light mode if desired.
6. Drop or select a `.jpg`, `.jpeg`, `.png`, or `.webp`.
7. Choose `conservative`, `balanced`, or `strong`.
8. Toggle AI restoration only when a backend AI provider is configured.
9. Click the restore button.

The UI shows before/after images, clean restoration status, fallback messaging, and a download button after a real backend response. Provider diagnostics are not shown to normal users.

## Expected Backend Response Shape

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
