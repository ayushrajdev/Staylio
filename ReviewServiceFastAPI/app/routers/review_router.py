"""
Review routes.

Mirrors controllers/review.go + router/review_router.go from the original
Go service. Every route, path, and behavior below maps 1:1 to its Go
counterpart:

    POST   /reviews             -> CreateReview
    GET    /reviews             -> GetAllReviews
    GET    /reviews/{id}        -> GetReviewById
    PUT    /reviews/{id}        -> UpdateReview
    DELETE /reviews/{id}        -> DeleteReview
    GET    /reviews/user        -> GetReviewsByUserId   (?user_id=)
    GET    /reviews/hotel       -> GetReviewsByHotelId  (?hotel_id=)
    GET    /reviews/booking     -> GetReviewsByBookingId(?booking_id=)

Note: FastAPI's path-matching means a literal path like /reviews/user
would collide with /reviews/{id} if declared after it, so the filter
routes are declared before the {id} routes here — same effective
behavior as the Go service (which uses go-chi and doesn't have this
ordering issue), just adapted to how FastAPI/Starlette resolves routes.
"""
from typing import List

from fastapi import APIRouter, Depends, Query, status

from app.dependencies import get_review_service
from app.schemas import ApiResponse, ReviewCreateRequest, ReviewResponse, ReviewUpdateRequest
from app.services.review_service import ReviewService
from app.utils.responses import success_response

# Exceptions (ReviewNotFoundError, InvalidRatingError) are intentionally NOT
# caught here. They propagate up to the global exception handlers registered
# in main.py, which format them into the same {success, message, data}
# error envelope that utils.WriteJsonErrorResponse produces in the Go
# service — keeping routes symmetric with the Go controller, which also
# just returns whatever error the service layer raised.

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ApiResponse[ReviewResponse], status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreateRequest, service: ReviewService = Depends(get_review_service)):
    review = service.create_review(payload)
    return success_response("Review created successfully", ReviewResponse.model_validate(review))


@router.get("", response_model=ApiResponse[List[ReviewResponse]])
def get_all_reviews(service: ReviewService = Depends(get_review_service)):
    reviews = service.get_all_reviews()
    return success_response(
        "Reviews fetched successfully",
        [ReviewResponse.model_validate(r) for r in reviews],
    )


@router.get("/user", response_model=ApiResponse[List[ReviewResponse]])
def get_reviews_by_user_id(
    user_id: int = Query(..., description="User ID to filter reviews by"),
    service: ReviewService = Depends(get_review_service),
):
    reviews = service.get_reviews_by_user_id(user_id)
    return success_response(
        "Reviews fetched successfully",
        [ReviewResponse.model_validate(r) for r in reviews],
    )


@router.get("/hotel", response_model=ApiResponse[List[ReviewResponse]])
def get_reviews_by_hotel_id(
    hotel_id: int = Query(..., description="Hotel ID to filter reviews by"),
    service: ReviewService = Depends(get_review_service),
):
    reviews = service.get_reviews_by_hotel_id(hotel_id)
    return success_response(
        "Reviews fetched successfully",
        [ReviewResponse.model_validate(r) for r in reviews],
    )


@router.get("/booking", response_model=ApiResponse[List[ReviewResponse]])
def get_reviews_by_booking_id(
    booking_id: int = Query(..., description="Booking ID to filter reviews by"),
    service: ReviewService = Depends(get_review_service),
):
    reviews = service.get_reviews_by_booking_id(booking_id)
    return success_response(
        "Reviews fetched successfully",
        [ReviewResponse.model_validate(r) for r in reviews],
    )


@router.get("/{review_id}", response_model=ApiResponse[ReviewResponse])
def get_review_by_id(review_id: int, service: ReviewService = Depends(get_review_service)):
    review = service.get_review_by_id(review_id)
    return success_response("Review fetched successfully", ReviewResponse.model_validate(review))


@router.put("/{review_id}", response_model=ApiResponse[ReviewResponse])
def update_review(
    review_id: int,
    payload: ReviewUpdateRequest,
    service: ReviewService = Depends(get_review_service),
):
    review = service.update_review(review_id, payload)
    return success_response("Review updated successfully", ReviewResponse.model_validate(review))


@router.delete("/{review_id}", response_model=ApiResponse[None])
def delete_review(review_id: int, service: ReviewService = Depends(get_review_service)):
    service.delete_review(review_id)
    return success_response("Review deleted successfully", None)
