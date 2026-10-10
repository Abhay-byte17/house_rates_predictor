import React from 'react';
import { Sliders, Cpu, Compass, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <Sliders size={28} color="var(--color-navy-primary)" />,
      title: "Enter Property Details",
      desc: "Specify your home dimensions, preferred Chennai locality, room layout, parking, road distance, and municipal zoning."
    },
    {
      step: "02",
      icon: <Cpu size={28} color="var(--color-emerald-deep)" />,
      title: "Model Generates Estimate",
      desc: "Our FastAPI service validates your parameters and executes the trained Histogram Gradient Boosting pipeline in milliseconds."
    },
    {
      step: "03",
      icon: <Compass size={28} color="var(--color-terracotta)" />,
      title: "Explore Your Options",
      desc: "Review your transparent price valuation in INR Crores and Lakhs, benchmarked against real historical transaction data."
    }
  ];

  return (
    <section id="how-it-works" className="section-spacing" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border-subtle)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            <span>Simple 3-Step Process</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            How ChennaiNest Works
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            A transparent and seamless process from property input to instant valuation.
          </p>
        </div>

        <div className="grid-cols-3" style={{ position: 'relative' }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                padding: '2.5rem 2rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-primary)'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border-subtle)'
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'rgba(18, 43, 68, 0.12)'
                  }}>
                    {s.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--color-navy-dark)' }}>
                  {s.title}
                </h3>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to jump to estimator */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#estimator" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
            <span>Try the Estimator Now</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
