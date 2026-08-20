"""Response envelope helper — mirrors utils/json.go's WriteJsonSuccessResponse from the Go service ({success, message, data})."""
from typing import Optional, TypeVar

from app.schemas import ApiResponse

T = TypeVar("T")


def success_response(message: str, data: Optional[T] = None) -> ApiResponse:
    return ApiResponse(success=True, message=message, data=data)
