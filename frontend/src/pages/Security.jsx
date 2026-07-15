/* Security.jsx — HeritageX Security & Trust Center */
import { Link } from 'react-router-dom';

const SECURITY_FEATURES = [
  {
    icon: '🔒',
    title: '256-bit SSL/TLS Encryption',
    subtitle: 'Bank-grade data protection',
    desc: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3 — the same standard used by global banks and financial institutions. Your personal information, payment details, and booking data are fully protected in transit.',
    badge: 'HTTPS Secured',
    badgeColor: '#22c55e',
  },
  {
    icon: '💳',
    title: 'PCI DSS Compliant Payments',
    subtitle: 'Payment Card Industry certified',
    desc: 'HeritageX payment processing is PCI DSS Level 1 compliant — the highest level in the payment industry. We never store raw card numbers on our servers. All card data is tokenised through our payment gateway partners (Razorpay, Stripe).',
    badge: 'PCI DSS Level 1',
    badgeColor: '#3b82f6',
  },
  {
    icon: '🛡️',
    title: 'End-to-End Data Encryption',
    subtitle: 'Your data is encrypted at rest',
    desc: 'Sensitive user data — including passwords (bcrypt hashed with salt), personal details, and booking records — is encrypted at rest using AES-256. Even if our servers were ever compromised, your raw data remains unreadable.',
    badge: 'AES-256 Encrypted',
    badgeColor: '#8b5cf6',
  },
  {
    icon: '🔐',
    title: 'Secure Authentication',
    subtitle: 'Multi-layer account protection',
    desc: 'User passwords are never stored in plain text. We use bcrypt with per-user salt rounds. Session tokens are JWT-based with short expiry windows, and all sensitive actions require re-authentication. Login attempts are rate-limited to prevent brute-force attacks.',
    badge: 'JWT + bcrypt',
    badgeColor: '#f59e0b',
  },
  {
    icon: '🗄️',
    title: 'Secure Data Storage',
    subtitle: 'Redundant & backed-up infrastructure',
    desc: 'Your booking data, e-tickets, and personal information are stored in encrypted databases with automatic daily backups. Data is replicated across multiple availability zones to ensure it is never lost. Backups are retained for 30 days.',
    badge: 'Daily Backups',
    badgeColor: '#14b8a6',
  },
  {
    icon: '🕵️',
    title: 'Zero Data Selling Policy',
    subtitle: 'Your data belongs to you',
    desc: 'HeritageX strictly prohibits selling, renting, or trading personal user data to any third party. We collect only what is necessary to provide you the service. You can request complete deletion of your account and data at any time.',
    badge: 'No Data Selling',
    badgeColor: '#ef4444',
  },
  {
    icon: '🔍',
    title: 'Regular Security Audits',
    subtitle: 'Proactive vulnerability management',
    desc: 'Our platform undergoes scheduled penetration testing and vulnerability assessments. We follow OWASP Top 10 security guidelines. Our security team monitors for unusual access patterns 24/7 and responds to incidents within 4 hours.',
    badge: 'OWASP Compliant',
    badgeColor: '#0d7377',
  },
  {
    icon: '📋',
    title: 'GDPR & Data Privacy Compliance',
    subtitle: 'Global privacy standards',
    desc: 'We comply with GDPR (EU), IT Act 2000 (India), and applicable data privacy regulations. You have the right to access, correct, or delete your personal data. All data processing activities are documented and lawful.',
    badge: 'GDPR Compliant',
    badgeColor: '#6366f1',
  },
];

const TRUST_STATS = [
  { value: '100%', label: 'Encrypted connections' },
  { value: '256-bit', label: 'SSL encryption strength' },
  { value: '0', label: 'Data breaches ever' },
  { value: '24/7', label: 'Security monitoring' },
];

