import React, { useState } from 'react';
import { ArrowRight, MapPin, Calculator, Sparkles, Building, CheckCircle2 } from 'lucide-react';

export default function Hero({ localities, onQuickPreviewSubmit }) {
  const [quickArea, setQuickArea] = useState(localities[0] || 'Adyar');
  const [quickSqft, setQuickSqft] = useState(1200);
  const [quickBeds, setQuickBeds] = useState(2);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onQuickPreviewSubmit({
      AREA: quickArea,
      INT_SQFT: Number(quickSqft),
      N_BEDROOM: Number(quickBeds)
    });
    const target = document.querySelector('#estimator');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      paddingTop: '3.5rem',
      paddingBottom: '4.5rem',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #ffffff 0%, var(--color-bg-primary) 100%)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '3rem',
          alignItems: 'center'
        }} className="hero-grid">
          
          {/* Left Column: Headlines & CTAs */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-emerald">
                <Sparkles size={14} />
                <span>Machine Learning Property Intelligence</span>
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--color-navy-dark)'
            }}>
              Find Your Dream Home in <span style={{ color: 'var(--color-emerald-primary)' }}>Chennai</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              lineHeight: 1.6,
              color: 'var(--color-text-muted)',
              marginBottom: '2.25rem',
              maxWidth: '560px'
            }}>
              Discover an estimated property price based on your preferred Chennai neighbourhood and home details.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <a
                href="#estimator"
                onClick={(e) => handleScrollTo(e, '#estimator')}
                className="btn btn-emerald"
                style={{ fontSize: '1rem', padding: '0.95rem 2rem' }}
              >
                <Calculator size={18} />
                <span>Estimate My Home Price</span>
              </a>

              <a
                href="#neighborhoods"
                onClick={(e) => handleScrollTo(e, '#neighborhoods')}
                className="btn btn-secondary"
                style={{ fontSize: '1rem', padding: '0.95rem 1.75rem' }}
              >
                <MapPin size={18} />
                <span>Explore Neighbourhoods</span>
              </a>
            </div>

            {/* Fast Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  7,100+
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
                  Historical Records
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-emerald-primary)' }}>
                  7 Areas
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
                  Prime Chennai Zones
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                  12 Specs
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
                  Evaluated Features
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Residential Imagery + Compact Estimator Preview */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}>
              <img
                src="/images/hero_home.jpg"
                alt="Contemporary luxury residential house in Chennai"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(9, 26, 43, 0.05) 0%, rgba(9, 26, 43, 0.65) 100%)'
              }} />

              {/* Floating Badge on Image */}
              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1', fontWeight: 600 }}>
                    Chennai Real Estate Architecture
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                    Adyar, Anna Nagar & Coastline Villas
                  </div>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Model Verified
                </span>
              </div>
            </div>

            {/* Quick Preview Card Overlapping */}
            <div className="card-surface" style={{
              marginTop: '-2rem',
              marginLeft: '1.5rem',
              marginRight: '1.5rem',
              position: 'relative',
              zIndex: 10,
              padding: '1.25rem 1.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={16} color="var(--color-emerald-primary)" />
                <span>Quick Valuation Preview</span>
              </div>

              <form onSubmit={handleQuickSubmit} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr) auto',
                gap: '0.75rem',
                alignItems: 'flex-end'
              }} className="quick-form-grid">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Neighbourhood
                  </label>
                  <select
                    value={quickArea}
                    onChange={(e) => setQuickArea(e.target.value)}
                    className="form-select"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    {localities.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Interior Sq.Ft
                  </label>
                  <input
                    type="number"
                    min={500}
                    max={2500}
                    value={quickSqft}
                    onChange={(e) => setQuickSqft(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Bedrooms
                  </label>
                  <select
                    value={quickBeds}
                    onChange={(e) => setQuickBeds(e.target.value)}
                    className="form-select"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  <span>Pre-fill & Estimate</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .quick-form-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .quick-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
