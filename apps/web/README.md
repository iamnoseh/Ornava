# Ornava Web

Production-quality frontend MVP for Ornava, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Axios.

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

The backend should be running at:

```text
http://127.0.0.1:8000
```

## Environment

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Scripts

```powershell
npm run dev
npm run build
npm run typecheck
npm run lint
```

## Upload Flow

1. Start the FastAPI backend from `apps/api`.
2. Start the Next.js frontend from `apps/web`.
3. Open `http://localhost:3000`.
4. Drop or select a `.jpg`, `.jpeg`, `.png`, or `.webp`.
5. Choose `conservative`, `balanced`, or `strong`.
6. Toggle AI restoration only when Gemini is configured.
7. Click `Restore Image`.

The UI shows before/after images, provider metadata, fallback status, provider diagnostics, and a download button.
