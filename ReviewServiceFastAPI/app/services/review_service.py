"""
Service layer — business logic, kept free of ORM/query concerns.

Mirrors services/review_service.go from the original Go service: same
method set and same rating-range guard (defense in depth alongside the
Pydantic validation already applied at the request-schema level).
"""
from typing import List

from app.exceptions import InvalidRatingError, ReviewNotFoundError
from app.models import Review
from app.repositories.review_repository import ReviewRepository
from app.schemas import ReviewCreateRequest, ReviewUpdateRequest


class ReviewService:
    def __init__(self, repository: ReviewRepository):
        self.repository = repository

    def get_review_by_id(self, review_id: int) -> Review:
        review = self.repository.get_by_id(review_id)
        if review is None:
            raise ReviewNotFoundError(review_id)
        return review

    def create_review(self, payload: ReviewCreateRequest) -> Review:
        if not (1 <= payload.rating <= 5):
            raise InvalidRatingError(payload.rating)
        return self.repository.create(
            user_id=payload.user_id,
            booking_id=payload.booking_id,
            hotel_id=payload.hotel_id,
            comment=payload.comment,
            rating=payload.rating,
        )

    def update_review(self, review_id: int, payload: ReviewUpdateRequest) -> Review:
        if not (1 <= payload.rating <= 5):
            raise InvalidRatingError(payload.rating)
        review = self.repository.update(review_id, payload.comment, payload.rating)
        if review is None:
            raise ReviewNotFoundError(review_id)
        return review

    def delete_review(self, review_id: int) -> None:
        deleted = self.repository.delete(review_id)
        if not deleted:
            raise ReviewNotFoundError(review_id)

    def get_all_reviews(self) -> List[Review]:
        return self.repository.get_all()

    def get_reviews_by_user_id(self, user_id: int) -> List[Review]:
        return self.repository.get_by_user_id(user_id)

    def get_reviews_by_hotel_id(self, hotel_id: int) -> List[Review]:
        return self.repository.get_by_hotel_id(hotel_id)

    def get_reviews_by_booking_id(self, booking_id: int) -> List[Review]:
        return self.repository.get_by_booking_id(booking_id)
