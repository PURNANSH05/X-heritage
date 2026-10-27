/* TripPlanner.jsx — Complete AI Trip Planning Wizard */
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { sites } from '../data/sites.js';
import Icon from '../components/Icon.jsx';

/* ── Constants ──────────────────────────────────────────────── */
const BUDGETS = [
  { id: 'budget', label: 'Budget', icon: 'luggage', desc: 'Hostels · Auto · Street food', color: '#27ae60', range: '₹500–1,500/day' },
  { id: 'premium', label: 'Premium', icon: 'star', desc: 'Hotels · Cab · Restaurants', color: '#0d7377', range: '₹2,000–5,000/day' },
  { id: 'luxury', label: 'Luxury', icon: 'sparkles', desc: 'Resorts · Chauffeur · Fine dining', color: '#c9a84c', range: '₹8,000+/day' },
];

const TRAVEL_TYPES = [
  { id: 'Solo', icon: 'user' }, { id: 'Couple', icon: 'heart' },
  { id: 'Family', icon: 'family' }, { id: 'Friends Group', icon: 'users' },
  { id: 'Honeymoon', icon: 'heart' }, { id: 'Business', icon: 'business' },
];

const QUICK_DESTS = [
  { label: 'Taj Mahal', city: 'Agra', icon: 'landmark', id: 'taj-mahal-01' },
  { label: 'Jaipur', city: 'Rajasthan', icon: 'castle', id: 'jaipur-city-05' },
  { label: 'Varanasi', city: 'Uttar Pradesh', icon: 'landmark', id: 'varanasi-ghats-03' },
  { label: 'Goa Beaches', city: 'Goa', icon: 'waves', id: 'goa-beaches-22' },
  { label: 'Hampi', city: 'Karnataka', icon: 'landmark', id: 'hampi-ruins-15' },
  { label: 'Khajuraho', city: 'Madhya Pradesh', icon: 'landmark', id: 'khajuraho-temples-13' },
  { label: 'Mysore Palace', city: 'Karnataka', icon: 'castle', id: 'mysore-palace-26' },
  { label: 'Delhi', city: 'Delhi', icon: 'landmark', id: 'delhi-red-fort-09' },
];

/* ── Data-backed itinerary builder ── */
const CATEGORY_ICONS = {
  Monument: 'landmark', Fortress: 'castle', Temple: 'landmark', Palace: 'castle',
  'Religious Site': 'landmark', 'Archaeological Site': 'landmark', Beach: 'waves',
  'Hill Station': 'mountain', Landmark: 'mapPin', 'Historic Site': 'landmark',
};

function getDestinationSites(form) {
  const selected = sites.find(site => site.id === form.destinationId);
  const city = selected?.city || form.city;
  const country = selected?.country;
  const matchingSites = selected
    ? sites.filter(site => site.city === city && (!country || site.country === country))
    : sites.filter(site =>
        (site.name?.en || '').toLowerCase() === form.destination.toLowerCase() ||
        site.city?.toLowerCase() === form.destination.toLowerCase()
      );

  const uniqueSites = new Map();
  for (const site of [selected, ...matchingSites].filter(Boolean)) {
    const key = `${site.city}:${(site.name?.en || '').toLowerCase()}`;
    if (!uniqueSites.has(key)) uniqueSites.set(key, site);
  }
  return [...uniqueSites.values()];
}

