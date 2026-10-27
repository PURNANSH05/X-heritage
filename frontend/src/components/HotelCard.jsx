/* HotelCard.jsx — Hotel search result card */
import { useState } from 'react';
import StarRating from './StarRating.jsx';
import PriceTag from './PriceTag.jsx';
import { HOTEL_AMENITIES } from '../data/hotelData.js';
import Icon from './Icon.jsx';

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
          <div className="hotel-card-image-placeholder"><Icon name="hotel" size={36} /></div>
        )}
        {hotel.featured && <span className="hotel-featured-badge"><Icon name="star" size={14} /> Featured</span>}
        <span className="hotel-stars-overlay" aria-label={`${hotel.stars} star hotel`}>
          {Array.from({ length: hotel.stars }, (_, index) => <Icon key={index} name="star" size={13} />)}
        </span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-header">
          <div>
            <h3 className="hotel-card-name">{hotel.name}</h3>
            <p className="hotel-card-location"><Icon name="mapPin" size={15} /> {hotel.distanceFromAttr}</p>
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
                <Icon name={a.icon} size={15} /> {a.label}
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
              <span className="hotel-free-cancel"><Icon name="check" size={14} /> {hotel.cancellation}</span>
          ) : (
            <span className="hotel-no-cancel"><Icon name="warning" size={14} /> {hotel.cancellation}</span>
          )}
        </div>
      </div>
    </article>
  );
}