export default function Security() {
  return (
    <div className="security-page">

      {/* Hero Banner */}
      <div className="security-hero">
        <div className="container">
          <div className="security-hero-badge">
            <span>🔒</span> Trust & Security Center
          </div>
          <h1>Your Security is Our<br /><span style={{ color: '#c9a84c' }}>Top Priority</span></h1>
          <p className="security-hero-sub">
            HeritageX uses enterprise-grade security to protect every booking, payment,
            and personal detail you share with us. Here's exactly how we keep you safe.
          </p>

          {/* Live security indicator */}
          <div className="security-live-indicator">
            <span className="security-live-dot" />
            <span>All systems secure · TLS 1.3 active · Last audited: June 2026</span>
          </div>
        </div>
      </div>

      {/* Trust Stats */}
      <div className="security-stats-strip">
        <div className="container">
          <div className="security-stats-grid">
            {TRUST_STATS.map(s => (
              <div key={s.label} className="security-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>
              🛡️ How We Protect You
            </h2>
            <p style={{ color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Every layer of HeritageX is built with security-first principles. Here's a full breakdown of our protections.
            </p>
          </div>

          <div className="security-features-grid">
            {SECURITY_FEATURES.map(f => (
              <div key={f.title} className="security-feature-card">
                <div className="sec-icon">{f.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h3 className="sec-title">{f.title}</h3>
                    <span className="sec-badge" style={{ background: f.badgeColor + '15', color: f.badgeColor, border: `1.5px solid ${f.badgeColor}30` }}>
                      {f.badge}
                    </span>
                  </div>
                  <div className="sec-subtitle">{f.subtitle}</div>
                  <p className="sec-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secure Payment Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="security-payment-block">
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>💳 100% Secure Payments</h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
                When you pay on HeritageX, your card or UPI details are processed through encrypted payment gateways.
                We <strong>never see or store</strong> your raw card numbers. Every transaction is verified with
                3D Secure (OTP) authentication. You are always protected.
              </p>
              <div className="security-payment-badges">
                <div className="sec-pay-badge">💳 Visa / Mastercard</div>
                <div className="sec-pay-badge">📲 UPI / GPay / PhonePe</div>
                <div className="sec-pay-badge">🏦 Net Banking</div>
                <div className="sec-pay-badge">🔐 3D Secure OTP</div>
                <div className="sec-pay-badge">♻️ Instant Refunds</div>
              </div>
            </div>
            <div className="security-shield-graphic">
              <div className="shield-outer">
                <div className="shield-inner">
                  <span>🔒</span>
                  <strong>100%</strong>
                  <span style={{ fontSize: 11 }}>SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Rights */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, marginBottom: 36 }}>
            📋 Your Data Rights
          </h2>
          <div className="security-rights-grid">
            {[
              { icon: '👁️', right: 'Right to Access', desc: 'Request a full copy of all personal data we hold about you at any time.' },
              { icon: '✏️', right: 'Right to Correct', desc: 'Update or correct any inaccurate personal information in your account.' },
              { icon: '🗑️', right: 'Right to Delete', desc: 'Request permanent deletion of your account and all associated data.' },
              { icon: '📦', right: 'Right to Portability', desc: 'Download all your data in a machine-readable format (JSON/PDF).' },
              { icon: '🚫', right: 'Right to Object', desc: 'Opt out of any non-essential data processing at any time.' },
              { icon: '📧', right: 'Contact DPO', desc: 'Reach our Data Protection Officer at privacy@heritagex.com for any queries.' },
            ].map(r => (
              <div key={r.right} className="security-right-card">
                <span style={{ fontSize: 28 }}>{r.icon}</span>
                <strong>{r.right}</strong>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report a Security Issue */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>🚨 Report a Security Concern</h2>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
            Found a vulnerability or something suspicious? We take every report seriously and respond within 24 hours.
            Responsible disclosure helps us protect all our users.
          </p>
          <a
            href="mailto:security@heritagex.com"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            📧 security@heritagex.com
          </a>
          <p style={{ marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
            We follow a responsible disclosure policy. Valid reports are acknowledged within 24 hours.
          </p>
        </div>
      </section>

      {/* Bottom Links */}
      <div style={{ background: '#0d7377', padding: '28px 20px', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', fontSize: 14 }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="mailto:security@heritagex.com" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Security Contact</a>
          <Link to="/" style={{ color: '#c9a84c', fontWeight: 700, textDecoration: 'none' }}>← Back to HeritageX</Link>
        </div>
        <p style={{ margin: '16px 0 0', fontSize: 12, opacity: 0.6 }}>
          © 2026 HeritageX · ISO 27001 aligned · PCI DSS compliant · GDPR compliant
        </p>
      </div>
    </div>
  );
}
