from fastapi import HTTPException, status


def unsupported_file_type() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"code": "unsupported_file_type", "message": "Unsupported image file type."},
    )


def invalid_mime_type() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"code": "invalid_mime_type", "message": "Invalid image MIME type."},
    )


def file_too_large(max_upload_mb: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        detail={
            "code": "file_too_large",
            "message": f"Uploaded file exceeds the {max_upload_mb} MB limit.",
        },
    )


def corrupted_image() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"code": "corrupted_image", "message": "Image is corrupted or unreadable."},
    )


def processing_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "code": "processing_error",
            "message": "Image restoration failed during processing.",
        },
    )
