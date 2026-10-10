import React from 'react';
import { Database, ShieldCheck, Cpu, Eye, CheckCircle2 } from 'lucide-react';

export default function WhyChennaiNest() {
  const benefits = [
    {
      icon: <Database size={24} color="var(--color-emerald-deep)" />,
      title: "Trained on 7,100+ Verified Transactions",
      description: "Our machine learning model is grounded in historical Chennai registry transactions, capturing genuine price variations across different localities and property dimensions."
    },
    {
      icon: <Cpu size={24} color="var(--color-navy-primary)" />,
      title: "12-Dimensional Multi-Factor Modeling",
      description: "Unlike simple price-per-square-foot calculators, ChennaiNest models complex non-linear interactions across interior area, road distance, bedrooms, parking, street condition, and zoning."
    },
    {
      icon: <ShieldCheck size={24} color="var(--color-terracotta)" />,
      title: "Zero Target Leakage by Design",
      description: "Transaction commission and post-sale broker charges have been permanently removed from model features to ensure accurate, unpolluted pre-purchase estimates."
    },
    {
      icon: <Eye size={24} color="var(--color-emerald-primary)" />,
      title: "Transparent & Unbiased Valuations",
      description: "ChennaiNest provides objective algorithmic benchmarks without real-estate broker inflation, ad-sponsored listing biases, or arbitrary lead-generation markups."
    }
  ];

  return (
    <section id="why-us" className="section-spacing" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <span>Why ChennaiNest</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Built for Accurate, Grounded Home Valuation
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Designed to bring analytical clarity to home buyers and property owners planning real estate decisions in Chennai.
          </p>
        </div>

        <div className="grid-cols-2">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                padding: '2rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-primary)',
                flexShrink: 0
              }}>
                {b.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-navy-dark)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
