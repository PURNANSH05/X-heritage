import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import { sites } from '../data/sites.js';
import Badge from '../components/Badge.jsx';
import QuickInfoBar from '../components/QuickInfoBar.jsx';
import PhotoGallery from '../components/PhotoGallery.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SmartImage from '../components/SmartImage.jsx';
import ImageLightbox from '../components/ImageLightbox.jsx';
import { fetchSite } from '../services/siteService.js';
import { fetchPlaceThumbnails } from '../services/placeImageService.js';
import { readFavorites, toggleFavorite } from '../utils/favorites.js';

const tabs = ['Overview', 'Full History', 'Visitor Tips', 'Details'];

export default function SiteDetail() {
  const { siteId } = useParams();
  const fallbackSite = useMemo(() => sites.find((item) => item.id === siteId) || sites[0], [siteId]);
  const [site, setSite] = useState(null);
  const [tab, setTab] = useState(tabs[0]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [nearbySites, setNearbySites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSite(null);

    fetchSite(siteId)
      .then((data) => {
        if (!active) return;
        setSite(data || fallbackSite);
      })
      .catch(() => {
        if (active) setSite(fallbackSite);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [siteId, fallbackSite]);

  useEffect(() => {
    if (!site || site.heroImage && !site.heroImage.startsWith('data:image/svg+xml')) return undefined;

    let active = true;
    fetchPlaceThumbnails([fallbackSite]).then((thumbnails) => {
      const thumbnail = thumbnails.get(fallbackSite.id);
      if (!active || !thumbnail) return;

      setSite((current) => current?.id === fallbackSite.id ? {
        ...current,
        heroImage: thumbnail,
        photos: [{ title: `${current.name?.en || 'Destination'} photo`, url: thumbnail }, ...(current.photos || [])]
      } : current);
    });

    return () => {
      active = false;
    };
  }, [site, fallbackSite]);

  useEffect(() => {
    if (!site) return;
    setSaved(readFavorites().includes(site.id));
    setGalleryIndex(0);
  }, [site]);

  useEffect(() => {
    if (!site?.latitude || !site?.longitude) return;

    const fetchNearby = async () => {
      try {
        const response = await fetch(
          `/api/nearby?latitude=${site.latitude}&longitude=${site.longitude}&radius=1000`
        );
        const data = await response.json();
        setNearbySites(data.filter((candidate) => candidate.id !== site.id).slice(0, 5));
      } catch (error) {
        console.error('Error fetching nearby sites:', error);
        setNearbySites(sites.filter((candidate) => candidate.country === site.country && candidate.id !== site.id).slice(0, 5));
      }
    };

    fetchNearby();
  }, [site]);

  const heroImage = site?.heroImage || site?.photos?.[0]?.url || site?.photos?.[0] || '';
  const heroFallback = site?.heroFallback || site?.photos?.[0]?.fallback || site?.photos?.[0] || '';
  const selectedPhoto = site?.photos?.[galleryIndex];
  const imagePreview = typeof selectedPhoto === 'string' ? selectedPhoto : selectedPhoto?.url || heroImage;
  const imagePreviewFallback = typeof selectedPhoto === 'string' ? selectedPhoto : selectedPhoto?.fallback || heroFallback;
  const audioLanguages = site?.audioGuideLanguages || site?.audioGuides?.map((guide) => guide.language) || [];

  const allPhotos = useMemo(() => {
    if (!site) return [];
    const list = [];
    if (heroImage) {
      list.push({ url: heroImage, fallback: heroFallback, title: site.name?.en || 'Main View', alt: site.name?.en || 'Main View' });
    }
    if (site.photos && site.photos.length > 0) {
      site.photos.forEach((photo) => {
        const u = typeof photo === 'string' ? photo : photo.url;
        if (u !== heroImage) {
          list.push(photo);
        }
      });
    }
    return list;
  }, [site, heroImage, heroFallback]);

  if (loading || !site) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">Loading destination details...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="detail-hero" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }} style={{ cursor: 'zoom-in', position: 'relative' }}>
          <SmartImage src={heroImage} fallback={heroFallback} alt={site.name?.en || 'Site hero'} className="detail-hero-image" site={site} />
          <div className="detail-hero-image-overlay" />
          <div className="view-fullscreen-badge">
            <Maximize2 size={14} /> View Fullscreen
          </div>
          <div className="detail-hero-overlay">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <Badge tone="gold">{site.category}</Badge>
              {site.country && <Badge tone="silver">{site.country}</Badge>}
            </div>
            <h1>{site.name?.en || 'Untitled place'}</h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              {site.city}, {site.country}
            </p>
            <div className="detail-hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSaved((prev) => !prev);
                  toggleFavorite(site.id);
                }}
              >
                {saved ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
              <Link
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, var(--gold), #b3923b)', color: '#000', fontWeight: 'bold' }}
                to={`/trip-planner?destination=${encodeURIComponent(site.name?.en || '')}&id=${site.id}&city=${encodeURIComponent(site.city || '')}`}
              >
                🗺️ Plan Trip
              </Link>
              <Link
                className="btn btn-secondary"
                to={`/hotels?destination=${encodeURIComponent(site.city || site.name?.en || '')}`}
              >
                🏨 Book Hotels
              </Link>
              <Link
                className="btn btn-secondary"
                to="/local-transport"
              >
                🚗 Cabs
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.open(site.googleMapsLink || `https://www.google.com/maps?q=${site.latitude},${site.longitude}`, '_blank', 'noopener,noreferrer')}
              >
                View on Maps
              </button>
            </div>
          </div>
        </div>

        <QuickInfoBar site={{ ...site, audioGuideLanguages: audioLanguages }} />

        <div className="detail-grid">
          <div>
            <div className="tabs">
              {tabs.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`tab ${tab === item ? 'tab-active' : ''}`}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="tab-panel">
              {tab === 'Overview' && <p style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>{site.description?.en}</p>}

              {tab === 'Full History' && (
                <div>
                  <h3>Historical Background</h3>
                  <p style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>{site.history?.en}</p>
                </div>
              )}

              {tab === 'Visitor Tips' && (
                <div>
                  <h3>Visitor Tips</h3>
                  <p style={{ lineHeight: '1.8', fontSize: '16px', color: '#333', marginBottom: '20px' }}>
                    {site.visitorTips?.en}
                  </p>
                  {site.estimatedDuration && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                      <strong>Estimated Duration:</strong> {site.estimatedDuration}
                    </div>
                  )}
                  {site.clothingAdvice && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                      <strong>Clothing Advice:</strong> {site.clothingAdvice}
                    </div>
                  )}
                  {site.accessibility && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                      <strong>Accessibility:</strong> {site.accessibility}
                    </div>
                  )}
                </div>
              )}

              {tab === 'Details' && (
                <div>
                  <h3>Practical Information</h3>
                  {site.openingHours && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Opening Hours:</strong>
                      <p>{site.openingHours}</p>
                    </div>
                  )}
                  {site.entryFee && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Entry Fees:</strong>
                      <div style={{ marginTop: '10px' }}>
                        {typeof site.entryFee === 'object' ? (
                          Object.entries(site.entryFee).map(([key, value]) => (
                            <div key={key} style={{ padding: '5px 0' }}>
                              - {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                            </div>
                          ))
                        ) : (
                          <p>{site.entryFee}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {site.bestTimeToVisit && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Best Time to Visit:</strong>
                      <p>{site.bestTimeToVisit}</p>
                    </div>
                  )}
                  {audioLanguages.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Audio Guide Languages:</strong>
                      <p>{audioLanguages.join(', ')}</p>
                    </div>
                  )}
                  {site.photography && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Photography:</strong>
                      <p>{site.photography}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Photo Gallery</h2>
            {site.photos && site.photos.length > 0 ? (
              <>
                <PhotoGallery photos={site.photos} site={site} onPick={(index) => setGalleryIndex(index)} />
                <div
                  className="gallery-preview"
                  onClick={() => {
                    const idx = allPhotos.findIndex(p => (typeof p === 'string' ? p : p.url) === imagePreview);
                    setLightboxIndex(idx >= 0 ? idx : 0);
                    setLightboxOpen(true);
                  }}
                  style={{ cursor: 'zoom-in', position: 'relative' }}
                >
                  <SmartImage
                    src={imagePreview}
                    fallback={imagePreviewFallback}
                    alt={site.name?.en || 'Site preview'}
                    className="gallery-preview-image"
                    site={site}
                  />
                  <div className="gallery-preview-zoom-overlay">
                    <Maximize2 size={20} />
                    <span>View Full Image</span>
                  </div>
                </div>
              </>
            ) : (
              <p>No photos available</p>
            )}

            {nearbySites.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Nearby Heritage Sites</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                  {nearbySites.map((nearSite) => (
                    <Link
                      key={nearSite.id}
                      to={`/site/${nearSite.id}`}
                      className="nearby-item"
                    >
                      <strong>{nearSite.name.en}</strong>
                      <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                        {nearSite.city}, {nearSite.country}
                      </p>
                      <Badge tone="silver">{nearSite.category}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {site.reviews && site.reviews.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Visitor Reviews</h2>
                <div className="reviews-grid">
                  {site.reviews.map((review) => (
                    <ReviewCard key={`${review.user}-${review.date}`} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="detail-sidebar">
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Quick Info</h3>
              <div style={{ fontSize: '14px', lineHeight: '2' }}>
                <div><strong>Rating:</strong> {site.rating?.toFixed(1)} / 5</div>
                <div><strong>Reviews:</strong> {site.reviewCount || site.reviews?.length || 0}</div>
                {site.altitude && <div><strong>Altitude:</strong> {site.altitude}</div>}
                {site.state && <div><strong>State/Region:</strong> {site.state}</div>}
              </div>
            </div>

            <AudioPlayer site={site} availableLanguages={audioLanguages} />
            <MapEmbed site={site} />

            {site.officialWebsite && (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => window.open(site.officialWebsite, '_blank', 'noopener,noreferrer')}
              >
                Official Website
              </button>
            )}
          </aside>
        </div>
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={allPhotos}
        site={site}
        currentIndex={lightboxIndex}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
