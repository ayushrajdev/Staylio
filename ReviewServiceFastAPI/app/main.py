"""
Application entrypoint.

Mirrors app/application.go + main.go + router/router.go from the original
Go service: sets up the app, registers a /ping health check (matching
controllers/ping.go), registers the review routes, and creates DB tables
on startup (the Python equivalent of running the goose migration, for
local/dev convenience — see migrations/001_create_reviews_table.sql for
the raw-SQL version if you're managing schema separately).
"""
import logging

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.db.database import Base, engine
from app.exceptions import InvalidRatingError, ReviewNotFoundError
from app.routers.review_router import router as review_router
from app.schemas import ApiResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("review_service")

app = FastAPI(
    title="ReviewService",
    description="Hotel/stay review management service (FastAPI port of the original Go ReviewService).",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup():
    # Creates the reviews table if it doesn't exist yet — convenient for
    # local development. In a production setup you'd likely run
    # migrations/001_create_reviews_table.sql via a migration tool instead
    # (Alembic, or the same goose tool the Go service already uses).
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created.")


# --- Global exception handlers, matching utils.WriteJsonErrorResponse's envelope ---

@app.exception_handler(ReviewNotFoundError)
async def review_not_found_handler(request: Request, exc: ReviewNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ApiResponse(success=False, message="Review not found", data=None).model_dump(),
    )


@app.exception_handler(InvalidRatingError)
async def invalid_rating_handler(request: Request, exc: InvalidRatingError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ApiResponse(success=False, message=str(exc), data=None).model_dump(),
    )


@app.get("/ping")
def ping():
    """Health check — matches controllers/ping.go in the original."""
    return {"message": "pong"}


app.include_router(review_router)
