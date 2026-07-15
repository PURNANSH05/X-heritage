/* TripPlanner.jsx — Complete AI Trip Planning Wizard */
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { sites } from '../data/sites.js';

/* ── Constants ──────────────────────────────────────────────── */
const BUDGETS = [
  { id: 'budget', label: '🎒 Budget', desc: 'Hostels · Auto · Street food', color: '#27ae60', range: '₹500–1,500/day' },
  { id: 'premium', label: '⭐ Premium', desc: 'Hotels · Cab · Restaurants', color: '#0d7377', range: '₹2,000–5,000/day' },
  { id: 'luxury', label: '👑 Luxury', desc: 'Resorts · Chauffeur · Fine dining', color: '#c9a84c', range: '₹8,000+/day' },
];

const TRAVEL_TYPES = [
  { id: 'Solo', icon: '🧍' }, { id: 'Couple', icon: '👫' },
  { id: 'Family', icon: '👨‍👩‍👧' }, { id: 'Friends Group', icon: '👯' },
  { id: 'Honeymoon', icon: '💑' }, { id: 'Business', icon: '💼' },
];

const QUICK_DESTS = [
  { label: 'Taj Mahal', city: 'Agra', icon: '🕌', id: 'taj-mahal-01' },
  { label: 'Jaipur', city: 'Rajasthan', icon: '🏰', id: 'jaipur-01' },
  { label: 'Varanasi', city: 'Uttar Pradesh', icon: '🛕', id: 'varanasi-01' },
  { label: 'Goa Beaches', city: 'Goa', icon: '🏖️', id: 'goa-01' },
  { label: 'Hampi', city: 'Karnataka', icon: '🏛️', id: 'hampi-01' },
  { label: 'Rann of Kutch', city: 'Gujarat', icon: '🌅', id: 'kutch-01' },
  { label: 'Kedarnath', city: 'Uttarakhand', icon: '⛰️', id: 'kedarnath-01' },
  { label: 'Mysore', city: 'Karnataka', icon: '🏯', id: 'mysore-01' },
];

