/* Hotels.jsx — Hotel search & booking page */
import { useState } from 'react';
import { searchHotels } from '../data/hotelData.js';
import HotelCard from '../components/HotelCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['All', 'Luxury', 'Premium', 'Budget', 'Boutique', 'Resort', 'Hostel', 'Heritage'];
const DESTINATIONS = [
  'Agra', 'Jaipur', 'Varanasi', 'Goa', 'New Delhi', 'Hampi',
  'Mumbai', 'Udaipur', 'Amritsar', 'Kedarnath', 'Rann of Kutch',
];

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const prefillDest = searchParams.get('destination') || '';
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    destination: prefillDest || 'Goa',
    checkin: today,
    checkout: tomorrow,
    rooms: 1,
    guests: 2,
    category: 'All',
  });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [bookingTarget, setBookingTarget] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleSearch = async () => {
    setSearching(true);
    await new Promise(r => setTimeout(r, 1000));
    const hotels = searchHotels(
      form.destination,
      form.checkin,
      form.checkout,
      form.guests,
      form.category === 'All' ? null : form.category
    );
    setResults(hotels);
    setSearching(false);
  };

  const getNights = () => {
    if (!form.checkin || !form.checkout) return 1;
    return Math.max(1, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000));
  };

  let displayResults = results ? [...results] : null;
  if (displayResults) {
    displayResults.sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });
  }

  return (
    <section className="section flight-page">
      <div className="container">
        {/* Header */}
        <div className="flights-hero hotels-hero">
          <h1>🏨 Find & Book Hotels</h1>
          <p>Discover handpicked hotels near India's most iconic heritage destinations</p>
        </div>

        {/* Search */}
        <div className="flight-search-form hotel-search-form">
          <div className="flight-search-row">
            <div className="flight-search-field hotel-dest-field">
              <label>Destination</label>
              <input
                type="text"
                list="hotel-destinations"
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                placeholder="City or attraction..."
              />
              <datalist id="hotel-destinations">
                {DESTINATIONS.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
            <div className="flight-search-field">
              <label>Check-in</label>
              <input type="date" value={form.checkin} min={today} onChange={e => setForm(f => ({ ...f, checkin: e.target.value }))} />
            </div>
            <div className="flight-search-field">
              <label>Check-out</label>
              <input type="date" value={form.checkout} min={form.checkin} onChange={e => setForm(f => ({ ...f, checkout: e.target.value }))} />
            </div>
            <div className="flight-search-field">
              <label>Rooms</label>
              <select value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: +e.target.value }))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="flight-search-field">
              <label>Guests</label>
              <select value={form.guests} onChange={e => setForm(f => ({ ...f, guests: +e.target.value }))}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button
              className={`btn btn-primary flight-search-btn ${searching ? 'loading' : ''}`}
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? <><span className="login-spinner" /> Searching…</> : '🔍 Search Hotels'}
            </button>
          </div>

          {/* Category filter pills */}
          <div className="hotel-category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`hotel-cat-pill ${form.category === cat ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, category: cat }))}
              >
                {cat === 'Luxury' ? '👑' : cat === 'Budget' ? '🎒' : cat === 'Resort' ? '🌴' : cat === 'Heritage' ? '🏰' : cat === 'Hostel' ? '🛏️' : ''} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {displayResults && (
          <>
            <div className="results-header">
              <div className="results-count">
                <strong>{displayResults.length}</strong> hotels in {form.destination} ·{' '}
                {getNights()} night{getNights() > 1 ? 's' : ''} · {form.guests} guests
              </div>
              <div className="results-sort">
                <label>Sort:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="featured">Featured first</option>
                  <option value="rating">Best rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {displayResults.length === 0 ? (
              <div className="empty-state">No hotels found in {form.destination}. Try a different destination.</div>
            ) : (
              <div className="hotel-results-grid">
                {displayResults.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onBook={(h) => setBookingTarget({
                      hotelName: h.name,
                      destination: h.destinationCity,
                      stars: `${h.stars} ⭐`,
                      checkin: form.checkin,
                      checkout: form.checkout,
                      rooms: form.rooms,
                      guests: form.guests,
                      nights: getNights(),
                      roomType: 'Standard Room',
                      pricePerNight: h.pricePerNight,
                      price: h.pricePerNight * getNights() * form.rooms,
                      totalPrice: h.pricePerNight * getNights() * form.rooms,
                    })}
                    onView={(h) => setSelectedHotel(h)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Hotel detail modal */}
        {selectedHotel && (
          <div className="modal-backdrop" onClick={() => setSelectedHotel(null)}>
            <div className="modal-box hotel-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedHotel.name}</h2>
                <button className="modal-close-btn" onClick={() => setSelectedHotel(null)}>✕</button>
              </div>
              <div className="modal-body">
                <img src={selectedHotel.image} alt={selectedHotel.name} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} onError={e => e.target.style.display = 'none'} />
                <p style={{ marginBottom: 16 }}>{selectedHotel.description}</p>
                <h4>Available Room Types</h4>
                <div className="room-types-grid">
                  {selectedHotel.roomTypes?.filter(r => r.available).map(rt => (
                    <div key={rt.id} className="room-type-card">
                      <div>
                        <strong>{rt.name}</strong>
                        <p style={{ fontSize: 13, color: '#666' }}>{rt.description}</p>
                        <span style={{ fontSize: 12 }}>👥 Up to {rt.capacity} guests</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--teal)', fontSize: 18 }}>
                          ₹{rt.price?.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: 12, color: '#666' }}>per night</span>
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: 8, fontSize: 13, padding: '6px 14px' }}
                          onClick={() => {
                            setSelectedHotel(null);
                            setBookingTarget({
                              hotelName: selectedHotel.name,
                              destination: selectedHotel.destinationCity,
                              stars: `${selectedHotel.stars} ⭐`,
                              checkin: form.checkin,
                              checkout: form.checkout,
                              rooms: form.rooms,
                              guests: form.guests,
                              nights: getNights(),
                              roomType: rt.name,
                              pricePerNight: rt.price,
                              price: rt.price * getNights() * form.rooms,
                              totalPrice: rt.price * getNights() * form.rooms,
                            });
                          }}
                        >
                          Book This Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <BookingModal
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          bookingType="hotel"
          bookingDetails={bookingTarget || {}}
          onSuccess={() => setBookingTarget(null)}
        />
      </div>
    </section>
  );
}
