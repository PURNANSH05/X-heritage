import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sites } from '../data/sites.js';
import { readFavorites, toggleFavorite } from '../utils/favorites.js';
import { generateFavoritesPDF } from '../utils/generateFavoritesPDF.js';
import { useAuth } from '../context/AuthContext.jsx';
import SmartImage from '../components/SmartImage.jsx';

/* ── Share modal ── */
function ShareModal({ onClose, favorites }) {
  const [copied, setCopied]   = useState(false);
  const [shared, setShared]   = useState(false);
  const shareText = `Check out my Heritage Collection on HeritageX! I've saved ${favorites.length} incredible heritage site${favorites.length !== 1 ? 's' : ''}: ${favorites.slice(0, 3).map(s => s.name.en).join(', ')}${favorites.length > 3 ? '…' : ''}. Explore history at heritagex.app`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My HeritageX Heritage Collection',
          text: shareText,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(onClose, 1200);
      } catch { /* user cancelled */ }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const SHARE_LINKS = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: '✉️',
      color: '#0d7377',
      url: `mailto:?subject=My%20HeritageX%20Collection&body=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Twitter / X',
      icon: '𝕏',
      color: '#000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Facebook',
      icon: 'f',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className="fav-modal-backdrop" onClick={onClose}>
      <div className="fav-modal" onClick={e => e.stopPropagation()}>
        <div className="fav-modal-header">
          <h3>Share My Collection</h3>
          <button type="button" className="fav-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="fav-modal-preview">
          <div className="fav-modal-preview-icon">🏛️</div>
          <div>
            <strong>My Heritage Collection</strong>
            <span>{favorites.length} heritage site{favorites.length !== 1 ? 's' : ''} saved</span>
          </div>
        </div>

        <div className="fav-modal-body">
          {/* Native share if supported */}
          {navigator.share && (
            <button type="button" className="fav-share-native" onClick={handleNativeShare}>
              {shared ? '✓ Shared!' : '📤 Share via your device'}
            </button>
          )}

          {/* Social links */}
          <div className="fav-share-grid">
            {SHARE_LINKS.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fav-share-link"
                style={{ '--share-color': link.color }}
              >
                <span className="fav-share-link-icon">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <div className="fav-copy-row">
            <span className="fav-copy-text">{shareText.slice(0, 70)}…</span>
            <button type="button" className="fav-copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function Favorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(readFavorites());
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [pdfDone,     setPdfDone]     = useState(false);
  const [showShare,   setShowShare]   = useState(false);
  const [filter,      setFilter]      = useState('all');
  const [view,        setView]        = useState('grid');  // grid | list

  const favorites = sites.filter(s => favoriteIds.includes(s.id));

  // Categories for filter
  const categories = [...new Set(favorites.map(s => s.category).filter(Boolean))];

  const filtered = filter === 'all'
    ? favorites
    : favorites.filter(s => s.category === filter);

  const handleDownloadPDF = useCallback(async () => {
    if (favorites.length === 0) return;
    setPdfLoading(true);
    setPdfDone(false);
    try {
      await generateFavoritesPDF(favorites, user?.name || '');
      setPdfDone(true);
      setTimeout(() => setPdfDone(false), 3000);
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, [favorites, user]);

  return (
    <div className="fav-root">
      {/* ── Page hero ── */}
      <div className="fav-hero">
        <div className="fav-hero-glow" />
        <div className="container fav-hero-inner">
          <div className="fav-hero-left">
            <div className="fav-hero-badge">❤️ My Collection</div>
            <h1 className="fav-hero-title">Heritage Favourites</h1>
            <p className="fav-hero-sub">
              Your curated selection of world heritage destinations.
              {favorites.length > 0 && ` ${favorites.length} site${favorites.length > 1 ? 's' : ''} saved.`}
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="fav-hero-actions">
              {/* Download PDF */}
              <button
                type="button"
                className={`fav-pdf-btn ${pdfDone ? 'fav-pdf-btn-done' : ''}`}
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <><span className="fav-btn-spinner" /> Generating PDF…</>
                ) : pdfDone ? (
                  <>✓ Downloaded!</>
                ) : (
                  <>📄 Download PDF</>
                )}
              </button>

              {/* Share */}
              <button
                type="button"
                className="fav-share-btn"
                onClick={() => setShowShare(true)}
              >
                🔗 Share
              </button>

              {/* Add more */}
              <Link to="/search" className="fav-add-btn">
                + Add More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats bar ── */}
      {favorites.length > 0 && (
        <div className="container">
          <div className="fav-stats-bar">
            <div className="fav-stat">
              <strong>{favorites.length}</strong>
              <span>Sites Saved</span>
            </div>
            <div className="fav-stat-divider" />
            <div className="fav-stat">
              <strong>{new Set(favorites.map(s => s.country)).size}</strong>
              <span>Countries</span>
            </div>
            <div className="fav-stat-divider" />
            <div className="fav-stat">
              <strong>{new Set(favorites.map(s => s.category)).size}</strong>
              <span>Categories</span>
            </div>
            <div className="fav-stat-divider" />
            <div className="fav-stat">
              <strong>{favorites.filter(s => s.rating >= 4.5).length}</strong>
              <span>Top-Rated</span>
            </div>

            {/* View toggle */}
            <div className="fav-view-toggle">
              <button
                type="button"
                className={`fav-view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >⊞</button>
              <button
                type="button"
                className={`fav-view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >☰</button>
            </div>
          </div>

          {/* Category filters */}
          {categories.length > 1 && (
            <div className="fav-filters">
              <button
                type="button"
                className={`fav-filter-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >All</button>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`fav-filter-chip ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Content ── */}
      <div className="container fav-content">
        {filtered.length === 0 && favorites.length > 0 ? (
          <div className="fav-empty">
            <div className="fav-empty-icon">🔍</div>
            <h3>No sites in this category</h3>
            <button type="button" className="fav-filter-chip active" onClick={() => setFilter('all')}>
              Show all {favorites.length} sites
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-empty-icon">🏛️</div>
            <h3>Your collection is empty</h3>
            <p>Start exploring and save sites you love to build your personal heritage collection.</p>
            <Link to="/search" className="fav-pdf-btn" style={{ textDecoration: 'none', width: 'fit-content' }}>
              Explore Heritage Sites
            </Link>
          </div>
        ) : view === 'grid' ? (
          <div className="fav-grid">
            {filtered.map(site => (
              <FavCard
                key={site.id}
                site={site}
                onRemove={() => setFavoriteIds(toggleFavorite(site.id))}
              />
            ))}
          </div>
        ) : (
          <div className="fav-list">
            {filtered.map(site => (
              <FavListRow
                key={site.id}
                site={site}
                onRemove={() => setFavoriteIds(toggleFavorite(site.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* PDF info bar */}
      {favorites.length > 0 && (
        <div className="container">
          <div className="fav-pdf-info">
            <span className="fav-pdf-info-icon">📄</span>
            <div>
              <strong>Download your collection as a PDF</strong>
              <span>A beautifully designed PDF with images, descriptions, tips, and ratings for all your saved sites.</span>
            </div>
            <button
              type="button"
              className="fav-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              style={{ flexShrink: 0 }}
            >
              {pdfLoading ? 'Generating…' : pdfDone ? '✓ Downloaded!' : '📄 Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <ShareModal
          onClose={() => setShowShare(false)}
          favorites={favorites}
        />
      )}
    </div>
  );
}

/* ── Grid card ── */
function FavCard({ site, onRemove }) {
  const [removed, setRemoved] = useState(false);

  const handleRemove = () => {
    setRemoved(true);
    setTimeout(onRemove, 260);
  };

  return (
    <article className={`fav-card ${removed ? 'fav-card-out' : ''}`}>
      <div className="fav-card-media">
        <SmartImage
          src={site.heroImage}
          fallback={site.heroFallback || site.photos?.[0]?.fallback || site.photos?.[0]}
          alt={site.name.en}
          className="fav-card-img"
        />
        <div className="fav-card-img-overlay" />
        {site.category && <span className="fav-card-category">{site.category}</span>}
        {site.rating && (
          <span className="fav-card-rating">★ {site.rating.toFixed(1)}</span>
        )}
      </div>
      <div className="fav-card-body">
        <h3 className="fav-card-name">{site.name.en}</h3>
        <p className="fav-card-loc">📍 {site.city}, {site.country}</p>
        <p className="fav-card-desc">{site.description?.en?.slice(0, 120)}…</p>
        {(site.estimatedDuration || site.bestTimeToVisit) && (
          <div className="fav-card-chips">
            {site.estimatedDuration && <span>⏱ {site.estimatedDuration}</span>}
            {site.bestTimeToVisit && <span>🗓 {site.bestTimeToVisit.slice(0, 18)}</span>}
          </div>
        )}
        <div className="fav-card-actions">
          <Link to={`/site/${site.id}`} className="fav-card-btn-primary">
            View Details
          </Link>
          <button type="button" className="fav-card-btn-remove" onClick={handleRemove}>
            ✕ Remove
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── List row ── */
function FavListRow({ site, onRemove }) {
  return (
    <div className="fav-row">
      <div className="fav-row-media">
        <SmartImage
          src={site.heroImage}
          fallback={site.heroFallback}
          alt={site.name.en}
          className="fav-row-img"
        />
      </div>
      <div className="fav-row-body">
        <div className="fav-row-top">
          <div>
            <h3 className="fav-row-name">{site.name.en}</h3>
            <p className="fav-card-loc">📍 {site.city}, {site.country}
              {site.category && <> · <span className="fav-row-cat">{site.category}</span></>}
              {site.rating   && <> · <span className="fav-row-star">★ {site.rating.toFixed(1)}</span></>}
            </p>
          </div>
          <div className="fav-row-actions">
            <Link to={`/site/${site.id}`} className="fav-card-btn-primary">
              View
            </Link>
            <button type="button" className="fav-card-btn-remove" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
        <p className="fav-card-desc">{site.description?.en?.slice(0, 160)}…</p>
      </div>
    </div>
  );
}