function buildItinerary(form) {
  const days = (() => {
    if (!form.startDate || !form.endDate) return 2;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(1, Math.ceil(diff / 86400000));
  })();

  const destinationSites = getDestinationSites(form);
  const destName = form.destination || 'Your Destination';
  const cityName = destinationSites[0]?.city || form.city || destName;

  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    const daySites = destinationSites.slice((d - 1) * 2, d * 2);
    const activities = daySites.map((site, index) => ({
      time: index === 0 ? '09:00' : '14:00',
      activity: `Visit ${site.name?.en || 'Heritage site'}`,
      type: 'Heritage',
      icon: CATEGORY_ICONS[site.category] || 'mapPin',
      duration: site.estimatedDuration || 'Check site guidance',
      notes: [site.category, site.openingHours, site.visitorTips?.en || site.visitorTips]
        .filter(Boolean)
        .join(' · '),
      siteId: site.id,
      mapUrl: site.googleMapsLink,
    }));

    if (activities.length === 2) {
      activities.splice(1, 0, {
        time: '12:00', activity: 'Lunch and rest break', type: 'Leisure',
        icon: 'utensils', duration: '1.5h', notes: 'Choose a nearby meal stop; allow time for local travel.',
      });
    }
    if (activities.length === 0) {
      activities.push({
        time: '09:00', activity: 'Unscheduled time / departure buffer',
        type: 'Leisure', icon: 'luggage', duration: 'Flexible',
        notes: 'The destination catalog has no additional listed sites for this day. Avoids suggesting unverified attractions.',
      });
    }

    itinerary.push({
      day: d,
      activities,
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
    setForm(f => ({ ...f, destination: val, destinationId: '', city: '' }));
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
  const step1Valid = sites.some(site => site.id === form.destinationId);
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
          }}><Icon name="map" size={15} /> AI Trip Planner</span>
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
            <h2 style={panelTitle}><Icon name="landmark" size={21} /> Where do you want to go?</h2>
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
                <Icon name="search" size={18} />
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
                      <Icon name="mapPin" size={18} />
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
                    <Icon name={d.icon} size={21} />
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
                <Icon name="confirmed" size={20} />
                <span style={{ color: '#c9a84c', fontWeight: '700' }}>
                  {form.destination} {form.city ? `· ${form.city}` : ''} selected
                </span>
              </div>
            )}

            {form.destination && !step1Valid && (
              <p style={{ color: '#e5b95c', fontSize: '13px', margin: '-12px 0 20px' }}>
                Choose a destination from the suggestions so the itinerary uses verified places in the catalog.
              </p>
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
            <h2 style={panelTitle}><Icon name="calendar" size={21} /> Plan Your Trip to <em style={{ color: '#c9a84c', fontStyle: 'normal' }}>{form.destination}</em></h2>

            {/* Dates */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}><Icon name="calendar" size={18} /> Travel Dates</h3>
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
                  <Icon name="calendar" size={15} /> {tripDays} day{tripDays !== 1 ? 's' : ''} trip · {form.startDate} → {form.endDate}
                </div>
              )}
            </div>

            {/* Travelers */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}><Icon name="users" size={18} /> Travelers</h3>
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
              <h3 style={sectionTitle}><Icon name="luggage" size={18} /> Travel Type</h3>
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
                    <Icon name={t.icon} size={16} /> {t.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div style={sectionStyle}>
              <h3 style={sectionTitle}><Icon name="payments" size={18} /> Budget Preference</h3>
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
                      <Icon name={b.icon} size={17} /> {b.label}
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
                <Icon name="warning" size={16} /> Please select a valid end date that is after the start date.
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
                ) : <><Icon name="sparkles" size={17} /> Generate My Itinerary →</>}
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
                    Your {itinerary.days}-Day Heritage Journey
                  </h2>
                  <p style={{ color: '#aaa', fontSize: '15px', margin: 0 }}>
                    <Icon name="mapPin" size={15} /> {itinerary.destination} · <Icon name="users" size={15} /> {form.adults} Adults{form.children > 0 ? `, ${form.children} Children` : ''}
                    · {BUDGETS.find(b => b.id === form.budget)?.label} · {form.travelType}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => setStep(2)}
                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#ccc', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    ← Modify
                  </button>
                  <Link to="/hotels" className="btn btn-primary" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '14px' }}><Icon name="hotel" size={16} /> Book Hotel</Link>
                  <Link to="/flights" style={{ padding: '10px 18px', borderRadius: '10px', background: '#0d7377', color: '#fff', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}><Icon name="plane" size={16} /> Book Flight</Link>
                </div>
              </div>
            </div>

            {/* Budget Tips */}
            <div style={{
              padding: '16px 20px', borderRadius: '14px', marginBottom: '24px',
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
            }}>
              <p style={{ color: '#c9a84c', fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>
                <Icon name="info" size={16} /> {BUDGETS.find(b => b.id === form.budget)?.label} Travel Tips:
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
                { to: `/hotels?destination=${encodeURIComponent(itinerary.city)}`, label: 'Book Hotel', icon: 'hotel' },
                { to: '/flights', label: 'Search Flights', icon: 'plane' },
                { to: '/trains', label: 'Search Trains', icon: 'train' },
                { to: '/local-transport', label: 'Cabs & Rentals', icon: 'car' },
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
                  <Icon name={btn.icon} size={16} /> {btn.label}
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
                                  <Icon name={act.icon} size={17} />
                                  {act.siteId ? (
                                    <Link to={`/site/${act.siteId}`} style={{ color: '#fff', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
                                      {act.activity}
                                    </Link>
                                  ) : (
                                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{act.activity}</span>
                                  )}
                                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: `${TYPE_COLORS[act.type] || TYPE_COLORS.default}22`, color: TYPE_COLORS[act.type] || TYPE_COLORS.default, fontWeight: '600', border: `1px solid ${TYPE_COLORS[act.type] || TYPE_COLORS.default}44` }}>
                                    {act.type}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', color: '#888', fontSize: '13px' }}>
                                  <span><Icon name="clock" size={14} /> {act.time}</span>
                                  <span><Icon name="timer" size={14} /> {act.duration}</span>
                                </div>
                                {act.notes && (
                                  <div style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: '#aaa', fontSize: '13px', borderLeft: '3px solid rgba(201,168,76,0.5)' }}>
                                    <Icon name="info" size={14} /> {act.notes}
                                  </div>
                                )}
                                {act.mapUrl && (
                                  <a href={act.mapUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#c9a84c', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                                    <Icon name="mapPin" size={14} /> Open map
                                  </a>
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
                <Icon name="celebration" size={17} /> Your itinerary is ready! Save it to your dashboard or start booking.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/dashboard" className="btn btn-primary" style={{ borderRadius: '12px' }}><Icon name="layoutDashboard" size={16} /> View Dashboard →</Link>
                <button onClick={() => { setStep(1); setItinerary(null); setForm(f => ({ ...f, destination: '', destinationId: '', city: '' })); setQuery(''); }}
                  style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#ccc', fontWeight: '600', cursor: 'pointer' }}>
                  <Icon name="activity" size={16} /> Plan Another Trip
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
