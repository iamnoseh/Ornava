# API Contract

## GET `/api/health`

Returns API health and environment information.

### Response

```json
{
  "status": "ok",
  "app_name": "Ornava",
  "environment": "development"
}
```

## POST `/api/restorations`

Restores one uploaded image using deterministic image processing.

### Request

Multipart form data:

- `file`: required image file.
- `mode`: optional restoration mode. Defaults to `conservative`.

Accepted modes:

- `conservative`
- `balanced`
- `strong`

Accepted extensions:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Accepted MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`

### Response

```json
{
  "id": "01HX...",
  "original_file_name": "ornament.jpg",
  "input_url": "/uploads/input/01HX...jpg",
  "output_url": "/uploads/output/01HX...jpg",
  "mode": "conservative",
  "message": "Restoration completed using deterministic conservative enhancement."
}
```

### Errors

- `400 unsupported_file_type`
- `400 invalid_mime_type`
- `400 corrupted_image`
- `413 file_too_large`
- `500 processing_error`
