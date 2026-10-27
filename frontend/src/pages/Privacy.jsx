/* Privacy.jsx — HeritageX Privacy Policy */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Privacy() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ color: '#0d7377', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>← Back to HeritageX</Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 48px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <Icon name="lock" size={34} />
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Privacy Policy</h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Last updated: June 28, 2026</p>
            </div>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 32 }}>
            HeritageX ("we", "us", "our") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights regarding your personal information.
          </p>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect the following types of information:

• **Account Information**: Name, email address, password (stored as a bcrypt hash — never in plain text).
• **Booking Details**: Flight/train/hotel/bus bookings, travel dates, passenger counts, and payment confirmation references.
• **Payment Information**: We store only the last 4 digits and card type for display. Raw card numbers and CVVs are never stored on our servers — they are handled exclusively by our PCI DSS certified payment gateway.
• **Usage Data**: Pages visited, search queries, and feature interactions to improve the platform.
• **Device Information**: Browser type, operating system, and IP address for security monitoring.`,
            },
            {
              title: '2. How We Use Your Data',
              content: `Your data is used exclusively to:
• Process and manage your bookings and e-tickets
• Send booking confirmation emails with PDF tickets
• Provide customer support and respond to inquiries
• Improve platform features and user experience
• Detect and prevent fraudulent activity
• Comply with legal obligations

We do NOT use your data for advertising or sell it to third parties under any circumstances.`,
            },
            {
              title: '3. Data Sharing',
              content: `We share data only when strictly necessary:
• **Travel Partners**: Booking reference numbers are shared with airlines, hotels, and transport operators to fulfil your reservation.
• **Payment Gateways**: Payment data is processed by Razorpay/Stripe under their own PCI DSS compliance.
• **Legal Requirements**: We may disclose data if required by court order or applicable law.

We never sell, rent, or trade your personal data.`,
            },
            {
              title: '4. Data Retention',
              content: `• Active account data is retained as long as your account is active.
• Booking records are retained for 7 years as required by Indian GST regulations.
• Upon account deletion, personal data is permanently erased within 30 days, except where legal retention is required.
• Anonymised, aggregated analytics data may be retained indefinitely.`,
            },
            {
              title: '5. Cookies',
              content: `We use essential cookies only:
• **Session cookies**: To keep you logged in during your visit.
• **Preference cookies**: To remember your language and theme settings.
• **Security cookies**: CSRF tokens to protect form submissions.

We do not use advertising, tracking, or third-party marketing cookies.`,
            },
            {
              title: '6. Your Rights',
              content: `You have the right to:
• **Access** all personal data we hold about you
• **Correct** any inaccurate information
• **Delete** your account and all associated data
• **Export** your data in JSON or PDF format
• **Object** to any processing beyond essential service delivery
• **Lodge a complaint** with your national data protection authority

To exercise any right, contact: privacy@heritagex.com`,
            },
            {
              title: '7. Security',
              content: `We implement the following security measures:
• TLS 1.3 encryption for all data in transit
• AES-256 encryption for sensitive data at rest
• bcrypt password hashing with per-user salts
• JWT session tokens with short expiry periods
• Rate limiting and IP-based brute-force protection
• Regular penetration testing and security audits

See our full Security Center for details.`,
            },
            {
              title: '8. Contact',
              content: `For privacy-related inquiries:
• Email: privacy@heritagex.com
• Data Protection Officer: dpo@heritagex.com
• Address: HeritageX Technologies Pvt. Ltd., India

We respond to all privacy requests within 7 business days.`,
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d7377', marginBottom: 12 }}>{section.title}</h2>
              <div style={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: 14 }}>
                {section.content.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/security" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="shield" size={15} /> Security Center</Link>
            <Link to="/terms" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="document" size={15} /> Terms of Service</Link>
            <a href="mailto:privacy@heritagex.com" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="mail" size={15} /> Contact DPO</a>
          </div>
        </div>
      </div>
    </div>
  );
}
