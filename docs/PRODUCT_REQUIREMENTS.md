# Product Requirements

## Product Name

Ornava

## Goal

Restore old, damaged, low-quality historical and national ornament images while preserving cultural and visual authenticity.

## Primary Users

- Cultural heritage researchers
- Designers referencing historical ornaments
- Museums and archives
- Students and educators
- Individuals preserving family or regional visual materials

## Core Principle

Authenticity is more important than beauty. Ornava should make the original image clearer, not more imaginative.

## MVP Scope

- Upload an image.
- Validate image type, MIME type, and size.
- Run deterministic restoration.
- Save original and restored images locally.
- Return URLs and metadata.

## Restoration Modes

- `conservative`: minimal denoise, contrast, and sharpening. Default mode.
- `balanced`: stronger readability improvements with modest upscaling.
- `strong`: more aggressive enhancement and upscaling, still non-generative.

## Out of Scope for MVP

- Frontend application.
- User accounts.
- Database persistence.
- Cloud storage.
- Frontend-controlled AI review workflows beyond optional OpenAI restoration.
- Batch processing.
- Manual masking or brush tools.
