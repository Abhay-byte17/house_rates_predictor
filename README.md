# ChennaiNest - Chennai House Price Predictor 🏠

> An end-to-end Machine Learning, FastAPI, React, and Docker solution for predicting Chennai real estate property prices.

---

## 📌 Project Overview
**ChennaiNest** (`house_rates_predictor`) is an intelligent real estate valuation engine designed to predict property sales prices in Chennai based on historical transaction data. The project provides:
- **Machine Learning Core**: Data preprocessing, feature engineering, and regression models trained on Chennai housing dataset.
- **Backend API**: High-performance RESTful API built with **FastAPI**.
- **Modern Frontend**: Interactive web interface built with **React** and **Vite**.
- **Containerization**: Fully containerized environment with **Docker** and **Docker Compose** for seamless deployment.

---

## 📂 Project Structure
```text
chennai_house_guide/
├── data/
│   └── chennai_house_price_prediction.csv  # Chennai housing dataset (7,109 records)
├── notebooks/
│   └── chennai_house_price_prediction.ipynb # Exploratory Data Analysis & Modeling
├── .gitignore                               # Git ignore configuration
└── README.md                                # Project documentation
```

---

## 📊 Dataset Information
- **Source**: Chennai Real Estate Historical Sales Dataset (open educational/benchmark dataset).
- **Size**: ~704 KB (7,109 rows × 19 features).
- **Key Features**:
  - `AREA`: Locality (Karapakkam, Anna Nagar, Adyar, Velachery, Chrompet, T Nagar, KK Nagar).
  - `INT_SQFT`: Interior square footage.
  - `N_BEDROOM`, `N_BATHROOM`, `N_ROOM`: Room distribution.
  - `SALE_COND`: Sale condition (Normal, Abnormal, Family, Partial, AdjLand).
  - `PARK_FACIL`: Parking facility availability.
  - `BUILDTYPE`: Commercial, House, Others.
  - `UTILITY_AVAIL`: AllPub, NoSewr, NoSeWa, ELO.
  - `STREET`: Gravel, Paved, No Access.
  - `MZZONE`: Municipal Zoning (A, C, I, RH, RL, RM).
  - `QS_*`: Quality scores (Rooms, Bathroom, Bedroom, Overall).
  - `SALES_PRICE`: Target transaction price (INR).

---

## 🛠️ Tech Stack
- **Data Science & ML**: Python, Pandas, NumPy, Scikit-Learn
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Frontend**: React, Vite, Vanilla CSS
- **DevOps**: Docker, Docker Compose, Git & GitHub

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (optional, for containerized run)
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Abhay-byte17/house_rates_predictor.git
cd house_rates_predictor
```

---

## 📄 License
This project is licensed under the MIT License.
