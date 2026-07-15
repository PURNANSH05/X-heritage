import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import SmartImage from './SmartImage.jsx';

function formatEntryFee(entryFee) {
  if (!entryFee) return 'Entry info unavailable';
  if (typeof entryFee === 'string') return entryFee;

  const values = Object.values(entryFee).filter(Boolean);
  if (!values.length) return 'Entry info unavailable';
  if (entryFee.free) return 'Free entry';
  return values.join(' | ');
}

function getHeroImage(site) {
  return site.heroImage || site.photos?.[0]?.url || site.photos?.[0] || null;
}

function getHeroFallback(site) {
  return site.heroFallback || site.photos?.[0]?.fallback || site.photos?.[0] || null;
}

function getAudioCount(site) {
  if (Array.isArray(site.audioGuideLanguages)) return site.audioGuideLanguages.length;
  if (Array.isArray(site.audioGuides)) return site.audioGuides.length;
  return null;
}

export default function SearchResultCard({ site, featured = false }) {
  const heroImage = getHeroImage(site);
  const heroFallback = getHeroFallback(site);
  const audioCount = getAudioCount(site);
  const reviewCount = site.reviewCount || site.reviews?.length || 0;
  const entryFee = formatEntryFee(site.entryFee);
  const mapLabel = site.city && site.country ? `${site.city}, ${site.country}` : site.country || site.city;
  const isExternal = site.source === 'wikipedia';
  const primaryLabel = 'View details';
  const primaryHref = `/site/${site.id}`;
  const summary = site.description?.en || site.description || site.visitMessage?.en || site.visitMessage || site.summary || 'No description available yet.';

  return (
    <article className={`search-result-card ${featured ? 'search-result-card-featured' : ''}`}>
      <div className="search-result-media">
        <SmartImage src={heroImage} fallback={heroFallback} alt={site.name?.en || 'Destination'} className="search-result-media-image" />
        <div className="search-result-media-overlay" />
        <div className="search-result-badges">
          <Badge tone="gold">{site.category}</Badge>
          {isExternal ? (
            <Badge tone="teal">Live web result</Badge>
          ) : (
            site.country && <Badge tone="teal">{site.country}</Badge>
          )}
        </div>
      </div>

      <div className="search-result-body">
        <div className="search-result-title">
          <div>
            <h3>{site.name?.en || 'Untitled place'}</h3>
            <p>{site.locationLabel || mapLabel || (isExternal ? 'Wikipedia result' : 'Location unavailable')}</p>
          </div>
          <div className="search-result-rating">
            <strong>{site.rating ? site.rating.toFixed(1) : '0.0'}</strong>
            <span>{reviewCount} reviews</span>
          </div>
        </div>

        <p className="search-result-summary">
          {summary}
        </p>

        <div className="search-facts">
          {site.openingHours && (
            <div>
              <span>Hours</span>
              <strong>{site.openingHours}</strong>
            </div>
          )}
          <div>
            <span>Entry</span>
            <strong>{entryFee}</strong>
          </div>
          {site.bestTimeToVisit && (
            <div>
              <span>Best time</span>
              <strong>{site.bestTimeToVisit}</strong>
            </div>
          )}
          {audioCount !== null && (
            <div>
              <span>Guides</span>
              <strong>{audioCount} languages</strong>
            </div>
          )}
        </div>

        {site.estimatedDuration && (
          <p className="search-result-note">
            Suggested visit time: {site.estimatedDuration}
          </p>
        )}

        <div className="search-result-actions">
          <Link className="btn btn-primary" to={primaryHref}>
            {primaryLabel}
          </Link>
          {site.googleMapsLink && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.open(site.googleMapsLink, '_blank', 'noopener,noreferrer')}
            >
              Open maps
            </button>
          )}
          {isExternal && site.wikipediaUrl && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.open(site.wikipediaUrl, '_blank', 'noopener,noreferrer')}
            >
              Wikipedia
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
