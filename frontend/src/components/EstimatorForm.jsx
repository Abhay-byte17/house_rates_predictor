import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  MapPin, 
  Maximize2, 
  Navigation, 
  Bed, 
  Bath, 
  Layers, 
  Building2, 
  Car, 
  Footprints, 
  Zap, 
  FileText, 
  Compass, 
  HelpCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  Check,
  X,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { predictPropertyPrice } from '../services/api';

// Optional starting suggestions for common residential configurations (convenience starting points, not official statistics)
const BHK_SUGGESTIONS = [
  {
    bhk: 1,
    label: '1 BHK',
    sqft: 700,
    bedrooms: 1,
    bathrooms: 1,
    rooms: 3,
    description: 'Compact urban apartment layout'
  },
  {
    bhk: 2,
    label: '2 BHK',
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    rooms: 4,
    description: 'Standard residential family home'
  },
  {
    bhk: 3,
    label: '3 BHK',
    sqft: 1650,
    bedrooms: 3,
    bathrooms: 2,
    rooms: 5,
    description: 'Spacious 3-bedroom family layout'
  },
  {
    bhk: 4,
    label: '4 BHK',
    sqft: 2200,
    bedrooms: 4,
    bathrooms: 2,
    rooms: 6,
    description: 'Expansive premium residence'
  }
];

