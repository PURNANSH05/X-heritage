/* TrainSearch.jsx — IRCTC-style train search & booking page */
import { useState } from 'react';
import { STATIONS, searchTrains, COACH_TYPES } from '../data/trainData.js';
import TrainCard from '../components/TrainCard.jsx';
import BookingModal from '../components/BookingModal.jsx';

export default function TrainSearch() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ from: 'NDLS', to: 'BCT', date: today, passengers: 1 });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [bookingTarget, setBookingTarget] = useState(null);

  const handleSearch = async () => {
    setSearching(true);
    await new Promise(r => setTimeout(r, 1000));
    const trains = searchTrains(form.from, form.to);
    setResults(trains);
    setSearching(false);
  };

  const getStation = (code) => STATIONS.find(s => s.code === code);
  const trainTypes = results ? ['all', ...new Set(results.map(t => t.type))] : [];

  const displayResults = results
    ? (filterType === 'all' ? results : results.filter(t => t.type === filterType))
    : null;

  return (
    <section className="section flight-page">
      <div className="container">
        <div className="flights-hero">
          <h1>🚂 Book Trains</h1>
          <p>Search & book trains across India — Rajdhani, Shatabdi, Express & more</p>
        </div>

        {/* Search Form */}
        <div className="flight-search-form">
          <div className="flight-search-row">
            <div className="flight-search-field">
              <label>From Station</label>
              <select value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
                {STATIONS.map(s => <option key={s.code} value={s.code}>{s.city} — {s.name} ({s.code})</option>)}
              </select>
            </div>
            <button className="flight-swap-btn" onClick={() => setForm(f => ({ ...f, from: f.to, to: f.from }))} title="Swap">⇄</button>
            <div className="flight-search-field">
              <label>To Station</label>
              <select value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
                {STATIONS.map(s => <option key={s.code} value={s.code}>{s.city} — {s.name} ({s.code})</option>)}
              </select>
            </div>
            <div className="flight-search-field">
              <label>Journey Date</label>
              <input type="date" value={form.date} min={today} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flight-search-field">
              <label>Passengers</label>
              <select value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: +e.target.value }))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
              </select>
            </div>
            <button
              className={`btn btn-primary flight-search-btn ${searching ? 'loading' : ''}`}
              onClick={handleSearch}
              disabled={searching || form.from === form.to}
            >
              {searching ? <><span className="login-spinner" /> Searching…</> : '🔍 Search Trains'}
            </button>
          </div>
        </div>

        {/* Coach info */}
        <div className="coach-types-bar">
          {COACH_TYPES.map(ct => (
            <div key={ct.code} className="coach-type-chip">
              <span>{ct.icon}</span>
              <div>
                <strong>{ct.code}</strong>
                <span>{ct.label.split('(')[0].trim()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        {displayResults && (
          <div className="flight-results-layout">
            <aside className="flight-filters-sidebar">
              <h3 className="filters-title">Filter by Type</h3>
              {trainTypes.map(type => (
                <label key={type} className="filter-radio">
                  <input type="radio" name="trainType" value={type} checked={filterType === type} onChange={() => setFilterType(type)} />
                  {type === 'all' ? 'All Trains' : type}
                </label>
              ))}
            </aside>

            <div className="flight-results-main">
              <div className="results-header">
                <div className="results-count">
                  <strong>{displayResults.length}</strong> trains found ·{' '}
                  {getStation(form.from)?.city} → {getStation(form.to)?.city}
                </div>
              </div>
              <div className="flight-results-list">
                {displayResults.length === 0 ? (
                  <div className="empty-state">No trains found for this route. Try different stations.</div>
                ) : (
                  displayResults.map(train => (
                    <TrainCard
                      key={train.number}
                      train={train}
                      onBook={(t, cls, fare) => setBookingTarget({
                        trainName: t.name,
                        trainNumber: t.number,
                        from: `${getStation(t.from)?.city} (${t.from})`,
                        to: `${getStation(t.to)?.city} (${t.to})`,
                        departure: t.dep,
                        arrival: t.arr,
                        date: form.date,
                        coachType: cls,
                        passengers: form.passengers,
                        price: fare * form.passengers,
                        pnr: `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      })}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <BookingModal
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          bookingType="train"
          bookingDetails={bookingTarget || {}}
          onSuccess={() => setBookingTarget(null)}
        />
      </div>
    </section>
  );
}
