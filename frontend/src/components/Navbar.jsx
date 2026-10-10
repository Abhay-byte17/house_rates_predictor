import React, { useState, useEffect } from 'react';
import { Home, Activity, CheckCircle2, AlertCircle, Menu, X, ArrowRight } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Navbar({ onOpenEstimator }) {
  const [health, setHealth] = useState({ online: false, checking: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    const res = await getHealth();
    setHealth({ online: res.online, checking: false });
  };

  const navLinks = [
    { name: 'Estimate Price', href: '#estimator' },
    { name: 'Neighbourhoods', href: '#neighborhoods' },
    { name: 'Why ChennaiNest', href: '#why-us' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Model & Scope', href: '#limitations' },
    { name: 'Developer', href: '#developer' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-border-subtle)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-navy-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Home size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--color-navy-dark)',
              letterSpacing: '-0.03em'
            }}>
              Chennai<span style={{ color: 'var(--color-emerald-primary)' }}>Nest</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--color-text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginTop: '-3px'
            }}>
              Property Valuation
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem'
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-navy-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action & API Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* API Health indicator */}
          <div
            title={health.online ? 'FastAPI model service is connected' : 'Backend is currently offline'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: health.online ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              color: health.online ? 'var(--color-success)' : 'var(--color-error)',
              border: `1px solid ${health.online ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: health.online ? 'var(--color-success)' : 'var(--color-error)',
              display: 'inline-block'
            }} />
            <span>{health.online ? 'ML API Live' : 'API Offline'}</span>
          </div>

          <a
            href="#estimator"
            onClick={(e) => handleNavClick(e, '#estimator')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            <span>Estimate Home</span>
            <ArrowRight size={15} />
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-navy-dark)'
            }}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-navy-dark)',
                padding: '0.4rem 0'
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
