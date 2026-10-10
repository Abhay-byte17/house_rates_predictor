"""
ChennaiNest - Chennai House Price Prediction
Preprocessing utilities, schema definitions, and pipeline builders.
"""

from typing import Dict, Any, List
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

# Canonical Allowed Values for Features
VALID_AREAS = [
    "Adyar",
    "Anna Nagar",
    "Chrompet",
    "KK Nagar",
    "Karapakkam",
    "T Nagar",
    "Velachery"
]

VALID_SALE_CONDS = [
    "AbNormal",
    "AdjLand",
    "Family",
    "Normal Sale",
    "Partial"
]

VALID_PARK_FACILS = ["Yes", "No"]

VALID_BUILDTYPES = ["Commercial", "House", "Others"]

VALID_UTILITIES = ["AllPub", "ELO", "NoSeWa", "NoSewr"]

VALID_STREETS = ["Gravel", "No Access", "Paved"]

VALID_MZZONES = ["A", "C", "I", "RH", "RL", "RM"]

# Typo and variant normalization mappings
AREA_MAPPING: Dict[str, str] = {
    "chrompt": "Chrompet",
    "chrmpet": "Chrompet",
    "chormpet": "Chrompet",
    "chrompet": "Chrompet",
    "tnagar": "T Nagar",
    "t nagar": "T Nagar",
    "karapakam": "Karapakkam",
    "karapakkam": "Karapakkam",
    "ana nagar": "Anna Nagar",
    "ann nagar": "Anna Nagar",
    "anna nagar": "Anna Nagar",
    "velchery": "Velachery",
    "velachery": "Velachery",
    "adyr": "Adyar",
    "adyar": "Adyar",
    "kknagar": "KK Nagar",
    "kk nagar": "KK Nagar"
}

SALE_COND_MAPPING: Dict[str, str] = {
    "adj land": "AdjLand",
    "adjland": "AdjLand",
    "partiall": "Partial",
    "partial": "Partial",
    "partiall": "Partial",
    "ab normal": "AbNormal",
    "abnormal": "AbNormal",
    "normal sale": "Normal Sale",
    "family": "Family"
}

PARK_MAPPING: Dict[str, str] = {
    "yes": "Yes",
    "no": "No",
    "noo": "No"
}

BUILDTYPE_MAPPING: Dict[str, str] = {
    "commercial": "Commercial",
    "comercial": "Commercial",
    "house": "House",
    "others": "Others",
    "other": "Others"
}

UTILITY_MAPPING: Dict[str, str] = {
    "allpub": "AllPub",
    "all pub": "AllPub",
    "nosewa": "NoSeWa",
    "nosewr": "NoSewr",
    "elo": "ELO"
}

STREET_MAPPING: Dict[str, str] = {
    "paved": "Paved",
    "pavd": "Paved",
    "gravel": "Gravel",
    "no access": "No Access",
    "noaccess": "No Access"
}

NUMERIC_FEATURES: List[str] = [
    "INT_SQFT",
    "DIST_MAINROAD",
    "N_BEDROOM",
    "N_BATHROOM",
    "N_ROOM"
]

CATEGORICAL_FEATURES: List[str] = [
    "AREA",
    "SALE_COND",
    "PARK_FACIL",
    "BUILDTYPE",
    "UTILITY_AVAIL",
    "STREET",
    "MZZONE"
]

FEATURE_COLUMNS: List[str] = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def normalize_value(val: Any, mapping: Dict[str, str], default_valid: List[str]) -> str:
    """Normalize string using case-insensitive mapping or return canonical value."""
    if pd.isna(val):
        return default_valid[0]
    s = str(val).strip().lower()
    if s in mapping:
        return mapping[s]
    # Check direct case-insensitive match against allowed list
    for valid in default_valid:
        if valid.lower() == s:
            return valid
    return str(val).strip()


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean raw input dataset:
    - Normalizes typos and whitespace in categorical columns
    - Casts numeric features to proper types
    """
    df_clean = df.copy()

    if "AREA" in df_clean.columns:
        df_clean["AREA"] = df_clean["AREA"].apply(
            lambda v: normalize_value(v, AREA_MAPPING, VALID_AREAS)
        )
    if "SALE_COND" in df_clean.columns:
        df_clean["SALE_COND"] = df_clean["SALE_COND"].apply(
            lambda v: normalize_value(v, SALE_COND_MAPPING, VALID_SALE_CONDS)
        )
    if "PARK_FACIL" in df_clean.columns:
        df_clean["PARK_FACIL"] = df_clean["PARK_FACIL"].apply(
            lambda v: normalize_value(v, PARK_MAPPING, VALID_PARK_FACILS)
        )
    if "BUILDTYPE" in df_clean.columns:
        df_clean["BUILDTYPE"] = df_clean["BUILDTYPE"].apply(
            lambda v: normalize_value(v, BUILDTYPE_MAPPING, VALID_BUILDTYPES)
        )
    if "UTILITY_AVAIL" in df_clean.columns:
        df_clean["UTILITY_AVAIL"] = df_clean["UTILITY_AVAIL"].apply(
            lambda v: normalize_value(v, UTILITY_MAPPING, VALID_UTILITIES)
        )
    if "STREET" in df_clean.columns:
        df_clean["STREET"] = df_clean["STREET"].apply(
            lambda v: normalize_value(v, STREET_MAPPING, VALID_STREETS)
        )
    if "MZZONE" in df_clean.columns:
        df_clean["MZZONE"] = df_clean["MZZONE"].astype(str).str.strip().str.upper()

    return df_clean


def build_preprocessor() -> ColumnTransformer:
    """
    Builds the ColumnTransformer for the production pipeline.
    Numeric: Median Imputation + StandardScaler
    Categorical: Most Frequent Imputation + OneHotEncoder (handle_unknown='ignore')
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("ohe", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERIC_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder="drop"
    )

    return preprocessor
