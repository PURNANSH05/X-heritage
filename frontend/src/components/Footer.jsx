import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Trust Badges Strip */}
      <div className="footer-trust-strip">
        <div className="container">
          <div className="footer-trust-badges">
            <div className="footer-trust-badge">
              <span>🔒</span>
              <div>
                <strong>SSL Secured</strong>
                <span>256-bit TLS 1.3</span>
              </div>
            </div>
            <div className="footer-trust-badge">
              <span>💳</span>
              <div>
                <strong>PCI DSS</strong>
                <span>Payment Certified</span>
              </div>
            </div>
            <div className="footer-trust-badge">
              <span>🛡️</span>
              <div>
                <strong>Data Encrypted</strong>
                <span>AES-256 at rest</span>
              </div>
            </div>
            <div className="footer-trust-badge">
              <span>📋</span>
              <div>
                <strong>GDPR Compliant</strong>
                <span>Your data protected</span>
              </div>
            </div>
            <div className="footer-trust-badge">
              <span>🔍</span>
              <div>
                <strong>Audited</strong>
                <span>Regular pen-tests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container footer-grid">
        <div>
          <img src="/logo.svg" alt="HeritageX" className="footer-logo" />
          <p className="muted">Discover, book, and explore heritage sites worldwide. Secure, trusted, and built for real travellers.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <span className="footer-mini-badge">🔒 SSL Secured</span>
            <span className="footer-mini-badge">✅ Trusted Platform</span>
          </div>
        </div>

        <div>
          <h3>Explore</h3>
          <Link to="/search">Search Sites</Link>
          <Link to="/scanner">AR Scanner</Link>
          <Link to="/favorites">Saved Places</Link>
          <Link to="/trip-planner">AI Trip Planner</Link>
        </div>

        <div>
          <h3>Book Travel</h3>
          <Link to="/flights">✈️ Flights</Link>
          <Link to="/trains">🚂 Trains</Link>
          <Link to="/hotels">🏨 Hotels</Link>
          <Link to="/buses">🚌 Buses</Link>
          <Link to="/local-transport">🚗 Cabs</Link>
        </div>

        <div>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/security">🛡️ Security</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/languages">Languages</Link>
        </div>

        <div>
          <h3>Support</h3>
          <a href="mailto:support@heritagex.com">support@heritagex.com</a>
          <a href="tel:18004029000">1800-402-900 (Toll Free)</a>
          <a href="mailto:security@heritagex.com">🔒 security@heritagex.com</a>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">Find on Maps</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 HeritageX Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/security">🛡️ Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
