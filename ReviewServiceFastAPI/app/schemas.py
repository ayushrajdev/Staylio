"""
Pydantic request/response schemas.

Mirrors dto/review.go from the original Go service:
  - CreateReviewRequestDTO -> ReviewCreateRequest
  - UpdateReviewRequestDTO -> ReviewUpdateRequest
  - ReviewResponseDTO      -> ReviewResponse
Same field names, same validation rules (rating 1-5, comment 1-1000 chars,
all identifiers required on create).
"""
from datetime import datetime
from typing import Optional, Generic, TypeVar

from pydantic import BaseModel, Field, ConfigDict

T = TypeVar("T")


class ReviewCreateRequest(BaseModel):
    user_id: int = Field(..., gt=0, description="ID of the user writing the review")
    booking_id: int = Field(..., gt=0, description="ID of the booking being reviewed")
    hotel_id: int = Field(..., gt=0, description="ID of the hotel being reviewed")
    comment: str = Field(..., min_length=1, max_length=1000)
    rating: int = Field(..., ge=1, le=5)


class ReviewUpdateRequest(BaseModel):
    comment: str = Field(..., min_length=1, max_length=1000)
    rating: int = Field(..., ge=1, le=5)


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    booking_id: int
    hotel_id: int
    comment: str
    rating: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    is_synced: bool


class ApiResponse(BaseModel, Generic[T]):
    """
    Generic envelope matching utils.WriteJsonSuccessResponse /
    WriteJsonErrorResponse from the original Go service:
    { "success": bool, "message": str, "data": ... }
    """
    success: bool
    message: str
    data: Optional[T] = None
