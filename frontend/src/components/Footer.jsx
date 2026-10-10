import React from 'react';
import { Home, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-navy-dark)',
      color: '#ffffff',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3.5rem'
        }} className="footer-grid">
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-emerald-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Home size={18} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                Chennai<span style={{ color: 'var(--color-emerald-light)' }}>Nest</span>
              </span>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '380px',
              marginBottom: '1.5rem'
            }}>
              Intelligent real-estate valuation engine for Chennai property transactions, powered by machine learning, FastAPI, React, and Docker.
            </p>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              GitHub Repository: <code>house_rates_predictor</code>
            </div>
          </div>

          {/* Supported Localities */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.25rem' }}>
              Covered Chennai Localities
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Adyar</li>
              <li>Anna Nagar</li>
              <li>Chrompet</li>
              <li>KK Nagar</li>
              <li>Karapakkam</li>
              <li>T Nagar</li>
              <li>Velachery</li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.25rem' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="#estimator" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Price Estimator</a></li>
              <li><a href="#neighborhoods" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Chennai Neighborhoods</a></li>
              <li><a href="#why-us" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Why ChennaiNest</a></li>
              <li><a href="#how-it-works" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>How It Works</a></li>
              <li><a href="#limitations" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Model Scope & Disclaimer</a></li>
              <li><a href="#developer" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Developer Profile</a></li>
              <li><a href="#about" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Architecture & Tech Stack</a></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Note */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2.5rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          lineHeight: 1.55
        }}>
          <strong style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>
            Historical Estimation Notice:
          </strong>
          This estimate is based on historical property data and model patterns. It is not a guaranteed current market price, professional valuation, or offer to buy or sell a property. Real-world property values vary based on on-site inspection, exact construction age, interior fixtures, and prevailing economic conditions.
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} ChennaiNest. All rights reserved.
          </div>
          <div>
            Developed with FastAPI, React, and Scikit-Learn
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