/* ── Itinerary engine (self-contained, no external dependency) ── */
const ITINERARY_TEMPLATES = {
  'taj-mahal-01': {
    destination: 'Taj Mahal', city: 'Agra',
    days: [
      [
        { time: '06:00', activity: 'Sunrise at Taj Mahal', type: 'Heritage', icon: '🕌', duration: '2h', notes: 'Arrive early — soft golden light makes it magical' },
        { time: '09:00', activity: 'Rooftop breakfast with Taj view', type: 'Food', icon: '🥐', duration: '1h' },
        { time: '10:30', activity: 'Agra Fort (UNESCO)', type: 'Heritage', icon: '🏰', duration: '2h', notes: 'See Taj from the Octagonal Tower' },
        { time: '13:00', activity: 'Lunch at Pind Balluchi', type: 'Food', icon: '🍛', duration: '1h' },
        { time: '14:30', activity: 'Fatehpur Sikri Day Trip', type: 'Heritage', icon: '🏛️', duration: '3h', notes: 'Abandoned Mughal capital, 37 km away' },
        { time: '18:30', activity: 'Sunset from Mehtab Bagh', type: 'Scenic', icon: '🌅', duration: '1h' },
        { time: '20:00', activity: 'Dinner + Petha shopping', type: 'Food', icon: '🛍️', duration: '2h' },
      ],
      [
        { time: '07:00', activity: 'Taj Mahal interior (mausoleum)', type: 'Heritage', icon: '🕌', duration: '2h' },
        { time: '09:30', activity: "Itimad-ud-Daulah (Baby Taj)", type: 'Heritage', icon: '🏛️', duration: '1.5h' },
        { time: '11:30', activity: 'Chini Ka Rauza', type: 'Heritage', icon: '🏛️', duration: '1h' },
        { time: '13:00', activity: 'Lunch at Pinch of Spice', type: 'Food', icon: '🍽️', duration: '1h' },
        { time: '14:30', activity: 'Sadar Bazaar Shopping', type: 'Shopping', icon: '🛒', duration: '2h' },
        { time: '17:00', activity: 'Mohabbat the Taj cultural show', type: 'Culture', icon: '🎭', duration: '2h' },
        { time: '20:00', activity: 'Farewell dinner at hotel', type: 'Food', icon: '🍷', duration: '1.5h' },
      ],
    ],
  },
  'jaipur-01': {
    destination: 'Jaipur', city: 'Jaipur',
    days: [
      [
        { time: '08:00', activity: 'Amber Fort & Palace', type: 'Heritage', icon: '🏰', duration: '3h', notes: 'UNESCO — book elephant or jeep ride in advance' },
        { time: '12:00', activity: 'Lunch at 1135 AD (Amber Fort)', type: 'Food', icon: '🍛', duration: '1h' },
        { time: '14:00', activity: 'City Palace Museum', type: 'Heritage', icon: '🏛️', duration: '2h' },
        { time: '16:30', activity: 'Jantar Mantar Observatory', type: 'Heritage', icon: '🔭', duration: '1h' },
        { time: '18:00', activity: 'Hawa Mahal (Sunset)', type: 'Heritage', icon: '🏰', duration: '1h' },
        { time: '19:30', activity: 'Bapu Bazaar Shopping', type: 'Shopping', icon: '🛍️', duration: '1.5h' },
        { time: '21:00', activity: 'Chokhi Dhani cultural village', type: 'Culture', icon: '🎪', duration: '2h', notes: 'Folk dance + Rajasthani thali dinner' },
      ],
      [
        { time: '07:30', activity: 'Nahargarh Fort sunrise', type: 'Scenic', icon: '🌅', duration: '2h' },
        { time: '10:00', activity: 'Jaigarh Fort & Jaivana Cannon', type: 'Heritage', icon: '⚔️', duration: '2h' },
        { time: '12:30', activity: 'Lunch at Suvarna Mahal', type: 'Food', icon: '🍽️', duration: '1h' },
        { time: '14:00', activity: 'Block Printing Workshop', type: 'Culture', icon: '🎨', duration: '2h' },
        { time: '16:30', activity: 'Johari Bazaar jewelry shopping', type: 'Shopping', icon: '💍', duration: '2h' },
        { time: '20:30', activity: 'Dinner at Niros Restaurant', type: 'Food', icon: '🍛', duration: '1.5h' },
      ],
    ],
  },
  'goa-01': {
    destination: 'Goa Beaches', city: 'Goa',
    days: [
      [
        { time: '07:00', activity: 'Sunrise at Palolem Beach', type: 'Scenic', icon: '🌅', duration: '1h' },
        { time: '09:00', activity: 'Breakfast at shack café', type: 'Food', icon: '☕', duration: '1h' },
        { time: '10:30', activity: 'Old Goa churches & Basilica (UNESCO)', type: 'Heritage', icon: '⛪', duration: '2h' },
        { time: '13:00', activity: 'Seafood lunch at Fish Thali restaurant', type: 'Food', icon: '🦞', duration: '1h' },
        { time: '15:00', activity: 'Baga & Calangute beach swim', type: 'Leisure', icon: '🏊', duration: '3h' },
        { time: '18:30', activity: 'Sunset cruise on Mandovi River', type: 'Scenic', icon: '🚢', duration: '2h' },
        { time: '21:00', activity: 'Dinner & nightlife at Titos Lane', type: 'Nightlife', icon: '🎉', duration: '2h' },
      ],
      [
        { time: '08:00', activity: 'Dudhsagar Waterfall day trip', type: 'Nature', icon: '🌊', duration: '4h' },
        { time: '13:00', activity: 'Lunch at Spice Plantation', type: 'Food', icon: '🌶️', duration: '1.5h', notes: 'All-you-can-eat Goan thali' },
        { time: '15:30', activity: 'Anjuna Flea Market', type: 'Shopping', icon: '🛍️', duration: '2h' },
        { time: '18:00', activity: 'Vagator Beach sunset', type: 'Scenic', icon: '🌅', duration: '1.5h' },
        { time: '20:30', activity: 'Dinner at A Reverie Restaurant', type: 'Food', icon: '🍝', duration: '2h' },
      ],
    ],
  },
  'varanasi-01': {
    destination: 'Varanasi Ghats', city: 'Varanasi',
    days: [
      [
        { time: '05:00', activity: 'Sunrise boat ride on the Ganges', type: 'Spiritual', icon: '🚣', duration: '2h', notes: 'The most iconic Varanasi experience' },
        { time: '08:00', activity: 'Breakfast at Blue Lassi Shop', type: 'Food', icon: '🥛', duration: '45m' },
        { time: '09:30', activity: 'Kashi Vishwanath Temple', type: 'Spiritual', icon: '🛕', duration: '2h', notes: 'One of the 12 Jyotirlingas, sacred for Shiva' },
        { time: '12:00', activity: 'Street food exploration (Kachori, Chaat)', type: 'Food', icon: '🥙', duration: '1.5h' },
        { time: '14:00', activity: 'Sarnath — Buddhas first sermon site', type: 'Heritage', icon: '🏛️', duration: '3h' },
        { time: '18:00', activity: 'Dashashwamedh Ghat Ganga Aarti', type: 'Spiritual', icon: '🔥', duration: '1.5h', notes: 'The grand evening prayer ceremony — unmissable' },
        { time: '20:30', activity: 'Dinner on rooftop with Ganges view', type: 'Food', icon: '🍛', duration: '1.5h' },
      ],
    ],
  },
  'hampi-01': {
    destination: 'Hampi', city: 'Hampi',
    days: [
      [
        { time: '06:30', activity: 'Sunrise from Hemakuta Hill', type: 'Scenic', icon: '🌅', duration: '1.5h' },
        { time: '08:30', activity: 'Virupaksha Temple complex', type: 'Heritage', icon: '🏛️', duration: '2h' },
        { time: '11:00', activity: 'Vittala Temple & Stone Chariot (UNESCO)', type: 'Heritage', icon: '🕍', duration: '2.5h', notes: 'The iconic stone chariot — best photo spot' },
        { time: '14:00', activity: 'Lunch near Hampi Bazaar', type: 'Food', icon: '🍽️', duration: '1h' },
        { time: '15:30', activity: 'Lotus Mahal & Elephant Stables', type: 'Heritage', icon: '🏯', duration: '2h' },
        { time: '18:00', activity: 'Coracle ride on Tungabhadra River', type: 'Nature', icon: '🌊', duration: '1h' },
        { time: '20:00', activity: 'Dinner at Laughing Buddha Café', type: 'Food', icon: '😄', duration: '1.5h' },
      ],
    ],
  },
};

