/* ── HeritageX Flight Data ── */
/* Realistic mock data for Indian domestic & international routes */

export const AIRPORTS = [
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', state: 'Delhi' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', state: 'Telangana' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', state: 'West Bengal' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'GOI', name: 'Goa International', city: 'Goa', state: 'Goa' },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International', city: 'Amritsar', state: 'Punjab' },
  { code: 'VNS', name: 'Lal Bahadur Shastri International', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International', city: 'Nagpur', state: 'Maharashtra' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra' },
  { code: 'IXC', name: 'Chandigarh International', city: 'Chandigarh', state: 'Chandigarh' },
  { code: 'STV', name: 'Surat Airport', city: 'Surat', state: 'Gujarat' },
  { code: 'IDR', name: 'Devi Ahilya Bai Holkar', city: 'Indore', state: 'Madhya Pradesh' },
  { code: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'BHO', name: 'Raja Bhoj International', city: 'Bhopal', state: 'Madhya Pradesh' },
];

export const AIRLINES = [
  { code: 'AI', name: 'Air India', logo: '🇮🇳', color: '#e31837', rating: 4.1 },
  { code: '6E', name: 'IndiGo', logo: '🔵', color: '#0051a5', rating: 4.3 },
  { code: 'SG', name: 'SpiceJet', logo: '🌶️', color: '#e31837', rating: 3.9 },
  { code: 'UK', name: 'Vistara', logo: '✈️', color: '#6b2d90', rating: 4.5 },
  { code: 'G8', name: 'GoAir', logo: '🟠', color: '#ff6600', rating: 3.8 },
  { code: 'I5', name: 'Air Asia India', logo: '🔴', color: '#ff0000', rating: 4.0 },
  { code: '9W', name: 'Jet Airways', logo: '🟡', color: '#f5a623', rating: 4.2 },
];

const SEAT_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class'];
const CLASS_MULTIPLIERS = { Economy: 1, 'Premium Economy': 1.7, Business: 3.2, 'First Class': 5.5 };

