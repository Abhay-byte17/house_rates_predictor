import React from 'react';
import { AlertTriangle, MapPin, Calendar, HelpCircle, ShieldAlert } from 'lucide-react';

export default function ModelLimitations() {
  const limitations = [
    {
      icon: <MapPin size={22} color="var(--color-terracotta)" />,
      title: "Geographical Coverage Limit",
      text: "The model is specifically trained on 7 central and south Chennai corridors (Adyar, Anna Nagar, Chrompet, KK Nagar, Karapakkam, T Nagar, and Velachery). It cannot reliably evaluate properties in unrepresented regions such as OMR Siruseri, Tambaram, Porur, or ECR."
    },
    {
      icon: <Calendar size={22} color="var(--color-navy-primary)" />,
      title: "Historical Transaction Baseline",
      text: "Valuations are grounded in historical sales records (spanning ₹21.5 Lakhs to ₹2.37 Crores). In contemporary Chennai real estate, prime luxury pockets and hyper-local inflation may trade at higher multiples than the historical baseline."
    },
    {
      icon: <AlertTriangle size={22} color="var(--color-gold)" />,
      title: "Not a Certified Legal Appraisal",
      text: "ChennaiNest provides algorithmic estimations for planning, research, and comparative budgeting. It does not constitute a certified bank appraisal, government guideline rate certificate, or an offer to buy or sell real estate."
    },
    {
      icon: <ShieldAlert size={22} color="var(--color-emerald-deep)" />,
      title: "Building Type Differences",
      text: "The dataset includes Commercial, Independent House, and Other (Apartment/Flat) building classifications. Commercial buildings command higher square-foot price points than residential houses in identical zones."
    }
  ];

  return (
    <section id="limitations" className="section-spacing" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1050px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-terracotta" style={{ marginBottom: '0.75rem' }}>
            <AlertTriangle size={14} />
            <span>Scope & Transparency</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Model Scope & Practical Limitations
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            We believe in honest, transparent AI engineering. Here is what our model does well, and where human expertise remains essential.
          </p>
        </div>

        <div className="grid-cols-2">
          {limitations.map((item, idx) => (
            <div
              key={idx}
              className="card-surface"
              style={{
                padding: '2rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                backgroundColor: '#ffffff',
                borderLeft: '4px solid var(--color-terracotta)'
              }}
            >
              <div style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-primary)',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy-dark)', marginBottom: '0.4rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