const DEFAULT_DAY = (d, total) => [
  { time: '08:00', activity: d === 1 ? 'Arrival & Check-in' : d === total ? 'Final morning exploration' : 'Morning heritage tour', type: 'Heritage', icon: '🏛️', duration: '3h', notes: d === 1 ? 'Settle in, rest, explore the neighbourhood' : '' },
  { time: '12:00', activity: 'Lunch at local restaurant', type: 'Food', icon: '🍽️', duration: '1h' },
  { time: '14:00', activity: 'Afternoon cultural experience', type: 'Culture', icon: '🎨', duration: '2.5h' },
  { time: '17:00', activity: 'Evening local market walk', type: 'Leisure', icon: '🛒', duration: '1.5h' },
  { time: '19:30', activity: 'Sunset viewpoint', type: 'Scenic', icon: '🌅', duration: '1h' },
  { time: '21:00', activity: d === total ? 'Farewell dinner' : 'Dinner at recommended spot', type: 'Food', icon: '🍛', duration: '1.5h' },
];

function buildItinerary(form) {
  const days = (() => {
    if (!form.startDate || !form.endDate) return 2;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(1, Math.ceil(diff / 86400000));
  })();

  const tmpl = ITINERARY_TEMPLATES[form.destinationId] || null;
  const destName = form.destination || 'Your Destination';
  const cityName = tmpl?.city || form.city || destName;

  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    const templateActivities = tmpl?.days[d - 1] || null;
    itinerary.push({
      day: d,
      activities: templateActivities || DEFAULT_DAY(d, days),
    });
  }

  const budgetTips = {
    budget: ['Use autos & shared cabs — save 60%', 'Eat at local dhabas (₹80–150/meal)', 'Stay at hostels/guesthouses (₹400–800/night)', 'Book attractions online to skip queues'],
    premium: ['Pre-book a private cab for the trip', 'Reserve restaurants in advance for peak season', 'Consider heritage hotels for an authentic stay', 'Audio guides enhance every monument visit'],
    luxury: ['Arrange a personal heritage guide', 'Book pool/heritage villas 2+ months ahead', 'Private sunset/sunrise tours are worth it', 'Pre-arrange butler & spa at your resort'],
  };

  return { destination: destName, city: cityName, days, budget: form.budget, itinerary, budgetTips: budgetTips[form.budget] };
}

