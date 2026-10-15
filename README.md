# ChennaiNest - Chennai House Price Predictor 🏠

> An end-to-end Machine Learning, FastAPI, React, and Docker solution for predicting Chennai real estate property prices.

---

## 📌 Project Overview
**ChennaiNest** (`house_rates_predictor`) is an intelligent real estate valuation engine designed to predict property sales prices in Chennai based on historical transaction data. The project provides:
- **Machine Learning Core**: Data preprocessing, feature engineering, and a Scikit-Learn `HistGradientBoostingRegressor` pipeline trained on Chennai housing data.
- **Backend API**: High-performance RESTful API built with **FastAPI** and **Uvicorn**, serving predictions directly from `models/model.joblib`.
- **Modern Frontend**: Interactive web interface built with **React** and **Vite**, featuring real-time price estimation and BHK layout suggestions.
- **Containerization**: Fully containerized environment with **Docker** and **Docker Compose**, utilizing a multi-stage Nginx reverse-proxy architecture.

---

## 📂 Project Structure
```text
chennai_house_guide/
├── backend/
│   ├── __init__.py
│   ├── config.py              # Backend configuration & environment settings
│   ├── main.py                # FastAPI entrypoint, middleware, routes
│   ├── model_service.py       # Model loading, caching & inference engine
│   ├── schemas.py             # Pydantic v2 validation models
│   ├── Dockerfile             # Python 3.11-slim FastAPI container
│   ├── requirements.txt       # Backend Python dependencies
│   └── README.md              # API documentation
├── frontend/
│   ├── public/                # Static assets, SVG icons, imagery
│   ├── src/
│   │   ├── components/        # React UI components (EstimatorForm, Navbar, etc.)
│   │   ├── services/api.js    # API client connecting to /api reverse proxy
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile             # Multi-stage build (Node 20 -> Nginx Alpine)
│   ├── nginx.conf             # Nginx reverse proxy configuration
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── models/
│   ├── feature_schema.json    # Canonical feature definitions & ranges
│   ├── metrics.json           # Model benchmarks & test evaluation metrics
│   └── model.joblib           # Trained Scikit-Learn pipeline
├── data/
│   └── chennai_house_price_prediction.csv  # Historical dataset
├── tests/
│   ├── test_api.py            # FastAPI backend endpoint tests
│   ├── test_model_inference.py # Scikit-Learn model loading & inference tests
│   └── test_bhk_layout_ux.py  # Frontend UX & layout suggestion tests
├── docker-compose.yml         # Container orchestration & networking
├── .dockerignore              # Docker build exclusions
├── requirements.txt           # Python dependency manifest
└── README.md                  # Project documentation
```

---

## 🛠️ Tech Stack
- **Machine Learning**: Python 3.11+, Scikit-Learn (`HistGradientBoostingRegressor`), Pandas, Joblib
- **Backend API**: FastAPI, Uvicorn ASGI, Pydantic v2
- **Frontend**: React 19, Vite 6, Vanilla CSS, Lucide Icons
- **Web Server / Reverse Proxy**: Nginx Alpine
- **Containerization**: Docker, Docker Compose

---

## 🐳 Docker Deployment Guide (Windows PowerShell)

Docker Desktop provides the quickest and most consistent way to run ChennaiNest. The setup uses an internal Docker bridge network where Nginx serves the React frontend and reverse-proxies all `/api/*` calls to the FastAPI backend.

### 1. Check Prerequisites
Ensure Docker Desktop is running and Docker Compose is available:
```powershell
docker --version
docker compose version
```

### 2. Validate Compose Configuration
Verify the `docker-compose.yml` syntax and environment resolution:
```powershell
docker compose config
```

### 3. Build the Containers
Build the backend (`chennainest-backend`) and frontend (`chennainest-frontend`) images:
```powershell
docker compose build
```

### 4. Start the Application
Start both containers in detached mode:
```powershell
docker compose up -d
```

### 5. Check Container Status & Logs
Verify that both containers are running and reported as `healthy`:
```powershell
docker compose ps
```

View aggregated logs or inspect a specific container:
```powershell
# View all container logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# View frontend / Nginx logs only
docker compose logs -f frontend
```

### 6. Access the Website
Open your browser to:
- **Frontend Application**: [http://localhost:3000](http://localhost:3000) (also mapped to [http://localhost:5173](http://localhost:5173))
- **Direct Backend API / Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Reverse-Proxied API Docs**: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 📡 Testing the Containerized Endpoints (PowerShell)

### Health Check
Check backend operational status and verify that the trained ML pipeline is loaded:
```powershell
# Via Reverse Proxy (Port 3000)
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get

# Direct Backend (Port 8000)
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
```
*Expected Response:*
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_file": "models/model.joblib",
  "version": "1.0.0"
}
```

### Metadata Endpoint
Inspect supported localities, feature bounds, and categorical options:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/metadata" -Method Get
```

### Price Prediction Endpoint
Submit a property valuation request through the reverse proxy:
```powershell
$body = @{
    AREA          = "Adyar"
    INT_SQFT      = 1200
    DIST_MAINROAD = 50
    N_BEDROOM     = 2
    N_BATHROOM    = 2
    N_ROOM        = 4
    SALE_COND     = "Normal Sale"
    PARK_FACIL    = "Yes"
    BUILDTYPE     = "House"
    UTILITY_AVAIL = "AllPub"
    STREET        = "Paved"
    MZZONE        = "RL"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/predict" -Method Post -Body $body -ContentType "application/json"
```
*Sample Output:*
```json
{
  "predicted_price_inr": 10615325,
  "formatted_price": "₹1.06 Crores",
  "formatted_price_lakhs": "₹106.15 Lakhs",
  "currency": "INR",
  "locality": "Adyar"
}
```

---

## 🔄 Management & Maintenance

### Rebuilding After Code Changes
When you modify frontend code, backend logic, or model artifacts, rebuild and restart the containers:
```powershell
docker compose up -d --build
```

### Stopping the Application
Stop containers and retain networks:
```powershell
docker compose stop
```

Stop and remove containers, networks, and ephemeral state:
```powershell
docker compose down
```

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Port conflict on 3000, 5173, or 8000** | Another local service (e.g. local Vite dev server, local Uvicorn, or Node process) is using the port. | Check running processes with `Get-NetTCPConnection -LocalPort 3000, 5173, 8000` and stop the conflicting process or adjust port mappings in `docker-compose.yml`. |
| **Backend reports model not found (503)** | `models/model.joblib` was not copied into the image or `MODEL_PATH` is incorrect. | Ensure `models/model.joblib` is present in the repository before building. Rebuild with `docker compose build --no-cache backend`. |
| **Browser cannot reach backend (CORS / Connection Refused)** | Direct browser connection to internal Docker DNS `http://backend:8000` is attempted instead of using reverse proxy. | Frontend uses `/api/*` which Nginx forwards to `http://backend:8000/*`. Ensure the frontend connects via `http://localhost:3000` (or `http://localhost:5173`). |
| **Frontend container marked unhealthy** | Nginx healthcheck connecting to IPv6 instead of IPv4. | Both IPv4 (`listen 80`) and IPv6 (`listen [::]:80`) are enabled in `nginx.conf`, and container healthcheck queries `http://127.0.0.1:80/`. |

---

## 🧪 Running Automated Tests

Run the full automated test suite on your local Python environment:
```powershell
python -m unittest discover -s tests
```

---

## 📄 License
This project is licensed under the MIT License.
