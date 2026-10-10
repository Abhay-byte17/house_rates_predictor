"""
ChennaiNest Backend - Model Service
Manages loading, caching, and inference of the trained scikit-learn pipeline.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import joblib
import pandas as pd
from backend.config import settings

logger = logging.getLogger("chennainest.model_service")


class ModelService:
    def __init__(self, model_path: Optional[str] = None, schema_path: Optional[str] = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.schema_path = schema_path or settings.SCHEMA_PATH
        self.pipeline = None
        self.schema = None
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads model pipeline and feature schema from disk."""
        # 1. Load schema
        if os.path.exists(self.schema_path):
            try:
                with open(self.schema_path, "r") as f:
                    self.schema = json.load(f)
                logger.info(f"Loaded feature schema from {self.schema_path}")
            except Exception as e:
                logger.error(f"Failed to load schema from {self.schema_path}: {e}")
                self.schema = None
        else:
            logger.warning(f"Schema file not found at {self.schema_path}")

        # 2. Load model pipeline
        if os.path.exists(self.model_path):
            try:
                self.pipeline = joblib.load(self.model_path)
                logger.info(f"Loaded model pipeline from {self.model_path}")
            except Exception as e:
                logger.error(f"Failed to load model pipeline from {self.model_path}: {e}")
                self.pipeline = None
        else:
            logger.warning(f"Model file not found at {self.model_path}")

    @property
    def is_ready(self) -> bool:
        """Returns True if the pipeline is loaded and ready for predictions."""
        return self.pipeline is not None

    def get_metadata(self) -> Dict[str, Any]:
        """Returns metadata parsed directly from the feature schema."""
        if self.schema:
            numeric_features = self.schema.get("numeric_features", {})
            categorical_features = self.schema.get("categorical_features", {})
            target_info = self.schema.get("target", {})
            supported_localities = categorical_features.get("AREA", {}).get("allowed", [])
            required_fields = list(numeric_features.keys()) + list(categorical_features.keys())
        else:
            numeric_features = {}
            categorical_features = {}
            target_info = {"name": "SALES_PRICE", "unit": "INR"}
            supported_localities = []
            required_fields = []

        return {
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "currency": "INR",
            "supported_localities": supported_localities,
            "required_fields": required_fields,
            "numeric_features": numeric_features,
            "categorical_features": categorical_features,
            "target": target_info,
            "disclaimer": "This is an estimate based on the available historical dataset."
        }

    def predict(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes prediction on a single property record.
        Returns a dictionary with raw and formatted price estimates.
        """
        if not self.is_ready:
            raise RuntimeError("Model pipeline is not loaded or currently unavailable.")

        # Prepare DataFrame with expected columns
        df_input = pd.DataFrame([property_data])

        # Run pipeline inference
        raw_pred = float(self.pipeline.predict(df_input)[0])
        predicted_int = int(round(raw_pred))

        # Format display values
        price_lakhs = raw_pred / 100_000
        formatted_price_lakhs = f"₹{price_lakhs:.2f} Lakhs"

        if raw_pred >= 10_000_000:
            price_crores = raw_pred / 10_000_000
            formatted_price = f"₹{price_crores:.2f} Crores"
        else:
            formatted_price = formatted_price_lakhs

        return {
            "predicted_price_inr": predicted_int,
            "formatted_price": formatted_price,
            "formatted_price_lakhs": formatted_price_lakhs,
            "currency": "INR",
            "locality": property_data.get("AREA", ""),
            "property_details": property_data
        }


# Global singleton instance
model_service = ModelService()