/* ── Activity type colour map ── */
const TYPE_COLORS = {
  Heritage: '#c9a84c', Food: '#e74c3c', Scenic: '#9b59b6', Culture: '#2980b9',
  Shopping: '#27ae60', Spiritual: '#f39c12', Nature: '#1abc9c', Leisure: '#7f8c8d',
  Nightlife: '#8e44ad', default: '#7f8c8d',
};

/* ══════════════════════════════════════════════════════════════ */
export default function TripPlanner() {
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    destination: searchParams.get('destination') || '',
    destinationId: searchParams.get('id') || '',
    city: searchParams.get('city') || '',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    budget: 'premium',
    travelType: 'Couple',
  });
  const [query, setQuery] = useState(searchParams.get('destination') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  /* Destination autocomplete */
  const handleDestInput = (val) => {
    setQuery(val);
    setForm(f => ({ ...f, destination: val }));
    if (val.length > 1) {
      setSuggestions(
        sites.filter(s =>
          (s.name?.en || '').toLowerCase().includes(val.toLowerCase()) ||
          (s.city || '').toLowerCase().includes(val.toLowerCase())
        ).slice(0, 7)
      );
    } else setSuggestions([]);
  };

  const pickDestination = (s) => {
    const name = s.name?.en || '';
    setQuery(name);
    setForm(f => ({ ...f, destination: name, destinationId: s.id, city: s.city || '' }));
    setSuggestions([]);
  };

  const pickQuick = (d) => {
    setQuery(d.label);
    setForm(f => ({ ...f, destination: d.label, destinationId: d.id, city: d.city }));
    setSuggestions([]);
  };

  /* Days calculation */
  const tripDays = (() => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(1, Math.ceil(diff / 86400000));
  })();

  /* Validation */
  const step1Valid = form.destination.trim().length > 0;
  const step2Valid = form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate);

  /* Generate */
  const handleGenerate = async () => {
    if (!step2Valid) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const result = buildItinerary(form);
    setItinerary(result);
    setExpandedDay(1);
    setGenerating(false);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Today string */
  const today = new Date().toISOString().split('T')[0];

  /* ── Render ── */
  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg, #0e1118)', padding: '0 0 80px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <span style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: '20px',
            background: 'rgba(201,168,76,0.15)', color: '#c9a84c',
            fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '16px', border: '1px solid rgba(201,168,76,0.3)',
          }}>🗺️ AI Trip Planner</span>
          <h1 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
            Plan Your Perfect Heritage Journey
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px', maxWidth: '540px', margin: '0 auto' }}>
            Fill in your preferences and get a personalised day-by-day itinerary in seconds.
          </p>
        </div>

        {/* ── Step Progress ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: '40px' }}>
          {[{ n: 1, label: 'Destination' }, { n: 2, label: 'Dates & Guests' }, { n: 3, label: 'Itinerary' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: '700', fontSize: '14px',
                  background: step > s.n ? '#c9a84c' : step === s.n ? 'linear-gradient(135deg,#c9a84c,#8b6914)' : 'rgba(255,255,255,0.08)',
                  color: step >= s.n ? '#000' : '#666', border: step === s.n ? '2px solid #c9a84c' : '2px solid transparent',
                  boxShadow: step === s.n ? '0 0 0 4px rgba(201,168,76,0.2)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '11px', color: step >= s.n ? '#c9a84c' : '#555', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ width: '60px', height: '2px', background: step > s.n ? '#c9a84c' : 'rgba(255,255,255,0.1)', margin: '0 4px 20px', transition: 'background 0.4s' }} />}
            </div>
          ))}
        </div>

        {/* ══ STEP 1 — DESTINATION ══════════════════════════════ */}
        {step === 1 && (
          <div style={panelStyle}>
            <h2 style={panelTitle}>🏛️ Where do you want to go?</h2>
            <p style={panelSub}>Search any heritage site, city, monument, temple, beach or national park.</p>

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: '14px', padding: '12px 16px',
                boxShadow: query ? '0 0 0 3px rgba(201,168,76,0.2)' : 'none',
                transition: 'box-shadow 0.2s',
              }}>
                <span style={{ fontSize: '18px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="e.g. Taj Mahal, Goa, Jaipur, Kedarnath..."
                  value={query}
                  onChange={e => handleDestInput(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#fff', fontSize: '16px', fontFamily: 'inherit',
                  }}
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setForm(f => ({ ...f, destination: '', destinationId: '' })); setSuggestions([]); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '16px' }}
                  >✕</button>
                )}
              </div>

              {/* Autocomplete dropdown */}
              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                  background: '#1a1d24', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  overflow: 'hidden', marginTop: '4px',
                }}>
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => pickDestination(s)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px', background: 'none', border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer', textAlign: 'left', color: '#ddd',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <span style={{ fontSize: '18px' }}>📍</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{s.name?.en}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{s.city}, {s.country}</div>
                      </div>
                      <span style={{ fontSize: '11px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '2px 8px', borderRadius: '10px' }}>
                        {s.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick destinations */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: '#888', fontSize: '13px', fontWeight: '600', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Popular Destinations
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
                {QUICK_DESTS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => pickQuick(d)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                      background: form.destinationId === d.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      border: form.destinationId === d.id ? '1.5px solid #c9a84c' : '1.5px solid rgba(255,255,255,0.08)',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (form.destinationId !== d.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { if (form.destinationId !== d.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    <span style={{ fontSize: '22px' }}>{d.icon}</span>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: form.destinationId === d.id ? '#c9a84c' : '#eee' }}>{d.label}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{d.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected destination banner */}
            {form.destination && (
              <div style={{
                padding: '14px 18px', borderRadius: '12px', marginBottom: '24px',
                background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <span style={{ color: '#c9a84c', fontWeight: '700' }}>
                  {form.destination} {form.city ? `· ${form.city}` : ''} selected
                </span>
              </div>
            )}

            <button
              className="btn btn-primary"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '14px', opacity: step1Valid ? 1 : 0.4, cursor: step1Valid ? 'pointer' : 'not-allowed' }}
            >
              Next: Set Dates & Guests →
            </button>
          </div>
        )}

        {/* ══ STEP 2 — DATES, GUESTS, BUDGET ══════════════════ */}
        {step === 2 && (
          <div style={panelStyle}>
            <h2 style={panelTitle}>📅 Plan Your Trip to <em style={{ color: '#c9a84c', fontStyle: 'normal' }}>{form.destination}</em></h2>

            {/* Dates */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>🗓️ Travel Dates</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input type="date" value={form.startDate} min={today}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value, endDate: '' }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input type="date" value={form.endDate}
                    min={form.startDate || today}
                    disabled={!form.startDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    style={{ ...inputStyle, opacity: form.startDate ? 1 : 0.5 }}
                  />
                </div>
              </div>
              {tripDays > 0 && (
                <div style={{
                  marginTop: '12px', padding: '10px 16px', borderRadius: '10px',
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                  color: '#c9a84c', fontWeight: '700', fontSize: '14px',
                }}>
                  🗓️ {tripDays} day{tripDays !== 1 ? 's' : ''} trip · {form.startDate} → {form.endDate}
                </div>
              )}
            </div>

            {/* Travelers */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>👥 Travelers</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[{ key: 'adults', label: 'Adults', min: 1, max: 10 }, { key: 'children', label: 'Children', min: 0, max: 8 }].map(({ key, label, min, max }) => (
                  <div key={key} style={{ flex: 1, minWidth: '140px' }}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                      <button onClick={() => setForm(f => ({ ...f, [key]: Math.max(min, f[key] - 1) }))}
                        style={counterBtn}>−</button>
                      <span style={{ fontSize: '24px', fontWeight: '800', color: '#fff', minWidth: '28px', textAlign: 'center' }}>
                        {form[key]}
                      </span>
                      <button onClick={() => setForm(f => ({ ...f, [key]: Math.min(max, f[key] + 1) }))}
                        style={counterBtn}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Type */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>🧳 Travel Type</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {TRAVEL_TYPES.map(t => (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, travelType: t.id }))}
                    style={{
                      padding: '10px 20px', borderRadius: '30px', border: '1.5px solid',
                      borderColor: form.travelType === t.id ? '#c9a84c' : 'rgba(255,255,255,0.12)',
                      background: form.travelType === t.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      color: form.travelType === t.id ? '#c9a84c' : '#ccc',
                      fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {t.icon} {t.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>💰 Budget Preference</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {BUDGETS.map(b => (
                  <button key={b.id} onClick={() => setForm(f => ({ ...f, budget: b.id }))}
                    style={{
                      padding: '18px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                      border: `2px solid ${form.budget === b.id ? b.color : 'rgba(255,255,255,0.08)'}`,
                      background: form.budget === b.id ? `${b.color}18` : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: form.budget === b.id ? b.color : '#eee', marginBottom: '6px' }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{b.desc}</div>
                    <div style={{ fontSize: '12px', color: form.budget === b.id ? b.color : '#666', fontWeight: '600' }}>{b.range}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Validation message */}
            {!step2Valid && form.startDate && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', fontSize: '14px', marginBottom: '16px' }}>
                ⚠️ Please select a valid end date that is after the start date.
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}
                style={{ padding: '14px 24px', borderRadius: '12px', fontWeight: '700' }}>
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!step2Valid || generating}
                style={{
                  flex: 1, padding: '16px', borderRadius: '14px', border: 'none',
                  background: step2Valid && !generating ? 'linear-gradient(135deg, #c9a84c, #8b6914)' : 'rgba(255,255,255,0.1)',
                  color: step2Valid && !generating ? '#000' : '#555',
                  fontSize: '16px', fontWeight: '800', cursor: step2Valid && !generating ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.2s', boxShadow: step2Valid && !generating ? '0 4px 20px rgba(201,168,76,0.35)' : 'none',
                }}>
                {generating ? (
                  <>
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: '2.5px solid rgba(0,0,0,0.3)', borderTopColor: '#000',
                      display: 'inline-block', animation: 'spin 0.8s linear infinite',
                    }} />
                    Generating your itinerary…
                  </>
                ) : '✨ Generate My Itinerary →'}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3 — ITINERARY ═══════════════════════════════ */}
        {step === 3 && itinerary && (
          <div>
            {/* Header */}
            <div style={{ ...panelStyle, marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                    Your {itinerary.days}-Day Heritage Journey ✨
                  </h2>
                  <p style={{ color: '#aaa', fontSize: '15px', margin: 0 }}>
                    📍 {itinerary.destination} · 👥 {form.adults} Adults{form.children > 0 ? `, ${form.children} Children` : ''}
                    · {BUDGETS.find(b => b.id === form.budget)?.label} · {form.travelType}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => setStep(2)}
                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#ccc', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    ← Modify
                  </button>
                  <Link to="/hotels" className="btn btn-primary" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '14px' }}>🏨 Book Hotel</Link>
                  <Link to="/flights" style={{ padding: '10px 18px', borderRadius: '10px', background: '#0d7377', color: '#fff', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>✈️ Book Flight</Link>
                </div>
              </div>
            </div>

            {/* Budget Tips */}
            <div style={{
              padding: '16px 20px', borderRadius: '14px', marginBottom: '24px',
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
            }}>
              <p style={{ color: '#c9a84c', fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>
                💡 {BUDGETS.find(b => b.id === form.budget)?.label} Travel Tips:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexWrap: 'wrap', gap: '6px 40px' }}>
                {itinerary.budgetTips.map((t, i) => (
                  <li key={i} style={{ color: '#ccc', fontSize: '14px' }}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Quick booking bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              {[
                { to: `/hotels?destination=${encodeURIComponent(itinerary.city)}`, label: '🏨 Book Hotel' },
                { to: '/flights', label: '✈️ Search Flights' },
                { to: '/trains', label: '🚂 Search Trains' },
                { to: '/local-transport', label: '🚗 Cabs & Rentals' },
              ].map(btn => (
                <Link key={btn.to} to={btn.to}
                  style={{
                    padding: '10px 20px', borderRadius: '30px', textDecoration: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#ddd', fontWeight: '600', fontSize: '14px',
                    border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = '#c9a84c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#ddd'; }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>

            {/* Day cards (accordion) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {itinerary.itinerary.map(dayPlan => {
                const isOpen = expandedDay === dayPlan.day;
                const dayDate = form.startDate
                  ? new Date(new Date(form.startDate).getTime() + (dayPlan.day - 1) * 86400000)
                    .toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                  : null;

                return (
                  <div key={dayPlan.day} style={{
                    borderRadius: '16px', overflow: 'hidden',
                    border: `1.5px solid ${isOpen ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: isOpen ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s',
                  }}>
                    {/* Day header */}
                    <button
                      onClick={() => setExpandedDay(isOpen ? null : dayPlan.day)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: isOpen ? 'linear-gradient(135deg,#c9a84c,#8b6914)' : 'rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '16px', color: isOpen ? '#000' : '#fff',
                          flexShrink: 0,
                        }}>{dayPlan.day}</div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '16px', color: isOpen ? '#c9a84c' : '#eee' }}>
                            Day {dayPlan.day}
                            {dayDate && <span style={{ color: '#888', fontWeight: '500', fontSize: '13px', marginLeft: '10px' }}>{dayDate}</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                            {dayPlan.activities.length} activities planned
                          </div>
                        </div>
                      </div>
                      <span style={{ color: '#c9a84c', fontSize: '18px', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        ▾
                      </span>
                    </button>

                    {/* Activities */}
                    {isOpen && (
                      <div style={{ padding: '0 22px 20px' }}>
                        <div style={{ position: 'relative' }}>
                          {/* Vertical line */}
                          <div style={{ position: 'absolute', left: '15px', top: 0, bottom: 0, width: '2px', background: 'rgba(201,168,76,0.2)' }} />

                          {dayPlan.activities.map((act, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', paddingLeft: '40px', position: 'relative', marginBottom: '18px' }}>
                              {/* Dot */}
                              <div style={{
                                position: 'absolute', left: '10px', top: '4px',
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: TYPE_COLORS[act.type] || TYPE_COLORS.default,
                                border: '2px solid rgba(14,17,24,0.8)',
                              }} />

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '16px' }}>{act.icon}</span>
                                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{act.activity}</span>
                                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: `${TYPE_COLORS[act.type] || TYPE_COLORS.default}22`, color: TYPE_COLORS[act.type] || TYPE_COLORS.default, fontWeight: '600', border: `1px solid ${TYPE_COLORS[act.type] || TYPE_COLORS.default}44` }}>
                                    {act.type}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', color: '#888', fontSize: '13px' }}>
                                  <span>🕐 {act.time}</span>
                                  <span>⏱ {act.duration}</span>
                                </div>
                                {act.notes && (
                                  <div style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: '#aaa', fontSize: '13px', borderLeft: '3px solid rgba(201,168,76,0.5)' }}>
                                    💡 {act.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', padding: '32px', borderRadius: '16px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '15px' }}>
                🎉 Your itinerary is ready! Save it to your dashboard or start booking.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/dashboard" className="btn btn-primary" style={{ borderRadius: '12px' }}>📊 View Dashboard →</Link>
                <button onClick={() => { setStep(1); setItinerary(null); setForm(f => ({ ...f, destination: '', destinationId: '', city: '' })); setQuery(''); }}
                  style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#ccc', fontWeight: '600', cursor: 'pointer' }}>
                  🔄 Plan Another Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

/* ── Shared micro-styles ── */
const panelStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '20px', padding: '32px',
  marginBottom: '24px',
};
const panelTitle = { fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' };
const panelSub = { color: '#888', fontSize: '15px', marginBottom: '28px' };
const sectionStyle = {
  marginBottom: '28px', paddingBottom: '28px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};
const sectionTitle = { fontSize: '15px', fontWeight: '700', color: '#ccc', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' };
const labelStyle = { display: 'block', fontSize: '13px', color: '#888', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '15px', fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
  colorScheme: 'dark',
};
const counterBtn = {
  width: '36px', height: '36px', borderRadius: '50%', fontSize: '20px',
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s',
};
