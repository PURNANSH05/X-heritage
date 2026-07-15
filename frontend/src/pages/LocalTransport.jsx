/* LocalTransport.jsx — Local cab, auto, bike rental booking page */
import { useState } from 'react';
import { VEHICLE_TYPES, POPULAR_ROUTES, generateTransportOptions, calculateFare } from '../data/transportData.js';
import BookingModal from '../components/BookingModal.jsx';

const BOOKING_TYPES = ['Now', 'Schedule for Later'];

export default function LocalTransport() {
  const [activeRoute, setActiveRoute] = useState(null);
  const [transportOptions, setTransportOptions] = useState([]);
  const [bookingSchedule, setBookingSchedule] = useState('Now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);

  const rentals = VEHICLE_TYPES.filter(v => v.type === 'Rental');
  const nonRentals = VEHICLE_TYPES.filter(v => v.type !== 'Rental');

  const handleRouteSelect = (route) => {
    setActiveRoute(route);
    const options = generateTransportOptions(route);
    setTransportOptions(options);
    setCustomFrom(route.from);
    setCustomTo(route.to);
    setActiveVehicle(null);
  };

  const handleCustomRoute = () => {
    if (!customFrom || !customTo) return;
    const route = {
      id: 'custom',
      from: customFrom,
      to: customTo,
      icon: '🚗',
      description: `${customFrom} to ${customTo}`,
      distanceKm: 8,
    };
    setActiveRoute(route);
    setTransportOptions(generateTransportOptions(route));
    setActiveVehicle(null);
  };

  return (
    <section className="section flight-page">
      <div className="container">
        <div className="flights-hero">
          <h1>🚗 Local Transport</h1>
          <p>Book cabs, autos, and rentals for your local sightseeing needs</p>
        </div>

        <div className="transport-layout">
          {/* Left: Route selector */}
          <div className="transport-left">
            {/* Custom route input */}
            <div className="transport-custom-route">
              <h3>Enter Custom Route</h3>
              <div className="transport-route-inputs">
                <input
                  type="text"
                  placeholder="📍 Pickup location"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                />
                <div className="transport-route-arrow">↓</div>
                <input
                  type="text"
                  placeholder="📍 Drop location"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleCustomRoute} style={{ width: '100%', marginTop: 12 }}>
                Find Transport Options
              </button>
            </div>

            {/* Popular routes */}
            <div className="transport-popular-routes">
              <h3>Popular Routes</h3>
              {POPULAR_ROUTES.map(route => (
                <button
                  key={route.id}
                  className={`transport-route-btn ${activeRoute?.id === route.id ? 'active' : ''}`}
                  onClick={() => handleRouteSelect(route)}
                >
                  <span className="transport-route-icon">{route.icon}</span>
                  <div className="transport-route-info">
                    <strong>{route.from} → {route.to}</strong>
                    <span>{route.description}</span>
                  </div>
                  <span className="transport-route-dist">~{route.distanceKm} km</span>
                </button>
              ))}
            </div>

            {/* Schedule */}
            <div className="transport-schedule-section">
              <h3>When?</h3>
              <div className="transport-schedule-tabs">
                {BOOKING_TYPES.map(type => (
                  <button
                    key={type}
                    className={`transport-schedule-tab ${bookingSchedule === type ? 'active' : ''}`}
                    onClick={() => setBookingSchedule(type)}
                  >
                    {type === 'Now' ? '⚡ Now' : '📅 Schedule'}
                  </button>
                ))}
              </div>
              {bookingSchedule === 'Schedule for Later' && (
                <input
                  type="datetime-local"
                  className="transport-datetime"
                  value={scheduledTime}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={e => setScheduledTime(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Right: Transport options */}
          <div className="transport-right">
            {!activeRoute ? (
              <div className="transport-empty">
                <div style={{ fontSize: 60 }}>🗺️</div>
                <h3>Select a route to see transport options</h3>
                <p>Choose from popular routes or enter a custom pickup and drop location</p>
              </div>
            ) : (
              <>
                <div className="transport-results-header">
                  <h3>Transport for: {activeRoute.from} → {activeRoute.to}</h3>
                  <span>Distance: ~{activeRoute.distanceKm} km</span>
                </div>

                <div className="transport-options-list">
                  {transportOptions.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`transport-option-card ${activeVehicle?.id === vehicle.id ? 'selected' : ''}`}
                      onClick={() => setActiveVehicle(vehicle)}
                    >
                      <div className="transport-option-icon">{vehicle.icon}</div>
                      <div className="transport-option-info">
                        <strong>{vehicle.name}</strong>
                        <span>Up to {vehicle.capacity} {vehicle.capacity === 1 ? 'person' : 'people'} · {vehicle.ac ? 'AC' : 'Non-AC'}</span>
                        <div className="transport-providers">
                          {vehicle.providers?.map(p => (
                            <span key={p.id} className="transport-provider-tag">{p.logo} {p.name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="transport-option-price">
                        <span className="transport-fare">
                          ₹{vehicle.providers?.[0]?.fare?.minFare}–{vehicle.providers?.[0]?.fare?.maxFare}
                        </span>
                        <span className="transport-eta">ETA: {vehicle.providers?.[0]?.fare?.eta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {activeVehicle && (
                  <div className="transport-provider-select">
                    <h4>Select Provider for {activeVehicle.name}</h4>
                    <div className="transport-provider-cards">
                      {activeVehicle.providers?.map(p => (
                        <button
                          key={p.id}
                          className="transport-provider-card"
                          onClick={() => setBookingTarget({
                            vehicleType: activeVehicle.name,
                            provider: p.name,
                            from: activeRoute.from,
                            to: activeRoute.to,
                            distance: `~${activeRoute.distanceKm} km`,
                            schedule: bookingSchedule === 'Now' ? 'Immediate' : scheduledTime,
                            estimatedFare: p.fare?.estimatedFare,
                            price: p.fare?.estimatedFare || 150,
                            eta: p.fare?.eta,
                          })}
                        >
                          <span style={{ fontSize: 24 }}>{p.logo}</span>
                          <div>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: 13, color: '#666' }}>
                              ₹{p.fare?.minFare}–{p.fare?.maxFare} · {p.fare?.eta}
                            </div>
                            {p.promoAvailable && <span className="promo-tag">🎉 Promo available</span>}
                          </div>
                          <div style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--teal)', fontSize: 16 }}>
                            ₹{p.fare?.estimatedFare}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Rentals Section */}
        <div className="rental-section">
          <h2>🔑 Self-Drive Rentals</h2>
          <p>Explore at your own pace with bike, scooter, cycle or car rentals</p>
          <div className="rental-grid">
            {rentals.map(v => (
              <div key={v.id} className="rental-card">
                <div className="rental-icon">{v.icon}</div>
                <h4>{v.name}</h4>
                <div className="rental-price">₹{v.perDay}<span>/day</span></div>
                <div className="rental-deposit">Deposit: ₹{v.deposit}</div>
                <div className="rental-days-ctrl">
                  <label>Days:</label>
                  <button onClick={() => setRentalDays(d => Math.max(1, d - 1))}>−</button>
                  <span>{rentalDays}</span>
                  <button onClick={() => setRentalDays(d => d + 1)}>+</button>
                </div>
                <div className="rental-total">Total: ₹{(v.perDay * rentalDays).toLocaleString('en-IN')}</div>
                <button
                  className="btn btn-primary"
                  onClick={() => setBookingTarget({
                    vehicleType: v.name,
                    rentalDays,
                    pricePerDay: v.perDay,
                    deposit: v.deposit,
                    price: v.perDay * rentalDays,
                    pickupTime: bookingSchedule === 'Now' ? 'Immediate' : (scheduledTime || 'TBD'),
                  })}
                >
                  Book Rental
                </button>
              </div>
            ))}
          </div>
        </div>

        <BookingModal
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          bookingType="cab"
          bookingDetails={bookingTarget || {}}
          onSuccess={() => setBookingTarget(null)}
        />
      </div>
    </section>
  );
}
