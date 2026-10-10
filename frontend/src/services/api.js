/**
 * ChennaiNest API Client Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Fallback metadata strictly matching models/feature_schema.json
export const DEFAULT_METADATA = {
  service: "ChennaiNest API",
  version: "1.0.0",
  currency: "INR",
  supported_localities: [
    "Adyar",
    "Anna Nagar",
    "Chrompet",
    "KK Nagar",
    "Karapakkam",
    "T Nagar",
    "Velachery"
  ],
  required_fields: [
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
  numeric_features: {
    INT_SQFT: { type: "int", min: 500, max: 2500, description: "Interior square footage (500 to 2500 sq.ft)" },
    DIST_MAINROAD: { type: "int", min: 0, max: 200, description: "Distance to main road in meters (0 to 200 m)" },
    N_BEDROOM: { type: "int", min: 1, max: 4, description: "Number of bedrooms (1 to 4)" },
    N_BATHROOM: { type: "int", min: 1, max: 2, description: "Number of bathrooms (1 to 2)" },
    N_ROOM: { type: "int", min: 2, max: 6, description: "Total rooms (2 to 6)" }
  },
  categorical_features: {
    AREA: {
      type: "category",
      allowed: ["Adyar", "Anna Nagar", "Chrompet", "KK Nagar", "Karapakkam", "T Nagar", "Velachery"],
      description: "Locality in Chennai"
    },
    SALE_COND: {
      type: "category",
      allowed: ["Normal Sale", "AbNormal", "Partial", "Family", "AdjLand"],
      description: "Transaction sale condition"
    },
    PARK_FACIL: {
      type: "category",
      allowed: ["Yes", "No"],
      description: "Parking facility availability"
    },
    BUILDTYPE: {
      type: "category",
      allowed: ["House", "Commercial", "Others"],
      description: "Building classification"
    },
    UTILITY_AVAIL: {
      type: "category",
      allowed: ["AllPub", "ELO", "NoSeWa", "NoSewr"],
      description: "Available utilities"
    },
    STREET: {
      type: "category",
      allowed: ["Paved", "Gravel", "No Access"],
      description: "Street approach type"
    },
    MZZONE: {
      type: "category",
      allowed: ["RL", "RH", "RM", "C", "A", "I"],
      description: "Municipal Zoning code"
    }
  },
  target: {
    name: "SALES_PRICE",
    unit: "INR",
    min_dataset: 2156875,
    max_dataset: 23667340,
    median_dataset: 10335050
  },
  disclaimer: "This estimate is based on the available historical dataset."
};

/**
 * Fetch health status of the backend API
 */
export async function getHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { online: false, modelLoaded: false, error: `HTTP ${response.status}` };
    }
    const data = await response.json();
    return { online: true, modelLoaded: data.model_loaded, data };
  } catch (err) {
    return { online: false, modelLoaded: false, error: err.message };
  }
}

/**
 * Fetch metadata containing valid localities, categories, and field limits
 */
export async function getMetadata() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_BASE_URL}/metadata`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      console.warn('Backend metadata fetch non-200, using schema fallback');
      return DEFAULT_METADATA;
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Backend metadata fetch failed, using schema fallback:', err.message);
    return DEFAULT_METADATA;
  }
}

/**
 * Submit property details to the ML prediction endpoint
 */
export async function predictPropertyPrice(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // Handle validation error (422) or server error
      if (data && data.details) {
        const errorDetails = data.details.map(d => `${d.field}: ${d.message}`).join(' | ');
        throw new Error(errorDetails || data.error || 'Validation failed on submitted fields.');
      }
      throw new Error(data.message || data.detail || `Server returned error status ${response.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check if the FastAPI backend is running at ' + API_BASE_URL);
    }
    throw err;
  }
}
