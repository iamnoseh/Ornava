# AI Restoration Rules

## Absolute Rules

Ornava must not:

- Invent unsupported ornaments.
- Add new objects.
- Remove cultural details.
- Redesign patterns.
- Change geometry.
- Change faces.
- Change text.
- Change borders.
- Hallucinate unsupported details.
- Crop the image.
- Change aspect ratio.

## Allowed Improvements

Ornava may:

- Reduce noise.
- Improve contrast.
- Recover faded colors naturally.
- Restore realistic material richness and texture.
- Repair damage conservatively when clearly implied by the source.
- Improve visibility of existing content.
- Upscale while preserving aspect ratio.

## OpenAI Prompt Requirements

OpenAI restoration must make the same object look professionally cleaned, repaired, color-recovered, and preserved while retaining identity, geometry, motifs, cultural authenticity, material realism, faces, and text.

Supported artifact types:

- carpets
- ornaments
- ceramics
- pottery
- textiles
- atlas clothing
- manuscripts
- old photographs
- cultural objects
- historical artworks

Mode behavior:

- `conservative`: identity preservation, minimal reconstruction, mild repair, natural color recovery.
- `balanced`: stronger cleaning and color recovery, moderate repair, exact identity preservation.
- `strong`: near-new professional restoration where strongly implied, while preserving identity and geometry.

## Runtime Safety

Requests can opt in with `use_ai=true`, or deployments can enable AI by default with `USE_AI_RESTORATION=true`. If OpenAI is missing, unavailable, rate-limited, over quota, or returns no valid image, the API must use deterministic restoration and report `fallback_used=true` with an `openai_*` error code.

## Review Standard

Outputs should be rejected if they look more attractive but less faithful. When in doubt, prefer weaker restoration.
