# AI Restoration Rules

## Absolute Rules

Ornava must not:

- Invent new ornaments.
- Add new objects.
- Remove cultural details.
- Redesign patterns.
- Change geometry.
- Change faces.
- Change text.
- Change borders.
- Hallucinate missing details.
- Crop the image.
- Change aspect ratio.

## Allowed Improvements

Ornava may:

- Reduce noise.
- Improve contrast.
- Correct mild color cast.
- Lightly sharpen existing details.
- Upscale while preserving aspect ratio.
- Improve visibility of existing content.

## Provider Requirements

Any future Gemini or OpenAI integration must:

- Use prompts that explicitly forbid invention.
- Preserve source composition and geometry.
- Return traceable metadata about provider, model, and mode.
- Be reviewed against cultural-authenticity test images.
- Provide a fallback to deterministic restoration.

## Review Standard

Outputs should be rejected if they look more attractive but less faithful. When in doubt, prefer weaker restoration.
