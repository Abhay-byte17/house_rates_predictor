import React from 'react';
import { Code2, Server, Layout, Database } from 'lucide-react';

export default function AboutProject() {
  const stack = [
    {
      title: "Scikit-Learn ML Core",
      desc: "Histogram Gradient Boosting Regressor (R² = 0.993, MAE = ₹2.42L) fitted with robust imputers and one-hot encoders.",
      icon: <Database size={20} color="var(--color-navy-primary)" />
    },
    {
      title: "FastAPI REST Backend",
      desc: "High-performance Python backend with Pydantic v2 validation, strict typing, and sub-5ms inference latency.",
      icon: <Server size={20} color="var(--color-emerald-deep)" />
    },
    {
      title: "Modern React & Vite",
      desc: "Component-driven frontend built with accessible form validation, clean responsive layouts, and zero bloat.",
      icon: <Layout size={20} color="var(--color-terracotta)" />
    },
    {
      title: "Full Containerization",
      desc: "Docker and Docker Compose architecture ready for reproducible multi-service deployment.",
      icon: <Code2 size={20} color="var(--color-emerald-light)" />
    }
  ];

  return (
    <section id="about" className="section-spacing" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border-subtle)' }}>
      <div className="container" style={{ maxWidth: '1050px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            <span>Engineering & Design</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            About the ChennaiNest Project
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            An end-to-end Machine Learning, FastAPI, React, and Docker showcase designed for realistic real-estate valuation engineering.
          </p>
        </div>

        <div className="grid-cols-4">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)', marginBottom: '0.4rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--color-text-muted)', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
