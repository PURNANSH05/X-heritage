import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, CarFront, Hotel, Map, Plane, Train, ChevronLeft, ChevronRight, LockKeyhole, CreditCard, ShieldCheck, ClipboardCheck, SearchCheck, CircleSlash2, Shield } from 'lucide-react';
import { sites, countries, languageChoices } from '../data/sites.js';
import SiteCard from '../components/SiteCard.jsx';
import Badge from '../components/Badge.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
 
const features = [
  { title: 'Choose your language', text: 'Pick a language once and keep it across the whole experience.' },
  { title: 'Scan or search', text: 'Use the camera scanner on site or browse destinations from home.' },
  { title: 'Open full details', text: 'Get history, gallery, tips, maps, and routes in one place.' }
];

const trustFeatures = [
  { title: '256-bit SSL', text: 'All connections encrypted with TLS 1.3', icon: LockKeyhole },
  { title: 'PCI DSS Certified', text: 'Bank-grade payment security', icon: CreditCard },
  { title: 'AES-256 Encrypted', text: 'Your data encrypted at rest', icon: ShieldCheck },
  { title: 'GDPR Compliant', text: 'Full data rights & privacy', icon: ClipboardCheck },
  { title: 'Regularly Audited', text: 'Penetration tested & OWASP aligned', icon: SearchCheck },
  { title: 'Zero Data Selling', text: 'Your data is never sold', icon: CircleSlash2 }
];
 
export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };
 
  const featuredIds = [
    'taj-mahal-01',
    'golden-temple-43',
    'hampi-44',
    'ajanta-caves-45',
    'konark-sun-temple-47',
    'colosseum-35',
    'victoria-memorial-51',
    'india-gate-52'
  ];
  const featuredSites = featuredIds
    .map((id) => sites.find((s) => s.id === id))
    .filter(Boolean);
  const activeHeroSite = featuredSites[heroIndex] || sites[0];

  useEffect(() => {
    if (heroPaused || featuredSites.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % featuredSites.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [featuredSites.length, heroPaused]);

  const showPreviousHero = () => {
    setHeroIndex((current) => (current + featuredSites.length - 1) % featuredSites.length);
  };

  const showNextHero = () => {
    setHeroIndex((current) => (current + 1) % featuredSites.length);
  };

  const travelLinks = [
    { to: '/trip-planner', label: 'AI Trip Planner', icon: Map },
    { to: '/flights', label: 'Book Flights', icon: Plane },
    { to: '/trains', label: 'Book Trains', icon: Train },
    { to: '/buses', label: 'Book Buses', icon: Bus },
    { to: '/hotels', label: 'Book Hotels', icon: Hotel },
    { to: '/local-transport', label: 'Cabs & Rentals', icon: CarFront },
  ];
 
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <SmartImage
            key={activeHeroSite?.id}
            src={activeHeroSite?.heroImage}
            fallback={activeHeroSite?.heroFallback || activeHeroSite?.photos?.[0]?.url || activeHeroSite?.photos?.[0]}
            alt={activeHeroSite?.name?.en || 'Heritage destination'}
            className="hero-media-image"
            loading="eager"
            site={activeHeroSite}
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
        {featuredSites.length > 1 && (
          <div
            className="hero-carousel-controls"
            role="region"
            aria-label="Featured heritage destinations"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
            onFocusCapture={() => setHeroPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false);
            }}
          >
            <div className="hero-carousel-caption">
              <strong>{activeHeroSite?.name?.en}</strong>
              <span>{[activeHeroSite?.city, activeHeroSite?.country].filter(Boolean).join(', ')}</span>
            </div>
            <div className="hero-carousel-actions">
              <button type="button" className="hero-carousel-arrow" onClick={showPreviousHero} aria-label="Previous destination">
                <ChevronLeft size={19} />
              </button>
              <div className="hero-carousel-dots" aria-label="Choose a destination">
                {featuredSites.map((site, index) => (
                  <button
                    key={site.id}
                    type="button"
                    className={`hero-carousel-dot ${index === heroIndex ? 'active' : ''}`}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Show ${site.name.en}`}
                    aria-pressed={index === heroIndex}
                  />
                ))}
              </div>
              <button type="button" className="hero-carousel-arrow" onClick={showNextHero} aria-label="Next destination">
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        )}
      </section>
 
      <section className="section" style={{ padding: '36px 0 0' }}>
        <div className="container">
          <div className="trip-booking-strip">
            {travelLinks.map(({ to, label, icon: Icon }, index) => (
              <Link
                key={to}
                to={to}
                className="trip-booking-strip-btn"
                style={index === 0 ? { background: 'linear-gradient(135deg, var(--gold), #b3923b)' } : undefined}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                {label}
              </Link>
            ))}
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
            <h2 className="home-trust-heading"><LockKeyhole size={21} strokeWidth={2.2} aria-hidden="true" /> Trusted & Secure Platform</h2>
            <p className="home-trust-intro">Your bookings and personal data are protected by enterprise-grade security.</p>
          </div>
          <div className="home-trust-grid">
            {trustFeatures.map(({ title, text, icon: Icon }) => (
              <article className="home-trust-card" key={title}>
                <div className="home-trust-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></div>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/security" className="btn btn-secondary home-trust-link">
              <Shield size={17} strokeWidth={1.9} aria-hidden="true" /> View Full Security Details
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container stats-grid">
          <div><strong>{sites.length}</strong><span>Curated destinations</span></div>
          <div><strong>{countries.length}</strong><span>Countries represented</span></div>
          <div><strong>{languageChoices.length}</strong><span>Interface languages</span></div>
          <div><strong>Live</strong><span>Additional place search</span></div>
        </div>
      </section>
    </>
  );
}
