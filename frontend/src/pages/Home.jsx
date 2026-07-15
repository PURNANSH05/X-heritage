import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sites } from '../data/sites.js';
import SiteCard from '../components/SiteCard.jsx';
import Badge from '../components/Badge.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
 
const features = [
  { title: 'Choose your language', text: 'Pick a language once and keep it across the whole experience.' },
  { title: 'Scan or search', text: 'Use the camera scanner on site or browse destinations from home.' },
  { title: 'Open full details', text: 'Get history, gallery, tips, maps, and routes in one place.' }
];
 
export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };
 
  const featuredIds = [
    'taj-mahal-01',
    'colosseum-35',
    'eiffel-tower-36',
    'great-wall-37',
    'machu-picchu-38',
    'angkor-wat-39'
  ];
  const featuredSites = featuredIds
    .map((id) => sites.find((s) => s.id === id))
    .filter(Boolean);
 
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <SmartImage
            src={sites[0].heroImage}
            fallback={sites[0].heroFallback}
            alt={sites[0].name.en}
            className="hero-media-image"
          />
          <div className="hero-media-overlay" />
        </div>
        <div className="container hero-content">
          <Badge tone="gold">{t('tagline')}</Badge>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          
          <form className="hero-search-form-wrap" onSubmit={handleSearchSubmit} style={{ marginTop: '24px', display: 'flex', gap: '10px', background: '#fff', padding: '6px', borderRadius: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '500px', width: '100%', border: '1px solid rgba(0,0,0,0.08)' }}>
            <input
              type="text"
              placeholder="Search Taj Mahal, Goa, Jaipur, monuments..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 20px', borderRadius: '30px', fontSize: '15px', color: '#151515' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px', padding: '10px 24px', font: 'inherit', fontWeight: 'bold' }}>
              Search
            </button>
          </form>
 
          <div className="hero-actions" style={{ marginTop: '20px' }}>
            <Link className="btn btn-primary" to="/scanner">
              {t('startScanning')}
            </Link>
            <Link className="btn btn-secondary" to="/search">
              {t('browseDestinations')}
            </Link>
          </div>
        </div>
      </section>
 
      <section className="section" style={{ padding: '36px 0 0' }}>
        <div className="container">
          <div className="trip-booking-strip">
            <Link to="/trip-planner" className="trip-booking-strip-btn" style={{ background: 'linear-gradient(135deg, var(--gold), #b3923b)' }}>
              🗺️ AI Trip Planner
            </Link>
            <Link to="/flights" className="trip-booking-strip-btn">
              ✈️ Book Flights
            </Link>
            <Link to="/trains" className="trip-booking-strip-btn">
              🚂 Book Trains
            </Link>
            <Link to="/buses" className="trip-booking-strip-btn">
              🚌 Book Buses
            </Link>
            <Link to="/hotels" className="trip-booking-strip-btn">
              🏨 Book Hotels
            </Link>
            <Link to="/local-transport" className="trip-booking-strip-btn">
              🚗 Cabs & Rentals
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{t('howItWorks')}</h2>
            <p>Simple discovery for travelers, planners, and on-site visitors.</p>
          </div>
          <div className="feature-grid">
            {features.map((item, index) => (
              <article className="feature-card" key={item.title}>
                <div className="feature-number">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>{t('featuredDestinations')}</h2>
            <Link to="/search">View all</Link>
          </div>
          <div className="card-grid">
            {featuredSites.map((site) => (
              <SiteCard key={site.id} site={site} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container scanner-promo">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="mini-scan" />
              <strong>Scan ready</strong>
              <span>Live camera preview</span>
            </div>
          </div>
          <div>
            <h2>{t('scannerPreview')}</h2>
            <ul className="bullet-list">
              <li>Fast recognition with clean fallback search</li>
              <li>Multilingual information layers</li>
              <li>Directions, maps, and visitor guidance in one view</li>
            </ul>
            <Link className="btn btn-primary" to="/scanner">
              Try the Scanner
            </Link>
          </div>
        </div>
      </section>

      {/* ── Security Trust Badges Section ── */}
      <section className="section home-security-strip">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>🔒 Trusted & Secure Platform</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Your bookings and personal data are protected by enterprise-grade security.</p>
          </div>
          <div className="home-trust-grid">
            <div className="home-trust-card">
              <div className="home-trust-icon">🔒</div>
              <strong>256-bit SSL</strong>
              <span>All connections encrypted with TLS 1.3</span>
            </div>
            <div className="home-trust-card">
              <div className="home-trust-icon">💳</div>
              <strong>PCI DSS Certified</strong>
              <span>Bank-grade payment security</span>
            </div>
            <div className="home-trust-card">
              <div className="home-trust-icon">🛡️</div>
              <strong>AES-256 Encrypted</strong>
              <span>Your data encrypted at rest</span>
            </div>
            <div className="home-trust-card">
              <div className="home-trust-icon">📋</div>
              <strong>GDPR Compliant</strong>
              <span>Full data rights & privacy</span>
            </div>
            <div className="home-trust-card">
              <div className="home-trust-icon">🔍</div>
              <strong>Regularly Audited</strong>
              <span>Penetration tested & OWASP aligned</span>
            </div>
            <div className="home-trust-card">
              <div className="home-trust-icon">🚫</div>
              <strong>Zero Data Selling</strong>
              <span>Your data is never sold</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/security" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              🛡️ View Full Security Details
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container stats-grid">
          <div><strong>20+</strong><span>Sites listed</span></div>
          <div><strong>16</strong><span>Languages supported</span></div>
          <div><strong>50+</strong><span>Countries covered</span></div>
          <div><strong>24/7</strong><span>Accessible discovery</span></div>
        </div>
      </section>
    </>
  );
}
