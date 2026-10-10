import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  MapPin, 
  Building, 
  Bed, 
  Bath, 
  Maximize2, 
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function PredictionResult({ result, onRecalculate }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const {
    predicted_price_inr,
    formatted_price,
    formatted_price_lakhs,
    locality,
    disclaimer,
    property_details = {}
  } = result;

  return (
    <div id="prediction-result" className="container animate-fade-in" style={{ maxWidth: '850px', marginBottom: '4rem' }}>
      <div className="card-surface" style={{
        padding: 'clamp(2rem, 5vw, 3rem)',
        border: '2px solid var(--color-emerald-light)',
        boxShadow: 'var(--shadow-xl)',
        background: 'linear-gradient(180deg, #ffffff 0%, #fbfdfc 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Accent top banner */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, var(--color-emerald-deep) 0%, var(--color-emerald-light) 50%, var(--color-navy-primary) 100%)'
        }} />

        {/* Top Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-emerald-subtle)',
              color: 'var(--color-emerald-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-emerald-deep)' }}>
                Valuation Generated Successfully
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-navy-dark)' }}>
                Estimated Market Value ({locality})
              </div>
            </div>
          </div>

          <span className="badge badge-navy">
            <MapPin size={13} />
            <span>{locality}, Chennai</span>
          </span>
        </div>

        {/* Big Price Display */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-bg-subtle)',
          marginBottom: '2rem',
          border: '1px solid var(--color-border-subtle)'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Estimated Property Value
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.75rem, 6vw, 3.75rem)',
            fontWeight: 800,
            color: 'var(--color-navy-dark)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem'
          }}>
            {formatted_price}
          </div>

          <div style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-emerald-deep)',
            marginBottom: '0.25rem'
          }}>
            ₹{predicted_price_inr.toLocaleString('en-IN')}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
            Approx. {formatted_price_lakhs}
          </div>
        </div>

        {/* Summary Spec Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem'
        }} className="spec-pills-grid">
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Interior Area</div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>
              {property_details.INT_SQFT} sq.ft
            </div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Bedrooms</div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>
              {property_details.N_BEDROOM} BHK
            </div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Bathrooms</div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>
              {property_details.N_BATHROOM} Baths
            </div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Property Type</div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)', fontSize: '0.95rem' }}>
              {property_details.BUILDTYPE}
            </div>
          </div>
        </div>

        {/* Expandable Specifications Drawer */}
        <div style={{
          marginBottom: '2rem',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--color-navy-dark)'
            }}
          >
            <span>View All Submitted Property Features (12 Specs)</span>
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showDetails && (
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-bg-primary)',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div><strong>Neighbourhood:</strong> {property_details.AREA}</div>
                <div><strong>Interior Area:</strong> {property_details.INT_SQFT} sq.ft</div>
                <div><strong>Distance to Main Road:</strong> {property_details.DIST_MAINROAD} metres</div>
                <div><strong>Bedrooms:</strong> {property_details.N_BEDROOM}</div>
                <div><strong>Bathrooms:</strong> {property_details.N_BATHROOM}</div>
                <div><strong>Total Rooms:</strong> {property_details.N_ROOM}</div>
                <div><strong>Building Type:</strong> {property_details.BUILDTYPE}</div>
                <div><strong>Parking Facility:</strong> {property_details.PARK_FACIL}</div>
                <div><strong>Street Approach:</strong> {property_details.STREET}</div>
                <div><strong>Public Utilities:</strong> {property_details.UTILITY_AVAIL}</div>
                <div><strong>Sale Condition:</strong> {property_details.SALE_COND}</div>
                <div><strong>Municipal Zone:</strong> {property_details.MZZONE}</div>
              </div>
            </div>
          )}
        </div>

        {/* Historical Disclaimer */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)'
        }}>
          <Info size={18} style={{ color: 'var(--color-navy-light)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--color-navy-dark)', display: 'block', marginBottom: '0.2rem' }}>
              Valuation Disclaimer
            </strong>
            <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: 1.5 }}>
              {disclaimer || "This estimate is based on historical property data and model patterns. It is not a guaranteed current market price, professional valuation, or offer to buy or sell a property."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onRecalculate}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <RotateCcw size={16} />
            <span>Recalculate / Adjust Property Details</span>
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .spec-pills-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
