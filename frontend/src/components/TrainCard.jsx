/* TrainCard.jsx — Train search result card */
import { useState } from 'react';
import { formatPrice } from '../services/bookingService.js';

const CLASS_COLORS = { '1A': '#c9a84c', '2A': '#0d7377', '3A': '#1a1a2e', SL: '#666', CC: '#555', EC: '#9b59b6' };

function AvailBadge({ data }) {
  const color = data.status === 'AVAILABLE' ? '#00a651' : data.status === 'RAC' ? '#f5a623' : '#e31837';
  return (
    <span className="train-avail-badge" style={{ '--avail-color': color }}>
      {data.label}
    </span>
  );
}

export default function TrainCard({ train, onBook }) {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]);
  const [expanded, setExpanded] = useState(false);

  const avail = train.availability?.[selectedClass];
  const fare = train.fares?.[selectedClass];

  return (
    <article className={`train-card ${expanded ? 'train-card-expanded' : ''}`}>
      <div className="train-card-main">
        {/* Train info */}
        <div className="train-info">
          <span className="train-type-badge">{train.type}</span>
          <div className="train-name">{train.name}</div>
          <div className="train-number">#{train.number}</div>
          <div className="train-run-days">🗓 {train.runDays}</div>
        </div>

        {/* Route */}
        <div className="flight-route">
          <div className="flight-time-block">
            <span className="flight-time">{train.dep}</span>
            <span className="flight-iata">{train.from}</span>
          </div>
          <div className="flight-route-line">
            <div className="flight-route-track">
              <div className="flight-route-dot" />
              <div className="flight-route-dashes" />
              <span className="flight-route-plane">🚂</span>
              <div className="flight-route-dashes" />
              <div className="flight-route-dot" />
            </div>
            <span className="flight-duration">{train.duration}</span>
          </div>
          <div className="flight-time-block">
            <span className="flight-time">{train.arr}</span>
            <span className="flight-iata">{train.to}</span>
          </div>
        </div>

        {/* Class selector & Price */}
        <div className="train-class-col">
          <div className="train-class-tabs">
            {train.classes.map(cls => (
              <button
                key={cls}
                className={`train-class-tab ${selectedClass === cls ? 'active' : ''}`}
                style={selectedClass === cls ? { '--cls-color': CLASS_COLORS[cls] || '#0d7377' } : {}}
                onClick={() => setSelectedClass(cls)}
              >
                {cls}
              </button>
            ))}
          </div>
          {avail && <AvailBadge data={avail} />}
          {fare && (
            <div className="train-fare">
              <span className="train-fare-amount">{formatPrice(fare)}</span>
              <span className="train-fare-label">per person</span>
            </div>
          )}
          <button
            className="btn btn-primary flight-book-btn"
            disabled={avail?.status === 'WL' && avail?.count > 5}
            onClick={() => onBook && onBook(train, selectedClass, fare)}
          >
            {avail?.status === 'WL' ? 'Book Waitlist' : 'Book Now'}
          </button>
          <button className="flight-details-toggle" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Hide details ▲' : 'View details ▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flight-details-panel">
          <div className="flight-detail-grid">
            {train.classes.map(cls => (
              <div key={cls} className="flight-detail-item">
                <span className="flight-detail-label" style={{ color: CLASS_COLORS[cls] }}>{cls}</span>
                <span style={{ fontSize: 13 }}>
                  {train.fares?.[cls] ? formatPrice(train.fares[cls]) : 'N/A'} &nbsp;
                  {train.availability?.[cls]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