function generateFlightNumber(airlineCode) {
  return `${airlineCode}${Math.floor(100 + Math.random() * 900)}`;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function formatDuration(mins) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/* Generate flights for a given route */
export function generateFlights(fromCode, toCode, date, travelClass = 'Economy') {
  // Route-based base prices (in INR)
  const routePrices = {
    'DEL-BOM': 3800, 'BOM-DEL': 3800,
    'DEL-BLR': 4200, 'BLR-DEL': 4200,
    'DEL-MAA': 5100, 'MAA-DEL': 5100,
    'DEL-HYD': 4400, 'HYD-DEL': 4400,
    'DEL-CCU': 3600, 'CCU-DEL': 3600,
    'DEL-GOI': 5500, 'GOI-DEL': 5500,
    'DEL-JAI': 2200, 'JAI-DEL': 2200,
    'DEL-AMD': 3200, 'AMD-DEL': 3200,
    'DEL-VNS': 2800, 'VNS-DEL': 2800,
    'DEL-ATQ': 2500, 'ATQ-DEL': 2500,
    'BOM-BLR': 3400, 'BLR-BOM': 3400,
    'BOM-HYD': 3100, 'HYD-BOM': 3100,
    'BOM-GOI': 2900, 'GOI-BOM': 2900,
    'BOM-CCU': 5200, 'CCU-BOM': 5200,
    'BLR-MAA': 2600, 'MAA-BLR': 2600,
    'BLR-HYD': 2800, 'HYD-BLR': 2800,
    'HYD-MAA': 2700, 'MAA-HYD': 2700,
    'CCU-BLR': 4800, 'BLR-CCU': 4800,
    'AMD-BOM': 2800, 'BOM-AMD': 2800,
    'LKO-DEL': 2400, 'DEL-LKO': 2400,
    'NAG-DEL': 3500, 'DEL-NAG': 3500,
  };

  const routeDurations = {
    'DEL-BOM': 130, 'BOM-DEL': 135,
    'DEL-BLR': 175, 'BLR-DEL': 165,
    'DEL-MAA': 200, 'MAA-DEL': 195,
    'DEL-HYD': 165, 'HYD-DEL': 160,
    'DEL-CCU': 140, 'CCU-DEL': 135,
    'DEL-GOI': 165, 'GOI-DEL': 170,
    'DEL-JAI': 65,  'JAI-DEL': 65,
    'DEL-AMD': 105, 'AMD-DEL': 100,
    'DEL-VNS': 75,  'VNS-DEL': 70,
    'DEL-ATQ': 70,  'ATQ-DEL': 65,
    'BOM-BLR': 95,  'BLR-BOM': 90,
    'BOM-HYD': 80,  'HYD-BOM': 85,
    'BOM-GOI': 55,  'GOI-BOM': 55,
    'BOM-CCU': 180, 'CCU-BOM': 175,
    'BLR-MAA': 60,  'MAA-BLR': 60,
    'BLR-HYD': 60,  'HYD-BLR': 55,
    'HYD-MAA': 65,  'MAA-HYD': 65,
    'CCU-BLR': 160, 'BLR-CCU': 155,
    'AMD-BOM': 70,  'BOM-AMD': 70,
    'LKO-DEL': 70,  'DEL-LKO': 65,
    'NAG-DEL': 115, 'DEL-NAG': 110,
  };

  const routeKey = `${fromCode}-${toCode}`;
  const basePrice = routePrices[routeKey] || 4500;
  const baseDuration = routeDurations[routeKey] || 150;
  const multiplier = CLASS_MULTIPLIERS[travelClass] || 1;

  const departureTimes = ['05:30', '07:15', '09:00', '10:45', '13:30', '16:00', '18:30', '20:45', '22:15'];
  const selectedTimes = departureTimes.sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 3));

  return selectedTimes.sort().map((depTime, idx) => {
    const airline = AIRLINES[idx % AIRLINES.length];
    const durationVariance = Math.floor((Math.random() - 0.5) * 20);
    const duration = baseDuration + durationVariance;
    const priceVariance = Math.floor((Math.random() - 0.3) * 800);
    const price = Math.max(1500, Math.round((basePrice + priceVariance) * multiplier / 100) * 100);
    const availSeats = Math.floor(5 + Math.random() * 120);
    const stopType = Math.random() > 0.65 ? 'non-stop' : '1 stop';
    const layoverCity = stopType === '1 stop' ? ['BOM', 'DEL', 'HYD', 'BLR'].find(c => c !== fromCode && c !== toCode) || 'HYD' : null;

    return {
      id: `FL-${fromCode}-${toCode}-${idx + 1}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      airlineColor: airline.color,
      airlineRating: airline.rating,
      flightNumber: generateFlightNumber(airline.code),
      from: fromCode,
      to: toCode,
      departure: depTime,
      arrival: addMinutes(depTime, duration),
      duration: formatDuration(duration),
      durationMins: duration,
      stops: stopType,
      layover: layoverCity,
      price,
      travelClass,
      availableSeats: availSeats,
      seatsLabel: availSeats < 10 ? `Only ${availSeats} left!` : `${availSeats} seats`,
      seatsUrgent: availSeats < 10,
      baggage: travelClass === 'Economy' ? '15 kg check-in + 7 kg cabin' : '23 kg check-in + 10 kg cabin',
      refundable: Math.random() > 0.5,
      meal: travelClass !== 'Economy' ? 'Complimentary meal' : (Math.random() > 0.5 ? 'Meal available (paid)' : 'Snacks only'),
      onTime: Math.floor(70 + Math.random() * 25),
    };
  }).sort((a, b) => a.price - b.price);
}

export const POPULAR_ROUTES = [
  { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai' },
  { from: 'BOM', to: 'GOI', label: 'Mumbai → Goa' },
  { from: 'DEL', to: 'JAI', label: 'Delhi → Jaipur' },
  { from: 'BLR', to: 'MAA', label: 'Bengaluru → Chennai' },
  { from: 'DEL', to: 'VNS', label: 'Delhi → Varanasi' },
  { from: 'DEL', to: 'ATQ', label: 'Delhi → Amritsar' },
];
