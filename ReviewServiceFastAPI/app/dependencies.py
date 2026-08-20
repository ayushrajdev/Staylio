"""FastAPI dependency providers — wires repository -> service per request, same layering as the Go NewReviewService/NewReviewRepository constructors."""
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.review_repository import ReviewRepository
from app.services.review_service import ReviewService


def get_review_repository(db: Session = Depends(get_db)) -> ReviewRepository:
    return ReviewRepository(db)


def get_review_service(repository: ReviewRepository = Depends(get_review_repository)) -> ReviewService:
    return ReviewService(repository)
