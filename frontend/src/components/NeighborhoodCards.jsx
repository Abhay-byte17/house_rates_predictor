import React from 'react';
import { MapPin, ArrowRight, Building, Sparkles } from 'lucide-react';

const LOCALITY_DATA = [
  {
    name: "Adyar",
    tagline: "Coastal Sophistication & Green Avenues",
    records: "774 transactions",
    benchmarkRange: "₹38.7L – ₹1.74Cr",
    avgSqft: "1,142 sq.ft",
    character: "South Chennai upscale residential hub with beach proximity, cultural heritage, and premier educational institutes.",
    badge: "Upscale South"
  },
  {
    name: "Anna Nagar",
    tagline: "Planned Luxury & Broad Boulevard Living",
    records: "788 transactions",
    benchmarkRange: "₹95.9L – ₹2.34Cr",
    avgSqft: "1,750 sq.ft",
    character: "Iconic western Chennai residential landmark featuring grid-planned avenues, luxury bungalows, and high-end retail.",
    badge: "Prime Central-West"
  },
  {
    name: "T Nagar",
    tagline: "Commercial Epicentre & High-Density Core",
    records: "501 transactions",
    benchmarkRange: "₹94.3L – ₹2.37Cr",
    avgSqft: "1,755 sq.ft",
    character: "Chennai's shopping powerhouse offering unbeatable central transit access and prime commercial and residential mix.",
    badge: "Commercial Core"
  },
  {
    name: "KK Nagar",
    tagline: "Quiet Sectors & Established Communities",
    records: "997 transactions",
    benchmarkRange: "₹74.1L – ₹2.02Cr",
    avgSqft: "1,875 sq.ft",
    character: "Well-connected sector township with tree-shaded roads, multi-speciality healthcare, and peaceful family enclaves.",
    badge: "Family Township"
  },
  {
    name: "Velachery",
    tagline: "Transit Crossroads & Modern Corridors",
    records: "981 transactions",
    benchmarkRange: "₹55.7L – ₹1.83Cr",
    avgSqft: "1,739 sq.ft",
    character: "Thriving residential nexus linking South Chennai with OMR IT companies, shopping malls, and railway connectivity.",
    badge: "South Connect"
  },
  {
    name: "Chrompet",
    tagline: "Suburban Value & Airport Connectivity",
    records: "1,702 transactions",
    benchmarkRange: "₹53.4L – ₹1.60Cr",
    avgSqft: "1,034 sq.ft",
    character: "High-density residential hub along the Grand Southern Trunk (GST) Road, with close access to Chennai International Airport.",
    badge: "High Growth"
  },
  {
    name: "Karapakkam",
    tagline: "OMR Tech Expressway Corridor",
    records: "1,366 transactions",
    benchmarkRange: "₹21.5L – ₹1.45Cr",
    avgSqft: "1,050 sq.ft",
    character: "Heart of the Rajiv Gandhi Salai (OMR) tech belt, favored by software professionals seeking proximity to tech parks.",
    badge: "Tech Corridor"
  }
];

export default function NeighborhoodCards({ onSelectLocality }) {
  const handleSelect = (name) => {
    onSelectLocality(name);
    const el = document.querySelector('#estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="neighborhoods" className="section-spacing" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            <MapPin size={14} />
            <span>Chennai Localities</span>
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Explore Popular Chennai Neighbourhoods
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            The 7 residential corridors actively covered by our machine learning model, analyzed from 7,109 historical property transactions.
          </p>
        </div>

        {/* Locality Grid */}
        <div className="grid-cols-3">
          {LOCALITY_DATA.map((loc) => (
            <div
              key={loc.name}
              className="card-surface card-hover"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy-dark)' }}>{loc.name}</h3>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    {loc.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-terracotta)', marginBottom: '0.75rem' }}>
                  {loc.tagline}
                </div>

                <p style={{ fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>
                  {loc.character}
                </p>

                {/* Key Metrics */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-primary)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ color: 'var(--color-text-light)', display: 'block' }}>Benchmark Range</span>
                    <strong style={{ color: 'var(--color-navy-primary)' }}>{loc.benchmarkRange}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--color-text-light)', display: 'block' }}>Dataset Size</span>
                    <strong style={{ color: 'var(--color-emerald-deep)' }}>{loc.records}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(loc.name)}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem 1rem' }}
              >
                <span>Select for Valuation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
