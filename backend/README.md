# ChennaiNest — Backend API Documentation 🏢

RESTful API backend for **ChennaiNest** (`house_rates_predictor`), serving house price predictions for Chennai real estate based on our trained machine learning model pipeline.

---

## 🛠️ Architecture & Technologies

- **Framework**: FastAPI (v0.141+)
- **Server**: Uvicorn ASGI
- **Data Validation**: Pydantic v2
- **Model Engine**: Scikit-Learn `HistGradientBoostingRegressor` Pipeline (`models/model.joblib`)
- **Testing**: FastAPI TestClient / Unittest

---

## 🚀 Running the API Locally

### 1. Requirements & Dependencies
Ensure Python 3.10+ is installed:
```bash
pip install fastapi uvicorn pydantic pandas scikit-learn joblib httpx
```

### 2. Start the Server
Run the Uvicorn development server from the repository root:
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Once running, the interactive OpenAPI documentation is available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📡 API Endpoints

### 1. `GET /`
Returns API welcome message and operational status.
- **Response**:
```json
{
  "service": "ChennaiNest API",
  "version": "1.0.0",
  "status": "online",
  "message": "Welcome to ChennaiNest — Chennai House Price Prediction API. Visit /docs for the interactive OpenAPI documentation."
}
```

---

### 2. `GET /health`
Verifies server health and confirms the ML model artifact is loaded in memory.
- **Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_file": "models/model.joblib",
  "version": "1.0.0"
}
```
- **Error Response (503 Service Unavailable)**: Returned if `models/model.joblib` cannot be loaded.

---

### 3. `GET /metadata`
Returns supported localities, valid categorical options, numeric input ranges, and currency information populated dynamically from `models/feature_schema.json`.
- **Response**:
```json
{
  "service": "ChennaiNest API",
  "version": "1.0.0",
  "currency": "INR",
  "supported_localities": [
    "Adyar",
    "Anna Nagar",
    "Chrompet",
    "KK Nagar",
    "Karapakkam",
    "T Nagar",
    "Velachery"
  ],
  "required_fields": [
    "INT_SQFT",
    "DIST_MAINROAD",
    "N_BEDROOM",
    "N_BATHROOM",
    "N_ROOM",
    "AREA",
    "SALE_COND",
    "PARK_FACIL",
    "BUILDTYPE",
    "UTILITY_AVAIL",
    "STREET",
    "MZZONE"
  ],
  "numeric_features": {
    "INT_SQFT": { "type": "int", "min": 500, "max": 2500, "description": "Interior square footage" },
    "DIST_MAINROAD": { "type": "int", "min": 0, "max": 200, "description": "Distance to main road (meters)" },
    "N_BEDROOM": { "type": "int", "min": 1, "max": 4, "description": "Number of bedrooms" },
    "N_BATHROOM": { "type": "int", "min": 1, "max": 2, "description": "Number of bathrooms" },
    "N_ROOM": { "type": "int", "min": 2, "max": 6, "description": "Total rooms" }
  },
  "categorical_features": {
    "AREA": { "type": "category", "allowed": ["Adyar", "Anna Nagar", "Chrompet", "KK Nagar", "Karapakkam", "T Nagar", "Velachery"] },
    "SALE_COND": { "type": "category", "allowed": ["AbNormal", "AdjLand", "Family", "Normal Sale", "Partial"] },
    "PARK_FACIL": { "type": "category", "allowed": ["Yes", "No"] },
    "BUILDTYPE": { "type": "category", "allowed": ["Commercial", "House", "Others"] },
    "UTILITY_AVAIL": { "type": "category", "allowed": ["AllPub", "ELO", "NoSeWa", "NoSewr"] },
    "STREET": { "type": "category", "allowed": ["Gravel", "No Access", "Paved"] },
    "MZZONE": { "type": "category", "allowed": ["A", "C", "I", "RH", "RL", "RM"] }
  },
  "target": {
    "name": "SALES_PRICE",
    "unit": "INR",
    "min_dataset": 2156875.0,
    "max_dataset": 23667340.0,
    "median_dataset": 10335050.0
  },
  "disclaimer": "This is an estimate based on the available historical dataset."
}
```

---

### 4. `POST /predict`
Predicts property price in Indian Rupees (INR) using the pre-trained ML pipeline.

- **Request Body Example**:
```json
{
  "AREA": "Adyar",
  "INT_SQFT": 1200,
  "DIST_MAINROAD": 50,
  "N_BEDROOM": 2,
  "N_BATHROOM": 2,
  "N_ROOM": 4,
  "SALE_COND": "Normal Sale",
  "PARK_FACIL": "Yes",
  "BUILDTYPE": "House",
  "UTILITY_AVAIL": "AllPub",
  "STREET": "Paved",
  "MZZONE": "RL"
}
```

- **Successful Response (200 OK)**:
```json
{
  "success": true,
  "predicted_price_inr": 10615325,
  "formatted_price": "₹1.06 Crores",
  "formatted_price_lakhs": "₹106.15 Lakhs",
  "currency": "INR",
  "locality": "Adyar",
  "disclaimer": "This is an estimate based on the available historical dataset.",
  "property_details": {
    "AREA": "Adyar",
    "INT_SQFT": 1200,
    "DIST_MAINROAD": 50,
    "N_BEDROOM": 2,
    "N_BATHROOM": 2,
    "N_ROOM": 4,
    "SALE_COND": "Normal Sale",
    "PARK_FACIL": "Yes",
    "BUILDTYPE": "House",
    "UTILITY_AVAIL": "AllPub",
    "STREET": "Paved",
    "MZZONE": "RL"
  }
}
```

- **Validation Error Response (422 Unprocessable Content)**:
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "body -> AREA",
      "message": "Value error, Invalid AREA 'Tambaram'. Supported options are: 'Adyar', 'Anna Nagar', 'Chrompet', 'KK Nagar', 'Karapakkam', 'T Nagar', 'Velachery'."
    }
  ]
}
```

---

## 🧪 Automated Testing

Execute the automated test suite from the repository root:
```bash
python -m unittest tests/test_api.py
```

The test suite validates:
1. `GET /` root welcome endpoint
2. `GET /health` service and model availability
3. `GET /metadata` schema verification
4. Valid prediction response and data structure
5. Strict rejection of unsupported localities
6. Missing required field handling
7. Numeric out-of-range rejection (e.g. sqft < 500 or > 2500)
8. Invalid categorical option rejection
9. Fresh process pipeline loading and inference
10. Consistent INR currency output and Lakhs/Crores display formatting

---

## ⚠️ Known Limitations & Model Scope

1. **Locality Scope**: The model is strictly trained on **7 central/south Chennai localities**: `Adyar`, `Anna Nagar`, `Chrompet`, `KK Nagar`, `Karapakkam`, `T Nagar`, and `Velachery`. Unrepresented regions (e.g., OMR, Porur, Tambaram) are rejected at the API level.
2. **Historical Pricing Baseline**: Predictions represent transaction valuations from the benchmark dataset (spanning ₹21.5L to ₹2.37Cr). Current live 2026 inflation or luxury micro-pockets may trade higher than the historical baseline.
3. **No Target Leakage**: `COMMIS` (agent commission) is completely excluded from inference, ensuring realistic pre-transaction valuations.
