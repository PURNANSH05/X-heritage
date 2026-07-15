/* HotelCard.jsx — Hotel search result card */
import { useState } from 'react';
import StarRating from './StarRating.jsx';
import PriceTag from './PriceTag.jsx';
import { HOTEL_AMENITIES } from '../data/hotelData.js';

export default function HotelCard({ hotel, onBook, onView }) {
  const [imgError, setImgError] = useState(false);

  const amenityKeys = hotel.amenities || [];
  const shownAmenities = amenityKeys.slice(0, 5);
  const extraCount = Math.max(0, amenityKeys.length - 5);

  return (
    <article className="hotel-card">
      <div className="hotel-card-image-wrap">
        {!imgError ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="hotel-card-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="hotel-card-image-placeholder">🏨</div>
        )}
        {hotel.featured && <span className="hotel-featured-badge">⭐ Featured</span>}
        <span className="hotel-stars-overlay">{'⭐'.repeat(hotel.stars)}</span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-header">
          <div>
            <h3 className="hotel-card-name">{hotel.name}</h3>
            <p className="hotel-card-location">📍 {hotel.distanceFromAttr}</p>
          </div>
          <span className={`hotel-category-tag hotel-cat-${hotel.category?.toLowerCase()}`}>
            {hotel.category}
          </span>
        </div>

        <StarRating rating={hotel.rating} count={hotel.reviews} size={13} />

        <p className="hotel-card-desc">{hotel.description}</p>

        <div className="hotel-amenities-row">
          {shownAmenities.map(key => {
            const a = HOTEL_AMENITIES[key];
            return a ? (
              <span key={key} className="hotel-amenity-chip" title={a.label}>
                {a.icon} {a.label}
              </span>
            ) : null;
          })}
          {extraCount > 0 && (
            <span className="hotel-amenity-chip hotel-amenity-more">+{extraCount} more</span>
          )}
        </div>

        <div className="hotel-card-footer">
          <div className="hotel-card-price">
            <PriceTag amount={hotel.pricePerNight} label="/ night" size="lg" highlight />
            {hotel.nights > 1 && (
              <span className="hotel-total-price">
                Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(hotel.totalPrice)}
              </span>
            )}
          </div>
          <div className="hotel-card-actions">
            <button className="btn btn-secondary" onClick={() => onView && onView(hotel)}>
              View Rooms
            </button>
            <button className="btn btn-primary" onClick={() => onBook && onBook(hotel)}>
              Book Hotel
            </button>
          </div>
        </div>

        <div className="hotel-cancellation">
          {hotel.cancellation?.includes('Free') ? (
            <span className="hotel-free-cancel">✓ {hotel.cancellation}</span>
          ) : (
            <span className="hotel-no-cancel">⚠ {hotel.cancellation}</span>
          )}
        </div>
      </div>
    </article>
  );
}
