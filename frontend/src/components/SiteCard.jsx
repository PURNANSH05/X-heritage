import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import SmartImage from './SmartImage.jsx';

export default function SiteCard({ site, featured = false }) {
  const heroImage = site.heroImage || site.photos?.[0]?.url || site.photos?.[0] || '';
  const heroFallback = site.heroFallback || site.photos?.[0]?.fallback || site.photos?.[0] || '';
  return (
    <article className={`site-card ${featured ? 'site-card-featured' : ''}`}>
      <div className="site-card-media">
        <SmartImage src={heroImage} fallback={heroFallback} alt={site.name.en} className="site-card-media-image" />
        <div className="site-card-media-overlay" />
        <Badge tone="gold">{site.category}</Badge>
      </div>
      <div className="site-card-body">
        <div className="site-card-meta">
          <strong>{site.name.en}</strong>
          <span>
            {site.city}, {site.country}
          </span>
        </div>
        <p>{site.description.en}</p>
        <div className="site-card-actions">
          <Link className="btn btn-small btn-primary" to={`/site/${site.id}`}>
            View Details
          </Link>
          <span className="rating">★ {site.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}
