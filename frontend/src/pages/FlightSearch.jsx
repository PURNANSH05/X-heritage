/* FlightSearch.jsx — Full flight search & booking page */
import { useState } from 'react';
import { AIRPORTS, generateFlights, POPULAR_ROUTES } from '../data/flightData.js';
import FlightCard from '../components/FlightCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class'];
const TRIP_TYPES = ['One Way', 'Round Trip'];

export default function FlightSearch() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    from: 'DEL', to: 'BOM', date: today, returnDate: '', passengers: 1, travelClass: 'Economy', tripType: 'One Way',
  });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filterStops, setFilterStops] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [bookingTarget, setBookingTarget] = useState(null);

  const handleSearch = async () => {
    setSearching(true);
    await new Promise(r => setTimeout(r, 1200));
    const flights = generateFlights(form.from, form.to, form.date, form.travelClass);
    setResults(flights);
    setSearching(false);
  };

  const swap = () => setForm(f => ({ ...f, from: f.to, to: f.from }));

  const getAirportLabel = (code) => {
    const a = AIRPORTS.find(x => x.code === code);
    return a ? `${a.city} (${code})` : code;
  };

  let displayResults = results ? [...results] : null;
  if (displayResults) {
    if (filterStops !== 'all') displayResults = displayResults.filter(f => f.stops === filterStops);
    if (filterAirline !== 'all') displayResults = displayResults.filter(f => f.airline === filterAirline);
    displayResults.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') return a.durationMins - b.durationMins;
      if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
      if (sortBy === 'rating') return b.airlineRating - a.airlineRating;
      return 0;
    });
  }

  const airlines = results ? [...new Set(results.map(f => f.airline))] : [];
  const minPrice = results?.length ? Math.min(...results.map(f => f.price)) : 0;
  const maxPrice = results?.length ? Math.max(...results.map(f => f.price)) : 0;

  return (
    <section className="section flight-page">
      <div className="container">
        {/* Header */}
        <div className="flights-hero">
          <h1><Icon name="plane" size={24} /> Book Flights</h1>
          <p>Compare and book flights across all major Indian airlines</p>
        </div>

        {/* Search Form */}
        <div className="flight-search-form">
          <div className="flight-trip-type">
            {TRIP_TYPES.map(t => (
              <button
                key={t}
                className={`trip-type-btn ${form.tripType === t ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, tripType: t }))}
              >{t}</button>
            ))}
          </div>

          <div className="flight-search-row">
            {/* From */}
            <div className="flight-search-field">
              <label>From</label>
              <select value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <button className="flight-swap-btn" onClick={swap} title="Swap airports">⇄</button>

            {/* To */}
            <div className="flight-search-field">
              <label>To</label>
              <select value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
                {AIRPORTS.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flight-search-field">
              <label>Departure</label>
              <input type="date" value={form.date} min={today} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>

            {form.tripType === 'Round Trip' && (
              <div className="flight-search-field">
                <label>Return</label>
                <input type="date" value={form.returnDate} min={form.date} onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))} />
              </div>
            )}

            {/* Passengers */}
            <div className="flight-search-field">
              <label>Passengers</label>
              <select value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: +e.target.value }))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>)}
              </select>
            </div>

            {/* Class */}
            <div className="flight-search-field">
              <label>Class</label>
              <select value={form.travelClass} onChange={e => setForm(f => ({ ...f, travelClass: e.target.value }))}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <button
              className={`btn btn-primary flight-search-btn ${searching ? 'loading' : ''}`}
              onClick={handleSearch}
              disabled={searching || form.from === form.to}
            >
              {searching ? <><span className="login-spinner" /> Searching…</> : <><Icon name="search" size={16} /> Search Flights</>}
            </button>
          </div>
        </div>

        {/* Popular Routes */}
        {!results && (
          <div className="popular-routes-section">
            <h3>Popular Routes</h3>
            <div className="popular-routes-grid">
              {POPULAR_ROUTES.map(r => (
                <button
                  key={r.label}
                  className="popular-route-chip"
                  onClick={() => {
                    setForm(f => ({ ...f, from: r.from, to: r.to }));
                  }}
                >
                  <><Icon name="plane" size={15} /> {r.label}</>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {displayResults && (
          <div className="flight-results-layout">
            {/* Sidebar filters */}
            <aside className="flight-filters-sidebar">
              <h3 className="filters-title">Filter Results</h3>

              <div className="filter-section">
                <h4>Stops</h4>
                {['all', 'non-stop', '1 stop'].map(s => (
                  <label key={s} className="filter-radio">
                    <input type="radio" name="stops" value={s} checked={filterStops === s} onChange={() => setFilterStops(s)} />
                    {s === 'all' ? 'All' : s === 'non-stop' ? 'Non-stop only' : '1 Stop'}
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <h4>Airlines</h4>
                <label className="filter-radio">
                  <input type="radio" name="airline" value="all" checked={filterAirline === 'all'} onChange={() => setFilterAirline('all')} />
                  All Airlines
                </label>
                {airlines.map(a => (
                  <label key={a} className="filter-radio">
                    <input type="radio" name="airline" value={a} checked={filterAirline === a} onChange={() => setFilterAirline(a)} />
                    {a}
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-info">
                  <span>₹{minPrice.toLocaleString('en-IN')}</span>
                  <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </aside>

            {/* Main results */}
            <div className="flight-results-main">
              <div className="results-header">
                <div className="results-count">
                  <strong>{displayResults.length}</strong> flights found · {getAirportLabel(form.from)} → {getAirportLabel(form.to)}
                </div>
                <div className="results-sort">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="price">Cheapest first</option>
                    <option value="duration">Fastest first</option>
                    <option value="departure">Earliest departure</option>
                    <option value="rating">Best rated airline</option>
                  </select>
                </div>
              </div>

              <div className="flight-results-list">
                {displayResults.length === 0 ? (
                  <div className="empty-state">No flights match your filters. Try adjusting them.</div>
                ) : (
                  displayResults.map(flight => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onBook={(f) => setBookingTarget({
                        ...f,
                        price: f.price * form.passengers,
                        passengers: form.passengers,
                        date: form.date,
                        from: getAirportLabel(f.from),
                        to: getAirportLabel(f.to),
                        pnr: `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      })}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          bookingType="flight"
          bookingDetails={bookingTarget || {}}
          onSuccess={() => setBookingTarget(null)}
        />
      </div>
    </section>
  );
}
