/* FlightCard.jsx — Flight result card */
import { useState } from 'react';
import PriceTag from './PriceTag.jsx';

export default function FlightCard({ flight, onBook }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`flight-card ${expanded ? 'flight-card-expanded' : ''}`}>
      <div className="flight-card-main">
        {/* Airline */}
        <div className="flight-airline">
          <span className="flight-airline-logo">{flight.airlineLogo}</span>
          <div>
            <div className="flight-airline-name">{flight.airline}</div>
            <div className="flight-number">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Route & Time */}
        <div className="flight-route">
          <div className="flight-time-block">
            <span className="flight-time">{flight.departure}</span>
            <span className="flight-iata">{flight.from}</span>
          </div>
          <div className="flight-route-line">
            <span className="flight-stops-badge">{flight.stops}</span>
            <div className="flight-route-track">
              <div className="flight-route-dot" />
              <div className="flight-route-dashes" />
              <span className="flight-route-plane">✈</span>
              <div className="flight-route-dashes" />
              <div className="flight-route-dot" />
            </div>
            <span className="flight-duration">{flight.duration}</span>
          </div>
          <div className="flight-time-block">
            <span className="flight-time">{flight.arrival}</span>
            <span className="flight-iata">{flight.to}</span>
          </div>
        </div>

        {/* Price & Book */}
        <div className="flight-price-col">
          <PriceTag amount={flight.price} label={`per person`} size="lg" highlight />
          {flight.seatsUrgent && (
            <span className="flight-seats-urgent">⚡ {flight.seatsLabel}</span>
          )}
          <button
            className="btn btn-primary flight-book-btn"
            onClick={() => onBook && onBook(flight)}
          >
            Book Now
          </button>
          <button
            className="flight-details-toggle"
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? 'Hide details ▲' : 'View details ▼'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="flight-details-panel">
          <div className="flight-detail-grid">
            <div className="flight-detail-item">
              <span className="flight-detail-label">Baggage</span>
              <span>{flight.baggage}</span>
            </div>
            <div className="flight-detail-item">
              <span className="flight-detail-label">Meal</span>
              <span>{flight.meal}</span>
            </div>
            <div className="flight-detail-item">
              <span className="flight-detail-label">Refundable</span>
              <span className={flight.refundable ? 'text-green' : 'text-red'}>
                {flight.refundable ? '✓ Refundable' : '✕ Non-refundable'}
              </span>
            </div>
            <div className="flight-detail-item">
              <span className="flight-detail-label">On-time</span>
              <span>{flight.onTime}% on-time</span>
            </div>
            <div className="flight-detail-item">
              <span className="flight-detail-label">Class</span>
              <span>{flight.travelClass}</span>
            </div>
            <div className="flight-detail-item">
              <span className="flight-detail-label">Seats Left</span>
              <span className={flight.seatsUrgent ? 'text-red' : ''}>{flight.seatsLabel}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