export default function EstimatorForm({ metadata, initialValues, onPredictionSuccess }) {
  const [formData, setFormData] = useState({
    AREA: 'Adyar',
    INT_SQFT: 1200,
    DIST_MAINROAD: 50,
    N_BEDROOM: 2,
    N_BATHROOM: 2,
    N_ROOM: 4,
    BUILDTYPE: 'House',
    PARK_FACIL: 'Yes',
    STREET: 'Paved',
    UTILITY_AVAIL: 'AllPub',
    SALE_COND: 'Normal Sale',
    MZZONE: 'RL'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Optional BHK suggestions state: preview selection never mutates formData automatically
  const [selectedBhk, setSelectedBhk] = useState(null);
  const [appliedBhkNotice, setAppliedBhkNotice] = useState(null);

  // Sync initial values if provided from hero quick preview or locality cards
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const localities = metadata?.supported_localities || [
    'Adyar', 'Anna Nagar', 'Chrompet', 'KK Nagar', 'Karapakkam', 'T Nagar', 'Velachery'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for field
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Toggle or select a BHK suggestion without changing form values
  const handleSelectBhk = (bhkNumber) => {
    setSelectedBhk(prev => (prev === bhkNumber ? null : bhkNumber));
  };

  // Explicitly apply the suggested layout into the form
  const handleApplyBhkSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      INT_SQFT: suggestion.sqft,
      N_BEDROOM: suggestion.bedrooms,
      N_BATHROOM: suggestion.bathrooms,
      N_ROOM: suggestion.rooms
    }));

    // Clear any active field errors for the populated attributes
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.INT_SQFT;
      delete next.N_BEDROOM;
      delete next.N_BATHROOM;
      delete next.N_ROOM;
      return next;
    });

    setAppliedBhkNotice({
      bhk: suggestion.bhk,
      label: suggestion.label,
      sqft: suggestion.sqft,
      bedrooms: suggestion.bedrooms,
      bathrooms: suggestion.bathrooms,
      rooms: suggestion.rooms
    });
  };

  const handleDismissPreview = () => {
    setSelectedBhk(null);
  };

  const activeSuggestion = BHK_SUGGESTIONS.find(s => s.bhk === selectedBhk);

  const validateForm = () => {
    const errors = {};
    if (!formData.AREA || !localities.includes(formData.AREA)) {
      errors.AREA = 'Please select a supported Chennai locality.';
    }
    if (!formData.INT_SQFT || formData.INT_SQFT < 500 || formData.INT_SQFT > 2500) {
      errors.INT_SQFT = 'Square footage must be between 500 and 2,500 sq.ft.';
    }
    if (formData.DIST_MAINROAD === undefined || formData.DIST_MAINROAD < 0 || formData.DIST_MAINROAD > 200) {
      errors.DIST_MAINROAD = 'Distance to main road must be between 0 and 200 metres.';
    }
    if (!formData.N_BEDROOM || formData.N_BEDROOM < 1 || formData.N_BEDROOM > 4) {
      errors.N_BEDROOM = 'Bedrooms must be between 1 and 4.';
    }
    if (!formData.N_BATHROOM || formData.N_BATHROOM < 1 || formData.N_BATHROOM > 2) {
      errors.N_BATHROOM = 'Bathrooms must be between 1 and 2.';
    }
    if (!formData.N_ROOM || formData.N_ROOM < 2 || formData.N_ROOM > 6) {
      errors.N_ROOM = 'Total rooms must be between 2 and 6.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage('Please correct the highlighted fields before calculating.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        AREA: formData.AREA,
        INT_SQFT: parseInt(formData.INT_SQFT, 10),
        DIST_MAINROAD: parseInt(formData.DIST_MAINROAD, 10),
        N_BEDROOM: parseInt(formData.N_BEDROOM, 10),
        N_BATHROOM: parseInt(formData.N_BATHROOM, 10),
        N_ROOM: parseInt(formData.N_ROOM, 10),
        BUILDTYPE: formData.BUILDTYPE,
        PARK_FACIL: formData.PARK_FACIL,
        STREET: formData.STREET,
        UTILITY_AVAIL: formData.UTILITY_AVAIL,
        SALE_COND: formData.SALE_COND,
        MZZONE: formData.MZZONE
      };

      const result = await predictPropertyPrice(payload);
      setLoading(false);
      onPredictionSuccess(result);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'An error occurred while generating the estimate. Please verify the backend service.');
    }
  };

  return (
    <section id="estimator" className="section-spacing" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <Calculator size={14} />
            <span>Chennai Property Valuation Engine</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Calculate Estimated Property Price
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Provide your property specifications below. Our machine learning model will evaluate the 12 key attributes and return an instant valuation in INR.
          </p>
        </div>

        {/* Estimator Card Form */}
        <div className="card-surface" style={{
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: 'var(--shadow-xl)',
          backgroundColor: '#ffffff'
        }}>

          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid #fecaca',
              color: 'var(--color-error)',
              marginBottom: '2rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Calculation Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* OPTIONAL BHK SUGGESTED LAYOUT ASSISTANT */}
            <div 
              id="bhk-layout-assistant"
              style={{
                marginBottom: '2.5rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1.5px solid var(--color-border-subtle)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-emerald-subtle)',
                    color: 'var(--color-emerald-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SlidersHorizontal size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)', fontWeight: 700, margin: 0 }}>
                      Optional: Suggested BHK Starting Layouts
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Select a configuration to preview suggested values. Custom form inputs are preserved until applied.
                    </p>
                  </div>
                </div>

                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', textTransform: 'none', letterSpacing: 'normal' }}>
                  <Sparkles size={12} />
                  <span>Optional Quick-Start</span>
                </span>
              </div>

              {/* BHK Selector Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                marginBottom: selectedBhk ? '1.25rem' : '0'
              }}>
                {BHK_SUGGESTIONS.map((item) => {
                  const isSelected = selectedBhk === item.bhk;
                  return (
                    <button
                      key={item.bhk}
                      type="button"
                      id={`bhk-select-btn-${item.bhk}`}
                      onClick={() => handleSelectBhk(item.bhk)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected
                          ? '2px solid var(--color-emerald-primary)'
                          : '1.5px solid var(--color-border-subtle)',
                        backgroundColor: isSelected ? 'var(--color-emerald-subtle)' : '#ffffff',
                        color: isSelected ? 'var(--color-emerald-deep)' : 'var(--color-navy-dark)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition-smooth)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{item.label}</span>
                        {isSelected && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-emerald-primary)',
                            color: '#ffffff'
                          }}>
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isSelected ? 'var(--color-emerald-deep)' : 'var(--color-text-muted)' }}>
                        {item.sqft.toLocaleString()} sq.ft • {item.bedrooms} Bed
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Preview Card: Displayed when an option is selected, WITHOUT changing formData */}
              {activeSuggestion && (
                <div 
                  id="bhk-suggestion-preview"
                  className="animate-fade-in"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid var(--color-border-emerald)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--color-border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>
                        Suggested Layout Preview: {activeSuggestion.label}
                      </span>
                      <span className="badge badge-navy" style={{ fontSize: '0.72rem', textTransform: 'none', letterSpacing: 'normal' }}>
                        Preview Only (Form Unaltered)
                      </span>
                    </div>

                    <button
                      type="button"
                      id="bhk-preview-dismiss-btn"
                      onClick={handleDismissPreview}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem'
                      }}
                    >
                      <X size={14} />
                      <span>Dismiss Preview</span>
                    </button>
                  </div>

                  {/* 4 Suggested Values Display Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                        Built-up Area
                      </span>
                      <span id="preview-sqft-val" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                        {activeSuggestion.sqft.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>sq ft</span>
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                        Bedrooms
                      </span>
                      <span id="preview-bedrooms-val" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                        {activeSuggestion.bedrooms} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Bedrooms</span>
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                        Bathrooms
                      </span>
                      <span id="preview-bathrooms-val" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                        {activeSuggestion.bathrooms} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Bathrooms</span>
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                        Total Rooms
                      </span>
                      <span id="preview-rooms-val" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                        {activeSuggestion.rooms} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Rooms</span>
                      </span>
                    </div>
                  </div>

                  {/* Informational Disclaimer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'rgba(18, 43, 68, 0.03)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    lineHeight: 1.45
                  }}>
                    <Info size={16} style={{ color: 'var(--color-navy-light)', flexShrink: 0, marginTop: '1px' }} />
                    <span>
                      <strong>Convenience Starting Suggestions:</strong> These are illustrative starting suggestions to streamline estimation, not verified average property sizes for Chennai or official market statistics. Selecting this preview does not change your form.
                    </span>
                  </div>

                  {/* Explicit Action: Apply Suggested Layout */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <button
                      type="button"
                      id="apply-bhk-suggestion-btn"
                      onClick={() => handleApplyBhkSuggestion(activeSuggestion)}
                      className="btn btn-emerald"
                      style={{
                        padding: '0.75rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>Apply Suggested Layout</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDismissPreview}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.75rem 1.1rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span>Keep Current Values</span>
                    </button>

                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginLeft: 'auto' }}>
                      After applying, you can still edit every field freely below.
                    </span>
                  </div>
                </div>
              )}

              {/* Applied Notice Banner */}
              {appliedBhkNotice && (
                <div 
                  id="bhk-applied-notice"
                  className="animate-fade-in"
                  style={{
                    marginTop: selectedBhk ? '1rem' : '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-success-bg)',
                    border: '1px solid #bbf7d0',
                    color: 'var(--color-emerald-deep)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span>
                      <strong>Applied {appliedBhkNotice.label} Suggested Layout:</strong> Populated {appliedBhkNotice.sqft.toLocaleString()} sq ft, {appliedBhkNotice.bedrooms} BHK, {appliedBhkNotice.bathrooms} Bath, {appliedBhkNotice.rooms} Rooms. All fields below are fully editable.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedBhkNotice(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-emerald-deep)',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                    title="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 1: Location and Size */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-emerald-subtle)', color: 'var(--color-emerald-deep)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy-dark)' }}>1. Location & Property Size</h3>
                  <p style={{ fontSize: '0.85rem' }}>Neighborhood selection and physical dimensions</p>
                </div>
              </div>

              <div className="grid-cols-3">
                {/* Locality */}
                <div className="form-group">
                  <label className="form-label" htmlFor="area-select">
                    <span>Neighbourhood</span>
                  </label>
                  <select
                    id="area-select"
                    value={formData.AREA}
                    onChange={(e) => handleChange('AREA', e.target.value)}
                    className={`form-select ${fieldErrors.AREA ? 'error' : ''}`}
                  >
                    {localities.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <span className="form-hint">7 verified central & south Chennai hubs</span>
                  {fieldErrors.AREA && <span className="form-error-text">{fieldErrors.AREA}</span>}
                </div>

                {/* Interior Sq.Ft */}
                <div className="form-group">
                  <label className="form-label" htmlFor="int-sqft-input">
                    <span>Interior Area (Sq.Ft)</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      id="int-sqft-input"
                      type="number"
                      min={500}
                      max={2500}
                      step={10}
                      value={formData.INT_SQFT}
                      onChange={(e) => handleChange('INT_SQFT', Number(e.target.value))}
                      className={`form-input ${fieldErrors.INT_SQFT ? 'error' : ''}`}
                    />
                  </div>
                  <span className="form-hint">Dataset scope: 500 – 2,500 sq.ft</span>
                  {fieldErrors.INT_SQFT && <span className="form-error-text">{fieldErrors.INT_SQFT}</span>}
                </div>

                {/* Distance to Main Road */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dist-road-input">
                    <span>Distance to Main Road</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="dist-road-input"
                      type="number"
                      min={0}
                      max={200}
                      value={formData.DIST_MAINROAD}
                      onChange={(e) => handleChange('DIST_MAINROAD', Number(e.target.value))}
                      className={`form-input ${fieldErrors.DIST_MAINROAD ? 'error' : ''}`}
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      metres
                    </span>
                  </div>
                  <span className="form-hint">0 m (on road) to 200 m</span>
                  {fieldErrors.DIST_MAINROAD && <span className="form-error-text">{fieldErrors.DIST_MAINROAD}</span>}
                </div>
              </div>
            </div>

            {/* SECTION 2: Property Layout */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-emerald-subtle)', color: 'var(--color-emerald-deep)' }}>
                  <Layers size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy-dark)' }}>2. Property Layout & Rooms</h3>
                  <p style={{ fontSize: '0.85rem' }}>Bedrooms, bathrooms, and total internal rooms</p>
                </div>
              </div>

              <div className="grid-cols-3">
                {/* Bedrooms */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Bedrooms (BHK)</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2, 3, 4].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => handleChange('N_BEDROOM', num)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${formData.N_BEDROOM === num ? 'var(--color-navy-primary)' : 'var(--color-border-subtle)'}`,
                          backgroundColor: formData.N_BEDROOM === num ? 'var(--color-navy-primary)' : '#ffffff',
                          color: formData.N_BEDROOM === num ? '#ffffff' : 'var(--color-text-main)',
                          cursor: 'pointer',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="form-hint">Number of dedicated bedrooms</span>
                </div>

                {/* Bathrooms */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Bathrooms</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => handleChange('N_BATHROOM', num)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${formData.N_BATHROOM === num ? 'var(--color-navy-primary)' : 'var(--color-border-subtle)'}`,
                          backgroundColor: formData.N_BATHROOM === num ? 'var(--color-navy-primary)' : '#ffffff',
                          color: formData.N_BATHROOM === num ? '#ffffff' : 'var(--color-text-main)',
                          cursor: 'pointer',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="form-hint">Bathrooms in the residence</span>
                </div>

                {/* Total Rooms */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Total Rooms</span>
                  </label>
                  <select
                    value={formData.N_ROOM}
                    onChange={(e) => handleChange('N_ROOM', Number(e.target.value))}
                    className="form-select"
                  >
                    {[2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Rooms (inc. Hall/Kitchen)</option>
                    ))}
                  </select>
                  <span className="form-hint">Living, dining, bedrooms, kitchen</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Property Characteristics */}
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-emerald-subtle)', color: 'var(--color-emerald-deep)' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy-dark)' }}>3. Property Characteristics & Infrastructure</h3>
                  <p style={{ fontSize: '0.85rem' }}>Structure type, street access, and utility connections</p>
                </div>
              </div>

              <div className="grid-cols-4">
                {/* Build Type */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Property Type</span>
                  </label>
                  <select
                    value={formData.BUILDTYPE}
                    onChange={(e) => handleChange('BUILDTYPE', e.target.value)}
                    className="form-select"
                  >
                    <option value="House">Independent House</option>
                    <option value="Others">Apartment / Others</option>
                    <option value="Commercial">Commercial Building</option>
                  </select>
                  <span className="form-hint">Classification in registry</span>
                </div>

                {/* Parking */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Parking Facility</span>
                  </label>
                  <select
                    value={formData.PARK_FACIL}
                    onChange={(e) => handleChange('PARK_FACIL', e.target.value)}
                    className="form-select"
                  >
                    <option value="Yes">Yes (Dedicated Parking)</option>
                    <option value="No">No Parking</option>
                  </select>
                  <span className="form-hint">Private parking space</span>
                </div>

                {/* Street Type */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Street Approach</span>
                  </label>
                  <select
                    value={formData.STREET}
                    onChange={(e) => handleChange('STREET', e.target.value)}
                    className="form-select"
                  >
                    <option value="Paved">Paved (Tar/Concrete)</option>
                    <option value="Gravel">Gravel Road</option>
                    <option value="No Access">No Direct Vehicle Access</option>
                  </select>
                  <span className="form-hint">Frontage access condition</span>
                </div>

                {/* Utilities */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Public Utilities</span>
                  </label>
                  <select
                    value={formData.UTILITY_AVAIL}
                    onChange={(e) => handleChange('UTILITY_AVAIL', e.target.value)}
                    className="form-select"
                  >
                    <option value="AllPub">All Public (Water, Sewr, Elect)</option>
                    <option value="NoSewr">Electricity, Gas & Water</option>
                    <option value="NoSeWa">Electricity & Gas Only</option>
                    <option value="ELO">Electricity Only (ELO)</option>
                  </select>
                  <span className="form-hint">Utility grid connections</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Transaction & Zoning Details */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-emerald-subtle)', color: 'var(--color-emerald-deep)' }}>
                  <Compass size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy-dark)' }}>4. Transaction Condition & Municipal Zoning</h3>
                  <p style={{ fontSize: '0.85rem' }}>Sale classification and CMDA municipal masterplan zoning</p>
                </div>
              </div>

              <div className="grid-cols-2">
                {/* Sale Condition */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Sale Condition</span>
                  </label>
                  <select
                    value={formData.SALE_COND}
                    onChange={(e) => handleChange('SALE_COND', e.target.value)}
                    className="form-select"
                  >
                    <option value="Normal Sale">Normal Sale (Standard Open Market)</option>
                    <option value="AbNormal">AbNormal (Foreclosure, trade, short sale)</option>
                    <option value="Family">Family Sale (Between family members)</option>
                    <option value="Partial">Partial (Under construction / unfinished)</option>
                    <option value="AdjLand">Adjacent Land Purchase</option>
                  </select>
                  <span className="form-hint">Nature of transaction transaction terms</span>
                </div>

                {/* Municipal Zone (MZZONE) with detailed explanation */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Municipal Zone (CMDA Code)</span>
                  </label>
                  <select
                    value={formData.MZZONE}
                    onChange={(e) => handleChange('MZZONE', e.target.value)}
                    className="form-select"
                  >
                    <option value="RL">RL — Residential Low Density</option>
                    <option value="RM">RM — Residential Medium Density</option>
                    <option value="RH">RH — Residential High Density</option>
                    <option value="C">C — Commercial Zone</option>
                    <option value="A">A — Agricultural / Green Belt Zone</option>
                    <option value="I">I — Industrial Zone</option>
                  </select>
                  <span className="form-hint" style={{ color: 'var(--color-navy-primary)', fontWeight: 500 }}>
                    ℹ️ Municipal Zone is the CMDA urban masterplan designation, not your locality name.
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)'
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-emerald"
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  padding: '1.1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 700
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Running ML Valuation Engine...</span>
                  </>
                ) : (
                  <>
                    <Calculator size={22} />
                    <span>Calculate Estimated Price</span>
                  </>
                )}
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
                Instant calculation powered by scikit-learn HistGradientBoosting trained on 7,109 Chennai properties.
              </span>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}
