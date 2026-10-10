"""
ChennaiNest - Comprehensive Backend API Test Suite
Tests all 10 criteria specified in Phase 3 requirements using FastAPI TestClient.
"""

import sys
import os
import unittest
import joblib

# Ensure repository root is in python path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas import SUPPORTED_LOCALITIES


class TestChennaiNestAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.valid_payload = {
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

    # 1. Root Endpoint Test
    def test_01_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["service"], "ChennaiNest API")
        self.assertEqual(data["status"], "online")
        self.assertIn("welcome", data["message"].lower())

    # 2. Health Endpoint Test
    def test_02_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["model_loaded"])
        self.assertEqual(data["model_file"], "models/model.joblib")

    # 3. Metadata Endpoint Test
    def test_03_metadata_endpoint(self):
        response = self.client.get("/metadata")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["currency"], "INR")
        self.assertEqual(len(data["supported_localities"]), 7)
        for loc in SUPPORTED_LOCALITIES:
            self.assertIn(loc, data["supported_localities"])
        self.assertEqual(len(data["required_fields"]), 12)
        self.assertIn("INT_SQFT", data["numeric_features"])
        self.assertIn("AREA", data["categorical_features"])

    # 4. Valid Prediction Request Test
    def test_04_valid_prediction_request(self):
        response = self.client.post("/predict", json=self.valid_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIsInstance(data["predicted_price_inr"], int)
        self.assertGreater(data["predicted_price_inr"], 2_000_000)
        self.assertLess(data["predicted_price_inr"], 30_000_000)
        self.assertEqual(data["currency"], "INR")
        self.assertEqual(data["locality"], "Adyar")
        self.assertIn("estimate", data["disclaimer"].lower())
        self.assertIn("₹", data["formatted_price"])

    # 5. Unsupported Locality Test
    def test_05_unsupported_locality(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload["AREA"] = "Tambaram"  # Not in the 7 supported localities
        response = self.client.post("/predict", json=invalid_payload)
        self.assertEqual(response.status_code, 422)
        data = response.json()
        self.assertFalse(data["success"])
        err_msg = str(data["details"])
        self.assertIn("AREA", err_msg)
        self.assertIn("Supported options", err_msg)

    # 6. Missing Fields Test
    def test_06_missing_fields(self):
        incomplete_payload = self.valid_payload.copy()
        del incomplete_payload["INT_SQFT"]
        response = self.client.post("/predict", json=incomplete_payload)
        self.assertEqual(response.status_code, 422)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertTrue(any("INT_SQFT" in str(d["field"]) for d in data["details"]))

    # 7. Invalid Numeric Values & Out-of-Range Inputs
    def test_07_invalid_numeric_values(self):
        # 7a. Below min square footage (INT_SQFT = 300 < 500)
        low_sqft = self.valid_payload.copy()
        low_sqft["INT_SQFT"] = 300
        res = self.client.post("/predict", json=low_sqft)
        self.assertEqual(res.status_code, 422)

        # 7b. Above max square footage (INT_SQFT = 3500 > 2500)
        high_sqft = self.valid_payload.copy()
        high_sqft["INT_SQFT"] = 3500
        res = self.client.post("/predict", json=high_sqft)
        self.assertEqual(res.status_code, 422)

        # 7c. Negative distance to main road
        neg_dist = self.valid_payload.copy()
        neg_dist["DIST_MAINROAD"] = -10
        res = self.client.post("/predict", json=neg_dist)
        self.assertEqual(res.status_code, 422)

        # 7d. Out of range bedrooms
        high_bed = self.valid_payload.copy()
        high_bed["N_BEDROOM"] = 8
        res = self.client.post("/predict", json=high_bed)
        self.assertEqual(res.status_code, 422)

    # 8. Invalid Categorical Values
    def test_08_invalid_categorical_values(self):
        # 8a. Invalid building type
        inv_build = self.valid_payload.copy()
        inv_build["BUILDTYPE"] = "Skyscraper"
        res = self.client.post("/predict", json=inv_build)
        self.assertEqual(res.status_code, 422)
        self.assertIn("BUILDTYPE", str(res.json()))

        # 8b. Invalid parking
        inv_park = self.valid_payload.copy()
        inv_park["PARK_FACIL"] = "Maybe"
        res = self.client.post("/predict", json=inv_park)
        self.assertEqual(res.status_code, 422)

        # 8c. Invalid street
        inv_street = self.valid_payload.copy()
        inv_street["STREET"] = "Highway"
        res = self.client.post("/predict", json=inv_street)
        self.assertEqual(res.status_code, 422)

    # 9. Model Loading & Inference in Fresh Process
    def test_09_fresh_process_model_loading(self):
        model_path = os.path.join(BASE_DIR, "models", "model.joblib")
        self.assertTrue(os.path.exists(model_path))
        loaded_model = joblib.load(model_path)
        self.assertIsNotNone(loaded_model)
        # Verify predict works directly on pipeline
        import pandas as pd
        df = pd.DataFrame([self.valid_payload])
        prediction = loaded_model.predict(df)
        self.assertEqual(len(prediction), 1)
        self.assertGreater(prediction[0], 0)

    # 10. Correct Response Structure & INR Units
    def test_10_response_structure_and_inr_units(self):
        # Test property over 1 Crore
        big_property = self.valid_payload.copy()
        big_property["AREA"] = "Anna Nagar"
        big_property["INT_SQFT"] = 1900
        big_property["N_BEDROOM"] = 3
        big_property["N_ROOM"] = 5

        res = self.client.post("/predict", json=big_property)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Check required JSON keys
        required_keys = {
            "success",
            "predicted_price_inr",
            "formatted_price",
            "formatted_price_lakhs",
            "currency",
            "locality",
            "disclaimer",
            "property_details"
        }
        self.assertTrue(required_keys.issubset(set(data.keys())))
        self.assertEqual(data["currency"], "INR")
        self.assertEqual(data["locality"], "Anna Nagar")
        self.assertIn("Crores", data["formatted_price"])
        self.assertIn("Lakhs", data["formatted_price_lakhs"])


if __name__ == "__main__":
    unittest.main()
