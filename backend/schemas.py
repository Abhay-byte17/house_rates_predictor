"""
ChennaiNest Backend - Pydantic Request & Response Schemas
Provides comprehensive validation for property inputs and structured API responses.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator
import math

# Supported canonical values as defined in feature schema
SUPPORTED_LOCALITIES = [
    "Adyar",
    "Anna Nagar",
    "Chrompet",
    "KK Nagar",
    "Karapakkam",
    "T Nagar",
    "Velachery"
]

SUPPORTED_SALE_CONDS = [
    "AbNormal",
    "AdjLand",
    "Family",
    "Normal Sale",
    "Partial"
]

SUPPORTED_PARK_FACILS = ["Yes", "No"]

SUPPORTED_BUILDTYPES = ["Commercial", "House", "Others"]

SUPPORTED_UTILITIES = ["AllPub", "ELO", "NoSeWa", "NoSewr"]

SUPPORTED_STREETS = ["Gravel", "No Access", "Paved"]

SUPPORTED_MZZONES = ["A", "C", "I", "RH", "RL", "RM"]


def _find_canonical_match(val: str, allowed_list: List[str], field_name: str) -> str:
    """Matches a string case-insensitively against allowed canonical options."""
    if not isinstance(val, str) or not val.strip():
        raise ValueError(f"{field_name} must be a non-empty string.")
    
    cleaned = val.strip()
    for opt in allowed_list:
        if opt.lower() == cleaned.lower():
            return opt
            
    allowed_str = ", ".join(f"'{o}'" for o in allowed_list)
    raise ValueError(
        f"Invalid {field_name} '{val}'. Supported options are: {allowed_str}."
    )


class PropertyRequest(BaseModel):
    """
    Input schema for property valuation request.
    Validates all 12 input features strictly.
    """
    INT_SQFT: int = Field(
        ...,
        ge=500,
        le=2500,
        description="Interior square footage of the property (500 to 2500 sq.ft)",
        examples=[1200]
    )
    DIST_MAINROAD: int = Field(
        ...,
        ge=0,
        le=200,
        description="Distance from the property to the main road in meters (0 to 200 m)",
        examples=[50]
    )
    N_BEDROOM: int = Field(
        ...,
        ge=1,
        le=4,
        description="Number of bedrooms (1 to 4)",
        examples=[2]
    )
    N_BATHROOM: int = Field(
        ...,
        ge=1,
        le=2,
        description="Number of bathrooms (1 to 2)",
        examples=[2]
    )
    N_ROOM: int = Field(
        ...,
        ge=2,
        le=6,
        description="Total number of rooms (2 to 6)",
        examples=[4]
    )
    AREA: str = Field(
        ...,
        description="Locality in Chennai (must be one of 7 supported localities)",
        examples=["Adyar"]
    )
    SALE_COND: str = Field(
        ...,
        description="Transaction sale condition",
        examples=["Normal Sale"]
    )
    PARK_FACIL: str = Field(
        ...,
        description="Parking facility available ('Yes' or 'No')",
        examples=["Yes"]
    )
    BUILDTYPE: str = Field(
        ...,
        description="Building classification ('House', 'Commercial', 'Others')",
        examples=["House"]
    )
    UTILITY_AVAIL: str = Field(
        ...,
        description="Available utilities ('AllPub', 'ELO', 'NoSeWa', 'NoSewr')",
        examples=["AllPub"]
    )
    STREET: str = Field(
        ...,
        description="Street approach type ('Paved', 'Gravel', 'No Access')",
        examples=["Paved"]
    )
    MZZONE: str = Field(
        ...,
        description="Municipal Zoning code ('A', 'C', 'I', 'RH', 'RL', 'RM')",
        examples=["RL"]
    )

    @field_validator("INT_SQFT", "DIST_MAINROAD", "N_BEDROOM", "N_BATHROOM", "N_ROOM", mode="before")
    @classmethod
    def validate_finite_numeric(cls, v: Any, info) -> Any:
        if v is None:
            raise ValueError(f"{info.field_name} is required and cannot be null.")
        if isinstance(v, (float, int)):
            if math.isnan(v) or math.isinf(v):
                raise ValueError(f"{info.field_name} must be a finite real number.")
        return v

    @field_validator("AREA")
    @classmethod
    def validate_area(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_LOCALITIES, "AREA")

    @field_validator("SALE_COND")
    @classmethod
    def validate_sale_cond(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_SALE_CONDS, "SALE_COND")

    @field_validator("PARK_FACIL")
    @classmethod
    def validate_park_facil(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_PARK_FACILS, "PARK_FACIL")

    @field_validator("BUILDTYPE")
    @classmethod
    def validate_buildtype(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_BUILDTYPES, "BUILDTYPE")

    @field_validator("UTILITY_AVAIL")
    @classmethod
    def validate_utility(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_UTILITIES, "UTILITY_AVAIL")

    @field_validator("STREET")
    @classmethod
    def validate_street(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_STREETS, "STREET")

    @field_validator("MZZONE")
    @classmethod
    def validate_mzzone(cls, v: str) -> str:
        return _find_canonical_match(v, SUPPORTED_MZZONES, "MZZONE")


class PredictionResponse(BaseModel):
    """Prediction output schema."""
    success: bool = True
    predicted_price_inr: int
    formatted_price: str
    formatted_price_lakhs: str
    currency: str = "INR"
    locality: str
    disclaimer: str = "This is an estimate based on the available historical dataset."
    property_details: Dict[str, Any]


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str
    model_loaded: bool
    model_file: str
    version: str


class MetadataResponse(BaseModel):
    """Metadata response schema returning supported features and ranges."""
    service: str
    version: str
    currency: str
    supported_localities: List[str]
    required_fields: List[str]
    numeric_features: Dict[str, Any]
    categorical_features: Dict[str, Any]
    target: Dict[str, Any]
    disclaimer: str
