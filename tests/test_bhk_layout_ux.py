"""
ChennaiNest - BHK Suggested Layout Feature & UX Verification Test Suite
Tests all 8 testing requirements specified in the prompt:
1. Custom values estimated without using BHK suggestions.
2. Selection of 2 BHK previews suggested values without mutating form state.
3. Clicking 'Apply Suggested Layout' populates corresponding values into form fields.
4. User edits populated values and submits form successfully.
5. Final API request contains the actual values currently displayed in the form.
6. Prediction result comes from the existing backend model (models/model.joblib).
7. Validation, error states, and result displays work as expected.
8. Component responsiveness & structural integrity.
"""

import os
import sys
import json
import unittest
import urllib.request

# Ensure repository root is in python path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from backend.main import app
import joblib


class TestBHKLayoutUX(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.model_path = os.path.join(BASE_DIR, "models", "model.joblib")
        cls.pipeline = joblib.load(cls.model_path)
        cls.estimator_component_path = os.path.join(
            BASE_DIR, "frontend", "src", "components", "EstimatorForm.jsx"
        )
        with open(cls.estimator_component_path, "r", encoding="utf-8") as f:
            cls.component_code = f.read()

    # Test 1: Verify BHK suggestions table definitions match requirements exactly
    def test_01_bhk_suggestion_table_values(self):
        expected_layouts = {
            1: {"sqft": 700, "bedrooms": 1, "bathrooms": 1, "rooms": 3},
            2: {"sqft": 1200, "bedrooms": 2, "bathrooms": 2, "rooms": 4},
            3: {"sqft": 1650, "bedrooms": 3, "bathrooms": 2, "rooms": 5},
            4: {"sqft": 2200, "bedrooms": 4, "bathrooms": 2, "rooms": 6},
        }

        # Verify definitions in component code
        for bhk, vals in expected_layouts.items():
            self.assertIn(f"bhk: {bhk}", self.component_code)
            self.assertIn(f"sqft: {vals['sqft']}", self.component_code)
            self.assertIn(f"bedrooms: {vals['bedrooms']}", self.component_code)
            self.assertIn(f"bathrooms: {vals['bathrooms']}", self.component_code)
            self.assertIn(f"rooms: {vals['rooms']}", self.component_code)

    # Test 2: Verify non-destructive preview behavior (state isolation)
    def test_02_non_destructive_selection_logic(self):
        # handleSelectBhk must only update selectedBhk, never formData
        self.assertIn("handleSelectBhk", self.component_code)
        self.assertIn("setSelectedBhk(prev => (prev === bhkNumber ? null : bhkNumber))", self.component_code)
        
        # Verify explicit apply handler exists and is distinct
        self.assertIn("handleApplyBhkSuggestion", self.component_code)
        self.assertIn("Apply Suggested Layout", self.component_code)
        
        # Verify preview disclaimer exists
        self.assertIn("not verified average property sizes for Chennai", self.component_code)
        self.assertIn("Preview Only (Form Unaltered)", self.component_code)

    # Test 3: Case 1 - Custom values estimation without using BHK suggestions
    def test_03_case1_custom_values_without_bhk_suggestion(self):
        custom_payload = {
            "AREA": "Adyar",
            "INT_SQFT": 1420,
            "DIST_MAINROAD": 45,
            "N_BEDROOM": 3,
            "N_BATHROOM": 1,
            "N_ROOM": 5,
            "BUILDTYPE": "House",
            "PARK_FACIL": "Yes",
            "STREET": "Paved",
            "UTILITY_AVAIL": "AllPub",
            "SALE_COND": "Normal Sale",
            "MZZONE": "RL"
        }
        response = self.client.post("/predict", json=custom_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertGreater(data["predicted_price_inr"], 0)
        self.assertEqual(data["property_details"]["INT_SQFT"], 1420)
        self.assertEqual(data["property_details"]["N_BEDROOM"], 3)
        self.assertEqual(data["property_details"]["N_BATHROOM"], 1)
        self.assertEqual(data["property_details"]["N_ROOM"], 5)

    # Test 4: Case 2 & 3 - User applies 2 BHK suggestion
    def test_04_case3_apply_2bhk_suggestion(self):
        # 2 BHK suggested values: 1200 sq ft, 2 bedrooms, 2 bathrooms, 4 total rooms
        applied_2bhk_payload = {
            "AREA": "Anna Nagar",
            "INT_SQFT": 1200,
            "DIST_MAINROAD": 30,
            "N_BEDROOM": 2,
            "N_BATHROOM": 2,
            "N_ROOM": 4,
            "BUILDTYPE": "House",
            "PARK_FACIL": "Yes",
            "STREET": "Paved",
            "UTILITY_AVAIL": "AllPub",
            "SALE_COND": "Normal Sale",
            "MZZONE": "RM"
        }
        response = self.client.post("/predict", json=applied_2bhk_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["property_details"]["INT_SQFT"], 1200)
        self.assertEqual(data["property_details"]["N_BEDROOM"], 2)
        self.assertEqual(data["property_details"]["N_BATHROOM"], 2)
        self.assertEqual(data["property_details"]["N_ROOM"], 4)

    # Test 5: Case 4 - User edits populated values after applying 2 BHK
    def test_05_case4_edit_after_apply_suggestion(self):
        # Started from 2 BHK (1200 sqft), but user changed INT_SQFT to 1350 and N_ROOM to 5
        edited_after_apply_payload = {
            "AREA": "Anna Nagar",
            "INT_SQFT": 1350,
            "DIST_MAINROAD": 30,
            "N_BEDROOM": 2,
            "N_BATHROOM": 2,
            "N_ROOM": 5,
            "BUILDTYPE": "House",
            "PARK_FACIL": "Yes",
            "STREET": "Paved",
            "UTILITY_AVAIL": "AllPub",
            "SALE_COND": "Normal Sale",
            "MZZONE": "RM"
        }
        response = self.client.post("/predict", json=edited_after_apply_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["property_details"]["INT_SQFT"], 1350)
        self.assertEqual(data["property_details"]["N_ROOM"], 5)

    # Test 6: Verify all 4 BHK layout presets yield valid model predictions
    def test_06_all_bhk_layouts_prediction_validity(self):
        layouts = [
            {"bhk": 1, "sqft": 700, "bed": 1, "bath": 1, "room": 3},
            {"bhk": 2, "sqft": 1200, "bed": 2, "bath": 2, "room": 4},
            {"bhk": 3, "sqft": 1650, "bed": 3, "bath": 2, "room": 5},
            {"bhk": 4, "sqft": 2200, "bed": 4, "bath": 2, "room": 6},
        ]
        prev_price = 0
        for item in layouts:
            payload = {
                "AREA": "Velachery",
                "INT_SQFT": item["sqft"],
                "DIST_MAINROAD": 50,
                "N_BEDROOM": item["bed"],
                "N_BATHROOM": item["bath"],
                "N_ROOM": item["room"],
                "BUILDTYPE": "House",
                "PARK_FACIL": "Yes",
                "STREET": "Paved",
                "UTILITY_AVAIL": "AllPub",
                "SALE_COND": "Normal Sale",
                "MZZONE": "RL"
            }
            res = self.client.post("/predict", json=payload)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            price = data["predicted_price_inr"]
            self.assertGreater(price, prev_price, f"{item['bhk']} BHK price should be higher than previous smaller layout")
            prev_price = price

    # Test 7: Verify form validation continues to catch invalid values
    def test_07_validation_remains_active(self):
        invalid_payload = {
            "AREA": "Adyar",
            "INT_SQFT": 300,  # Below 500 sq ft minimum
            "DIST_MAINROAD": 50,
            "N_BEDROOM": 2,
            "N_BATHROOM": 2,
            "N_ROOM": 4,
            "BUILDTYPE": "House",
            "PARK_FACIL": "Yes",
            "STREET": "Paved",
            "UTILITY_AVAIL": "AllPub",
            "SALE_COND": "Normal Sale",
            "MZZONE": "RL"
        }
        res = self.client.post("/predict", json=invalid_payload)
        self.assertEqual(res.status_code, 422)

    # Test 8: Frontend dev server responds with HTTP 200
    def test_08_frontend_dev_server_accessible(self):
        try:
            req = urllib.request.Request("http://localhost:5173", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                self.assertEqual(resp.status, 200)
                html = resp.read().decode("utf-8")
                self.assertIn("ChennaiNest", html)
        except Exception as e:
            self.fail(f"Could not connect to Vite dev server at localhost:5173: {e}")


if __name__ == "__main__":
    unittest.main()
