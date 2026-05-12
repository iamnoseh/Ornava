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

## Gemini Prompt Requirements

Gemini prompts must explicitly instruct the model to:

- Preserve exact composition.
- Preserve original geometry and aspect ratio.
- Preserve all ornaments, motifs, lines, patterns, borders, text, and faces if present.
- Avoid inventing details.
- Avoid adding or removing objects.
- Avoid stylization.
- Avoid beautification beyond restoration.
- Enhance clarity only.
- Keep historical authenticity.

## Runtime Safety

AI restoration is disabled by default with `USE_AI_RESTORATION=false`. Requests can opt in with `use_ai=true`. If Gemini is missing, unavailable, or returns no valid image, the API must use deterministic restoration and report `fallback_used=true`.

## Review Standard

Outputs should be rejected if they look more attractive but less faithful. When in doubt, prefer weaker restoration.
