import React from 'react';
import { User, Phone, Mail, GraduationCap, ArrowUpRight } from 'lucide-react';

// ============================================================================
// DEVELOPER PROFILE CONFIGURATION
// Update your contact number or other personal details directly below:
// ============================================================================
export const DEVELOPER_CONFIG = {
  name: "Abhay Mutha",
  role: "CSE Student",
  institution: "VIT Chennai",
  email: "abhaymutha17@gmail.com",
  phone: "+91 98765 43210", // <--- EDIT YOUR CONTACT NUMBER HERE
};

export default function DeveloperProfile() {
  const cleanPhoneLink = `tel:${DEVELOPER_CONFIG.phone.replace(/[\s()-]/g, '')}`;
  const mailLink = `mailto:${DEVELOPER_CONFIG.email}`;

  return (
    <section
      id="developer"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}
    >
      <div className="container" style={{ maxWidth: '900px' }}>
        <div
          className="card-surface"
          style={{
            padding: 'clamp(2rem, 5vw, 3rem)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1.5px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: 'var(--color-navy-primary)'
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Section Tag */}
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-navy">
                <User size={13} />
                <span>Project Developer</span>
              </span>
            </div>

            {/* Prominent Name */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--color-navy-dark)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.03em'
              }}
            >
              {DEVELOPER_CONFIG.name}
            </h2>

            {/* Role and Institution */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--color-emerald-deep)',
                marginBottom: '1.75rem'
              }}
            >
              <GraduationCap size={20} />
              <span>
                {DEVELOPER_CONFIG.role} at {DEVELOPER_CONFIG.institution}
              </span>
            </div>

            {/* Brief Project Role Statement */}
            <p
              style={{
                maxWidth: '600px',
                fontSize: '0.925rem',
                lineHeight: 1.6,
                color: 'var(--color-text-muted)',
                marginBottom: '2rem'
              }}
            >
              Designed and built ChennaiNest as a complete full-stack real-estate valuation engine, integrating Machine Learning modeling, FastAPI REST APIs, and modern responsive React interface.
            </p>

            {/* Interactive Contact Links */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              {/* Clickable Phone Number */}
              <a
                href={cleanPhoneLink}
                className="btn btn-secondary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.925rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--color-border-subtle)',
                  backgroundColor: '#ffffff'
                }}
                title={`Call ${DEVELOPER_CONFIG.name} at ${DEVELOPER_CONFIG.phone}`}
              >
                <Phone size={16} color="var(--color-emerald-primary)" />
                <span style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>
                  {DEVELOPER_CONFIG.phone}
                </span>
                <ArrowUpRight size={14} color="var(--color-text-light)" />
              </a>

              {/* Clickable Email */}
              <a
                href={mailLink}
                className="btn btn-secondary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.925rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--color-border-subtle)',
                  backgroundColor: '#ffffff'
                }}
                title={`Email ${DEVELOPER_CONFIG.name}`}
              >
                <Mail size={16} color="var(--color-navy-primary)" />
                <span style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>
                  {DEVELOPER_CONFIG.email}
                </span>
                <ArrowUpRight size={14} color="var(--color-text-light)" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
