"""
ChennaiNest Backend - Main FastAPI Application
Defines REST API routes, CORS middleware, validation handlers, and lifecycle.
"""

import logging
from typing import Dict, Any
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from backend.config import settings
from backend.schemas import (
    PropertyRequest,
    PredictionResponse,
    HealthResponse,
    MetadataResponse
)
from backend.model_service import model_service

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("chennainest.api")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development and container deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats validation errors into clean, readable JSON for clients."""
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append({"field": loc, "message": msg})
    
    logger.warning(f"Validation failed on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "details": errors
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Prevents stack traces and internal leakage on unexpected failures."""
    logger.error(f"Internal error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request. Please try again later."
        }
    )


@app.get("/", tags=["General"])
async def root() -> Dict[str, Any]:
    """Root endpoint welcoming users and providing service status."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "message": "Welcome to ChennaiNest — Chennai House Price Prediction API. Visit /docs for the interactive OpenAPI documentation."
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """Confirms service is running and ML model pipeline is loaded."""
    if not model_service.is_ready:
        logger.error("Health check failed: ML model pipeline is not ready.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model pipeline is currently unavailable."
        )

    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_file="models/model.joblib",
        version=settings.VERSION
    )


@app.get("/metadata", response_model=MetadataResponse, tags=["Metadata"])
async def get_metadata() -> MetadataResponse:
    """Returns valid features, localities, ranges, and target metadata dynamically from feature schema."""
    metadata = model_service.get_metadata()
    return MetadataResponse(**metadata)


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_property_price(property_input: PropertyRequest) -> PredictionResponse:
    """
    Predict property price in Indian Rupees (INR) based on validated property features.
    Features are passed directly to the pre-trained HistGradientBoosting pipeline.
    """
    if not model_service.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction engine is unavailable. Please check server health."
        )

    try:
        data_dict = property_input.model_dump()
        result = model_service.predict(data_dict)
        return PredictionResponse(**result)
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating price prediction."
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
