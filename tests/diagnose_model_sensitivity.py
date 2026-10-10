"""
ChennaiNest - Comprehensive Model & API Sensitivity Diagnostic Script
Tests sensitivity across Area, Locality, and Building Type, and compares all prediction paths.
"""

import sys
import os
import joblib
import pandas as pd
import numpy as np
import httpx

# Ensure console supports UTF-8
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.joblib")
API_URL = "http://127.0.0.1:8000/predict"

model = joblib.load(MODEL_PATH)

# Baseline reference property
BASE_PROPERTY = {
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


def run_tests():
    print("=" * 80)
    print("DIAGNOSTIC 1: TEST A — CHANGE ONLY SQUARE FOOTAGE (INT_SQFT)")
    print("Base: Adyar, 2 BHK, 2 Bath, 4 Rooms, House, Paved, RL Zone, Yes Parking")
    print("=" * 80)
    test_a_sqfts = [800, 1200, 1800, 2400]
    results_a = []
    for sqft in test_a_sqfts:
        payload = BASE_PROPERTY.copy()
        payload["INT_SQFT"] = sqft
        
        # Path 1: Direct Model
        pred_direct = model.predict(pd.DataFrame([payload]))[0]
        
        # Path 2: API
        api_res = httpx.post(API_URL, json=payload, timeout=5).json()
        pred_api = api_res["predicted_price_inr"]
        fmt_api = api_res["formatted_price"]
        
        diff = abs(int(round(pred_direct)) - pred_api)
        results_a.append({
            "INT_SQFT": sqft,
            "Direct (INR)": f"₹{pred_direct:,.2f}",
            "API (INR)": f"₹{pred_api:,}",
            "Formatted": fmt_api,
            "Delta": diff
        })
    print(pd.DataFrame(results_a).to_string(index=False))

    print("\n" + "=" * 80)
    print("DIAGNOSTIC 2: TEST B — CHANGE ONLY LOCALITY (AREA)")
    print("Base: 1200 sqft, 2 BHK, 2 Bath, 4 Rooms, House, Paved, RL Zone, Yes Parking")
    print("=" * 80)
    test_b_localities = [
        "Adyar",
        "Anna Nagar",
        "Chrompet",
        "Karapakkam",
        "T Nagar",
        "Velachery",
        "KK Nagar"
    ]
    results_b = []
    for loc in test_b_localities:
        payload = BASE_PROPERTY.copy()
        payload["AREA"] = loc
        
        pred_direct = model.predict(pd.DataFrame([payload]))[0]
        api_res = httpx.post(API_URL, json=payload, timeout=5).json()
        pred_api = api_res["predicted_price_inr"]
        fmt_api = api_res["formatted_price"]
        
        diff = abs(int(round(pred_direct)) - pred_api)
        results_b.append({
            "Locality": loc,
            "Direct (INR)": f"₹{pred_direct:,.2f}",
            "API (INR)": f"₹{pred_api:,}",
            "Formatted": fmt_api,
            "Rate/SqFt": f"₹{int(pred_api/1200):,}",
            "Delta": diff
        })
    print(pd.DataFrame(results_b).to_string(index=False))

    print("\n" + "=" * 80)
    print("DIAGNOSTIC 3: TEST C — CHANGE ONLY PROPERTY TYPE (BUILDTYPE)")
    print("Base: Adyar, 1200 sqft, 2 BHK, 2 Bath, 4 Rooms, Paved, RL Zone, Yes Parking")
    print("=" * 80)
    test_c_buildtypes = ["House", "Commercial", "Others"]
    results_c = []
    for bt in test_c_buildtypes:
        payload = BASE_PROPERTY.copy()
        payload["BUILDTYPE"] = bt
        
        pred_direct = model.predict(pd.DataFrame([payload]))[0]
        api_res = httpx.post(API_URL, json=payload, timeout=5).json()
        pred_api = api_res["predicted_price_inr"]
        fmt_api = api_res["formatted_price"]
        
        diff = abs(int(round(pred_direct)) - pred_api)
        results_c.append({
            "BUILDTYPE": bt,
            "Direct (INR)": f"₹{pred_direct:,.2f}",
            "API (INR)": f"₹{pred_api:,}",
            "Formatted": fmt_api,
            "Delta": diff
        })
    print(pd.DataFrame(results_c).to_string(index=False))

    print("\n" + "=" * 80)
    print("DIAGNOSTIC 4: INTERACTION TESTS (REALISTIC FULL CONFIGURATIONS)")
    print("=" * 80)
    realistic_profiles = [
        {
            "Label": "Budget Flat (Karapakkam, 650 sqft, 1BHK, ELO, Gravel, Zone A, No Park)",
            "props": {
                "AREA": "Karapakkam", "INT_SQFT": 650, "DIST_MAINROAD": 150,
                "N_BEDROOM": 1, "N_BATHROOM": 1, "N_ROOM": 2,
                "BUILDTYPE": "Others", "PARK_FACIL": "No", "STREET": "Gravel",
                "UTILITY_AVAIL": "ELO", "SALE_COND": "Normal Sale", "MZZONE": "A"
            }
        },
        {
            "Label": "Suburban Mid (Chrompet, 1050 sqft, 2BHK, NoSewr, Paved, Zone RH, Park)",
            "props": {
                "AREA": "Chrompet", "INT_SQFT": 1050, "DIST_MAINROAD": 60,
                "N_BEDROOM": 2, "N_BATHROOM": 1, "N_ROOM": 4,
                "BUILDTYPE": "House", "PARK_FACIL": "Yes", "STREET": "Paved",
                "UTILITY_AVAIL": "NoSewr", "SALE_COND": "Normal Sale", "MZZONE": "RH"
            }
        },
        {
            "Label": "Prime Villa (Anna Nagar, 2200 sqft, 4BHK, AllPub, Paved, Zone RM, Park)",
            "props": {
                "AREA": "Anna Nagar", "INT_SQFT": 2200, "DIST_MAINROAD": 20,
                "N_BEDROOM": 4, "N_BATHROOM": 2, "N_ROOM": 6,
                "BUILDTYPE": "House", "PARK_FACIL": "Yes", "STREET": "Paved",
                "UTILITY_AVAIL": "AllPub", "SALE_COND": "Normal Sale", "MZZONE": "RM"
            }
        },
        {
            "Label": "Commercial Hub (T Nagar, 1900 sqft, AllPub, Paved, Zone C, Park)",
            "props": {
                "AREA": "T Nagar", "INT_SQFT": 1900, "DIST_MAINROAD": 10,
                "N_BEDROOM": 3, "N_BATHROOM": 2, "N_ROOM": 5,
                "BUILDTYPE": "Commercial", "PARK_FACIL": "Yes", "STREET": "Paved",
                "UTILITY_AVAIL": "AllPub", "SALE_COND": "Normal Sale", "MZZONE": "C"
            }
        }
    ]

    for p in realistic_profiles:
        pred = int(round(model.predict(pd.DataFrame([p["props"]]))[0]))
        print(f"{p['Label']}:")
        print(f"  -> Predicted Price: ₹{pred:,} (₹{pred/1e5:.2f} Lakhs / ₹{pred/1e7:.2f} Cr)\n")


if __name__ == "__main__":
    run_tests()
