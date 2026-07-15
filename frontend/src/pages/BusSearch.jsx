/* BusSearch.jsx — Bus booking page */
import { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';
import { formatPrice } from '../services/bookingService.js';

const BUS_TYPES = ['All', 'AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo AC', 'Multi-Axle Volvo'];
const CITIES = ['New Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Chandigarh', 'Lucknow', 'Amritsar', 'Jodhpur', 'Udaipur', 'Haridwar', 'Rishikesh', 'Dehradun', 'Manali', 'Shimla', 'Pushkar', 'Ajmer', 'Ahmedabad', 'Surat', 'Vadodara', 'Pune', 'Nashik', 'Aurangabad', 'Nagpur', 'Indore', 'Bhopal', 'Gwalior', 'Varanasi', 'Prayagraj', 'Patna'];

const BUS_OPERATORS = ['RedBus', 'VRL Travels', 'SRS Travels', 'Orange Tours', 'Neeta Tours', 'Intercity Smart Bus', 'RSRTC', 'UPSRTC', 'GSRTC', 'MSRTC', 'Paulo Travels'];

function generateBuses(from, to, date) {
  const routes = [
    { dist: 250, baseFare: 400, duration: '5h 30m' },
    { dist: 350, baseFare: 600, duration: '7h 00m' },
    { dist: 500, baseFare: 900, duration: '9h 30m' },
    { dist: 700, baseFare: 1200, duration: '13h 00m' },
  ];
  const { dist, baseFare, duration } = routes[Math.floor(Math.random() * routes.length)];
  const types = ['AC Sleeper', 'Non-AC Sleeper', 'Volvo AC', 'AC Seater', 'Non-AC Seater'];
  const depTimes = ['07:00', '09:30', '12:00', '15:30', '17:00', '20:00', '21:30', '22:00', '23:00', '23:30'];
  return depTimes.slice(0, 6 + Math.floor(Math.random() * 4)).map((dep, idx) => {
    const btype = types[idx % types.length];
    const multiplier = btype.includes('Volvo') ? 2.0 : btype.includes('AC') ? 1.5 : 1.0;
    const fareBase = Math.round((baseFare * multiplier + (Math.random() - 0.3) * 200) / 50) * 50;
    const seats = Math.floor(2 + Math.random() * 20);
    return {
      id: `BUS-${idx + 1}`,
      operator: BUS_OPERATORS[idx % BUS_OPERATORS.length],
      busType: btype,
      from, to,
      departure: dep,
      arrival: `${String(parseInt(dep) + parseInt(duration) + Math.floor(Math.random() * 2)).padStart(2, '0')}:00`,
      duration,
      fare: fareBase,
      seatsAvailable: seats,
      boardingPoints: [`${from} Bus Stand`, `${from} Central`],
      droppingPoints: [`${to} Bus Stand`, `${to} City Center`],
      amenities: btype.includes('AC') ? ['AC', 'Charging Point', 'WiFi', 'Water Bottle'] : ['Charging Point', 'Fan'],
      rating: (3.5 + Math.random() * 1.4).toFixed(1),
    };
  });
}

/* Simple seat grid */
function SeatGrid({ totalSeats, onSelect }) {
  const [selected, setSelected] = useState([]);
  const taken = Array.from({ length: Math.floor(totalSeats * 0.7) }, (_, i) => i + 1);
  const toggle = (n) => {
    if (taken.includes(n)) return;
    const next = selected.includes(n) ? selected.filter(s => s !== n) : [...selected, n];
    setSelected(next);
    onSelect && onSelect(next);
  };
  return (
    <div className="seat-grid-wrap">
      <div className="seat-legend">
        <span className="seat-demo available" /> Available
        <span className="seat-demo taken" /> Taken
        <span className="seat-demo my-seat" /> Selected
      </div>
      <div className="seat-grid">
        {Array.from({ length: totalSeats }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={`seat-btn ${taken.includes(n) ? 'taken' : selected.includes(n) ? 'my-seat' : 'available'}`}
            onClick={() => toggle(n)}
            disabled={taken.includes(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {selected.length > 0 && <p className="seat-selected-info">Selected seats: {selected.join(', ')}</p>}
    </div>
  );
}

export default function BusSearch() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ from: 'New Delhi', to: 'Jaipur', date: today, passengers: 1 });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('price');
  const [bookingTarget, setBookingTarget] = useState(null);
  const [activeBus, setActiveBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSearch = async () => {
    setSearching(true);
    await new Promise(r => setTimeout(r, 900));
    setResults(generateBuses(form.from, form.to, form.date));
    setSearching(false);
    setActiveBus(null);
    setSelectedSeats([]);
  };

  let displayResults = results ? [...results] : null;
  if (displayResults) {
    if (filterType !== 'All') displayResults = displayResults.filter(b => b.busType === filterType);
    displayResults.sort((a, b) => {
      if (sortBy === 'price') return a.fare - b.fare;
      if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
      if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });
  }

  return (
    <section className="section flight-page">
      <div className="container">
        <div className="flights-hero">
          <h1>🚌 Book Buses</h1>
          <p>Search thousands of bus routes with instant seat selection and booking</p>
        </div>

        <div className="flight-search-form">
          <div className="flight-search-row">
            <div className="flight-search-field">
              <label>From City</label>
              <select value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="flight-swap-btn" onClick={() => setForm(f => ({ ...f, from: f.to, to: f.from }))}>⇄</button>
            <div className="flight-search-field">
              <label>To City</label>
              <select value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flight-search-field">
              <label>Journey Date</label>
              <input type="date" value={form.date} min={today} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flight-search-field">
              <label>Passengers</label>
              <select value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: +e.target.value }))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button className={`btn btn-primary flight-search-btn ${searching ? 'loading' : ''}`} onClick={handleSearch} disabled={searching}>
              {searching ? <><span className="login-spinner" /> Searching…</> : '🔍 Search Buses'}
            </button>
          </div>

          <div className="hotel-category-pills" style={{ marginTop: 12 }}>
            {BUS_TYPES.map(t => (
              <button key={t} className={`hotel-cat-pill ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>{t}</button>
            ))}
          </div>
        </div>

        {displayResults && (
          <div className="flight-results-layout">
            <aside className="flight-filters-sidebar">
              <h3 className="filters-title">Sort By</h3>
              {[['price', 'Cheapest'], ['departure', 'Earliest'], ['rating', 'Best Rated']].map(([v, l]) => (
                <label key={v} className="filter-radio">
                  <input type="radio" name="busSort" value={v} checked={sortBy === v} onChange={() => setSortBy(v)} />
                  {l}
                </label>
              ))}
            </aside>

            <div className="flight-results-main">
              <div className="results-header">
                <div className="results-count"><strong>{displayResults.length}</strong> buses · {form.from} → {form.to}</div>
              </div>

              <div className="flight-results-list">
                {displayResults.map(bus => (
                  <article key={bus.id} className={`flight-card ${activeBus?.id === bus.id ? 'flight-card-expanded' : ''}`}>
                    <div className="flight-card-main">
                      <div className="flight-airline">
                        <span className="flight-airline-logo">🚌</span>
                        <div>
                          <div className="flight-airline-name">{bus.operator}</div>
                          <div className="flight-number">{bus.busType}</div>
                        </div>
                      </div>
                      <div className="flight-route">
                        <div className="flight-time-block">
                          <span className="flight-time">{bus.departure}</span>
                          <span className="flight-iata">{bus.from.split(' ')[0]}</span>
                        </div>
                        <div className="flight-route-line">
                          <div className="flight-route-track">
                            <div className="flight-route-dot" /><div className="flight-route-dashes" />
                            <span className="flight-route-plane">🚌</span>
                            <div className="flight-route-dashes" /><div className="flight-route-dot" />
                          </div>
                          <span className="flight-duration">{bus.duration}</span>
                        </div>
                        <div className="flight-time-block">
                          <span className="flight-time">{bus.arrival}</span>
                          <span className="flight-iata">{bus.to.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="flight-price-col">
                        <span className="bus-fare-amount">₹{bus.fare.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 12, color: '#666' }}>{bus.seatsAvailable} seats left</span>
                        <span style={{ fontSize: 12, color: '#888' }}>⭐ {bus.rating}</span>
                        <button className="btn btn-primary flight-book-btn" onClick={() => { setActiveBus(bus); setSelectedSeats([]); }}>
                          Select Seats
                        </button>
                      </div>
                    </div>

                    {activeBus?.id === bus.id && (
                      <div className="flight-details-panel">
                        <div style={{ marginBottom: 16 }}>
                          <strong>Amenities:</strong> {bus.amenities.join(' · ')}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <strong>Boarding:</strong> {bus.boardingPoints.join(', ')} &nbsp;|&nbsp;
                          <strong>Dropping:</strong> {bus.droppingPoints.join(', ')}
                        </div>
                        <h4>Select Your Seat(s)</h4>
                        <SeatGrid totalSeats={40} onSelect={setSelectedSeats} />
                        {selectedSeats.length > 0 && (
                          <button
                            className="btn btn-primary"
                            style={{ marginTop: 16 }}
                            onClick={() => setBookingTarget({
                              operator: bus.operator,
                              busType: bus.busType,
                              from: bus.from, to: bus.to,
                              departure: bus.departure, arrival: bus.arrival,
                              date: form.date,
                              seats: selectedSeats.join(', '),
                              passengers: selectedSeats.length,
                              boardingPoint: bus.boardingPoints[0],
                              droppingPoint: bus.droppingPoints[0],
                              price: bus.fare * selectedSeats.length,
                            })}
                          >
                            Continue to Book ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}) — {formatPrice(bus.fare * selectedSeats.length)}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <BookingModal
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          bookingType="bus"
          bookingDetails={bookingTarget || {}}
          onSuccess={() => setBookingTarget(null)}
        />
      </div>
    </section>
  );
}
