# AGENTS.md

## Project

Ornava is a production-grade AI web application for restoring old, damaged, low-quality historical and national ornament images.

## Non-Negotiable Product Rule

Restoration must preserve authenticity. The system may enhance visibility, reduce noise, and improve contrast, but it must not invent ornaments, add objects, remove cultural details, redesign patterns, change geometry, change faces, change text, change borders, or hallucinate missing details.

## Current Scope

- Backend MVP only.
- Python + FastAPI.
- Deterministic image processing with Pillow, OpenCV, and NumPy.
- Local filesystem storage.
- No database.
- No Docker.
- AI providers are abstracted but not called yet.

## Engineering Guidance

- Keep routes thin.
- Keep image processing deterministic until a reviewed AI provider implementation is added.
- Do not couple business logic or routes to Gemini/OpenAI SDKs.
- Treat uploaded files as hostile input.
- Preserve aspect ratio and original composition.
- Prefer readable, small modules over broad utility files.
