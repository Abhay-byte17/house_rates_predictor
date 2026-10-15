# ==============================================================================
# ChennaiNest Backend - Production Dockerfile
# Base: Python 3.11 Slim
# Server: Uvicorn ASGI + FastAPI
# ML Engine: Scikit-learn Pipeline (HistGradientBoosting)
# ==============================================================================

FROM python:3.11-slim

WORKDIR /app

# Ensure unbuffered logging and prevent byte-code caching
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    MODEL_PATH=/app/models/model.joblib \
    SCHEMA_PATH=/app/models/feature_schema.json \
    METRICS_PATH=/app/models/metrics.json

# Install curl for health checking
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies from manifest
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source code and trained model artifacts
COPY backend/ /app/backend/
COPY models/ /app/models/
COPY src/ /app/src/

# Expose FastAPI backend port
EXPOSE 8000

# Container healthcheck querying FastAPI /health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start Uvicorn bound to 0.0.0.0
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
