"""
ChennaiNest Backend - Configuration
Manages environment variables, CORS origins, and file paths.
"""

import os
from typing import List


class Settings:
    PROJECT_NAME: str = "ChennaiNest API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Chennai House Price Prediction REST API using FastAPI and Machine Learning"

    # Base directory of the repository
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # Canonical artifact paths
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        os.path.join(BASE_DIR, "models", "model.joblib")
    )
    SCHEMA_PATH: str = os.getenv(
        "SCHEMA_PATH",
        os.path.join(BASE_DIR, "models", "feature_schema.json")
    )
    METRICS_PATH: str = os.getenv(
        "METRICS_PATH",
        os.path.join(BASE_DIR, "models", "metrics.json")
    )

    # CORS origins (configurable via comma-separated string)
    DEFAULT_CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    )

    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", self.DEFAULT_CORS_ORIGINS)
        return [origin.strip() for origin in raw.split(",") if origin.strip()]


settings = Settings()
