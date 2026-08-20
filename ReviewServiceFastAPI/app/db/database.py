"""
Database engine and session management.

Mirrors config/db/db.go from the original Go ReviewService — same MySQL
connection approach, same env-driven configuration, same defaults.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Same MySQL connection convention as the Go service (DB_USER, DB_PASSWORD,
# DB_ADDR, DBName) — see config/env/env.go in the original.
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_ADDR}/{settings.DB_NAME}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session per-request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
