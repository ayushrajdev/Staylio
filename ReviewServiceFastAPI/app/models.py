"""
ORM model for the `reviews` table.

Mirrors models/review.go and the goose migration
(db/migrations/20250101000000_create_reviews_table.sql) from the original
Go service field-for-field, including the soft-delete column and the
is_synced flag (kept from the original — likely used for syncing reviews
to a search index or analytics store; not otherwise implemented there
either, so it's carried over as-is rather than invented).
"""
from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, DateTime, Integer, String, Text, Index
from sqlalchemy.sql import func

from app.db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    booking_id = Column(BigInteger, nullable=False, index=True)
    hotel_id = Column(BigInteger, nullable=False, index=True)
    comment = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime, nullable=True, index=True)
    is_synced = Column(Boolean, nullable=False, default=False)

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_reviews_rating_range"),
        Index("idx_user_id", "user_id"),
        Index("idx_booking_id", "booking_id"),
        Index("idx_hotel_id", "hotel_id"),
        Index("idx_created_at", "created_at"),
        Index("idx_deleted_at", "deleted_at"),
    )
