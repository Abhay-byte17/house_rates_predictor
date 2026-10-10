import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EstimatorForm from './components/EstimatorForm';
import PredictionResult from './components/PredictionResult';
import NeighborhoodCards from './components/NeighborhoodCards';
import WhyChennaiNest from './components/WhyChennaiNest';
import HowItWorks from './components/HowItWorks';
import ModelLimitations from './components/ModelLimitations';
import AboutProject from './components/AboutProject';
import DeveloperProfile from './components/DeveloperProfile';
import Footer from './components/Footer';

import { getMetadata, getHealth, DEFAULT_METADATA } from './services/api';
import { AlertCircle, WifiOff } from 'lucide-react';

export default function App() {
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  useEffect(() => {
    loadAppMetadata();
  }, []);

  const loadAppMetadata = async () => {
    // 1. Check health
    const health = await getHealth();
    setIsBackendOnline(health.online);

    // 2. Load dynamic metadata from backend
    const meta = await getMetadata();
    setMetadata(meta);
  };

  const handleQuickPreview = (values) => {
    setInitialFormValues(values);
    setPredictionResult(null);
  };

  const handleLocalitySelect = (localityName) => {
    setInitialFormValues(prev => ({
      ...(prev || {}),
      AREA: localityName
    }));
  };

  const handlePredictionSuccess = (result) => {
    setPredictionResult(result);
    // Smooth scroll to prediction result
    setTimeout(() => {
      const el = document.querySelector('#prediction-result');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRecalculate = () => {
    const el = document.querySelector('#estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const localities = metadata?.supported_localities || DEFAULT_METADATA.supported_localities;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <Navbar />

      {/* Backend Offline Notice Banner (if API not running yet) */}
      {!isBackendOnline && (
        <div style={{
          backgroundColor: '#fffbeb',
          borderBottom: '1px solid #fde68a',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          textAlign: 'center'
        }}>
          <WifiOff size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>FastAPI Backend Offline:</strong> Start the backend with <code>uvicorn backend.main:app --reload</code> on port 8000 for live model predictions.
          </span>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        localities={localities}
        onQuickPreviewSubmit={handleQuickPreview}
      />

      {/* Prediction Result Display (When generated) */}
      {predictionResult && (
        <PredictionResult
          result={predictionResult}
          onRecalculate={handleRecalculate}
        />
      )}

      {/* Full 12-Feature Property Estimator Form */}
      <EstimatorForm
        metadata={metadata}
        initialValues={initialFormValues}
        onPredictionSuccess={handlePredictionSuccess}
      />

      {/* 7 Chennai Localities Showcase */}
      <NeighborhoodCards
        onSelectLocality={handleLocalitySelect}
      />

      {/* Why ChennaiNest Value Propositions */}
      <WhyChennaiNest />

      {/* 3-Step Process Walkthrough */}
      <HowItWorks />

      {/* Transparent Model Scope & Limitations */}
      <ModelLimitations />

      {/* Educational Tech Stack & Engineering Overview */}
      <AboutProject />

      {/* Developer Profile Section */}
      <DeveloperProfile />

      {/* Footer */}
      <Footer />

    </div>
  );
}
