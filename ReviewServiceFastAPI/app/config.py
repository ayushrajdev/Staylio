"""
Environment configuration.

Mirrors config/env/env.go from the original Go ReviewService: reads from a
.env file with sensible fallbacks, matching the same variable names and
defaults used there (DB_USER, DB_PASSWORD, DB_ADDR, DBName, PORT).
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # --- Database (same variable names + defaults as the Go service) ---
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "Maclocal12345")
    DB_ADDR: str = os.getenv("DB_ADDR", "127.0.0.1:3306")
    DB_NAME: str = os.getenv("DBName", "airbnb_reviews")

    # --- Server ---
    PORT: int = int(os.getenv("PORT", "8000"))
    ENV: str = os.getenv("ENV", "development")


settings = Settings()
