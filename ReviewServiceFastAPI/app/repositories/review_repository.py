"""
Repository layer — the only place that talks to the ORM/database directly.

Mirrors db/repositories/reviews.go from the original Go service: same
method set (GetAll, GetByID, Create, Update, Delete, GetByUserId,
GetByHotelId, GetByBookingId), same soft-delete filtering
(`deleted_at IS NULL` on every read), same "UPDATE sets deleted_at" pattern
instead of a hard DELETE.
"""
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Review


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Review]:
        return (
            self.db.query(Review)
            .filter(Review.deleted_at.is_(None))
            .order_by(Review.created_at.desc())
            .all()
        )

    def get_by_id(self, review_id: int) -> Optional[Review]:
        return (
            self.db.query(Review)
            .filter(Review.id == review_id, Review.deleted_at.is_(None))
            .first()
        )

    def create(self, user_id: int, booking_id: int, hotel_id: int, comment: str, rating: int) -> Review:
        review = Review(
            user_id=user_id,
            booking_id=booking_id,
            hotel_id=hotel_id,
            comment=comment,
            rating=rating,
            is_synced=False,
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def update(self, review_id: int, comment: str, rating: int) -> Optional[Review]:
        review = self.get_by_id(review_id)
        if review is None:
            return None
        review.comment = comment
        review.rating = rating
        self.db.commit()
        self.db.refresh(review)
        return review

    def delete(self, review_id: int) -> bool:
        """Soft delete — sets deleted_at rather than removing the row, matching the Go repository."""
        review = self.get_by_id(review_id)
        if review is None:
            return False
        review.deleted_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

    def get_by_user_id(self, user_id: int) -> List[Review]:
        return (
            self.db.query(Review)
            .filter(Review.user_id == user_id, Review.deleted_at.is_(None))
            .order_by(Review.created_at.desc())
            .all()
        )

    def get_by_hotel_id(self, hotel_id: int) -> List[Review]:
        return (
            self.db.query(Review)
            .filter(Review.hotel_id == hotel_id, Review.deleted_at.is_(None))
            .order_by(Review.created_at.desc())
            .all()
        )

    def get_by_booking_id(self, booking_id: int) -> List[Review]:
        return (
            self.db.query(Review)
            .filter(Review.booking_id == booking_id, Review.deleted_at.is_(None))
            .order_by(Review.created_at.desc())
            .all()
        )
