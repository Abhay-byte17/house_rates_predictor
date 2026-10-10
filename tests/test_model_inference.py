"""
ChennaiNest - Unit & Inference Test for Model Pipeline
Verifies pipeline deserialization, schema compliance, and realistic predictions.
"""

import os
import joblib
import pandas as pd
import numpy as np


def test_pipeline_loading_and_inference():
    # 1. Verify file existence
    model_path = "models/model.joblib"
    assert os.path.exists(model_path), f"Model file not found at {model_path}"

    # 2. Load model in fresh process
    pipeline = joblib.load("models/model.joblib")
    assert pipeline is not None, "Failed to deserialize pipeline"

    # 3. Test realistic Chennai properties
    test_cases = pd.DataFrame([
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
        },
        {
            "AREA": "Anna Nagar",
            "INT_SQFT": 1850,
            "DIST_MAINROAD": 25,
            "N_BEDROOM": 3,
            "N_BATHROOM": 2,
            "N_ROOM": 5,
            "SALE_COND": "Normal Sale",
            "PARK_FACIL": "Yes",
            "BUILDTYPE": "House",
            "UTILITY_AVAIL": "AllPub",
            "STREET": "Paved",
            "MZZONE": "RM"
        },
        {
            "AREA": "Karapakkam",
            "INT_SQFT": 800,
            "DIST_MAINROAD": 120,
            "N_BEDROOM": 1,
            "N_BATHROOM": 1,
            "N_ROOM": 2,
            "SALE_COND": "Normal Sale",
            "PARK_FACIL": "No",
            "BUILDTYPE": "House",
            "UTILITY_AVAIL": "ELO",
            "STREET": "Gravel",
            "MZZONE": "I"
        },
        {
            "AREA": "T Nagar",
            "INT_SQFT": 1900,
            "DIST_MAINROAD": 10,
            "N_BEDROOM": 3,
            "N_BATHROOM": 2,
            "N_ROOM": 5,
            "SALE_COND": "Normal Sale",
            "PARK_FACIL": "Yes",
            "BUILDTYPE": "Commercial",
            "UTILITY_AVAIL": "AllPub",
            "STREET": "Paved",
            "MZZONE": "RH"
        }
    ])

    predictions = pipeline.predict(test_cases)
    assert len(predictions) == len(test_cases), "Prediction count mismatch"

    for idx, (price, row) in enumerate(zip(predictions, test_cases.to_dict(orient="records"))):
        assert price > 0, f"Negative price predicted: {price}"
        # Price should be within reasonable Chennai range (between 20 Lakhs and 3 Crores)
        assert 2_000_000 <= price <= 30_000_000, f"Unrealistic price predicted: {price}"
        print(f"Test Case {idx+1}: {row['AREA']} | {row['INT_SQFT']} sqft | {row['BUILDTYPE']} -> INR {price:,.2f} (INR {price/1e5:.2f} Lakhs)")

    # 4. Check sensitivity: Bigger house in same locality must cost more than smaller house
    bigger_house = test_cases.iloc[[0]].copy()
    bigger_house["INT_SQFT"] = 2200
    bigger_house["N_ROOM"] = 5
    bigger_house["N_BEDROOM"] = 3
    pred_base = predictions[0]
    pred_bigger = pipeline.predict(bigger_house)[0]
    assert pred_bigger > pred_base, f"Bigger house ({pred_bigger}) did not cost more than base ({pred_base})"
    print(f"Sensitivity Check Passed: 1200 sqft (INR {pred_base:,.0f}) < 2200 sqft (INR {pred_bigger:,.0f})")

    # 5. Check building type sensitivity: Commercial property costs more than House in same locality
    commercial_house = test_cases.iloc[[0]].copy()
    commercial_house["BUILDTYPE"] = "Commercial"
    pred_comm = pipeline.predict(commercial_house)[0]
    assert pred_comm > pred_base, f"Commercial ({pred_comm}) did not cost more than House ({pred_base})"
    print(f"BuildType Check Passed: House (INR {pred_base:,.0f}) < Commercial (INR {pred_comm:,.0f})")

    print("\nALL INFERENCE AND SANITY TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    test_pipeline_loading_and_inference()
