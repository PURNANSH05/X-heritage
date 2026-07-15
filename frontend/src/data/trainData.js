/* ── HeritageX Train Data ── */
/* IRCTC-style realistic Indian train data */

export const STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi' },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' },
  { code: 'AGC', name: 'Agra Cantonment', city: 'Agra' },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur' },
  { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal' },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
];

export const COACH_TYPES = [
  { code: 'SL', label: 'Sleeper (SL)', description: 'Budget sleeper berths', icon: '🛏️' },
  { code: '3A', label: 'AC 3 Tier (3A)', description: 'Air-conditioned 3-tier berths', icon: '❄️' },
  { code: '2A', label: 'AC 2 Tier (2A)', description: 'Air-conditioned 2-tier berths', icon: '🌬️' },
  { code: '1A', label: 'First AC (1A)', description: 'Premium private cabins', icon: '👑' },
  { code: 'CC', label: 'Chair Car (CC)', description: 'Day travel reclining seats', icon: '💺' },
  { code: 'EC', label: 'Executive Chair (EC)', description: 'Premium day travel', icon: '✨' },
];

const BASE_FARES = { SL: 280, '3A': 750, '2A': 1100, '1A': 2100, CC: 520, EC: 1050 };
const ROUTE_MULTIPLIERS = {
  'NDLS-CSMT': 2.8, 'NDLS-SBC': 3.5, 'NDLS-MAS': 4.1, 'NDLS-SC': 3.2,
  'NDLS-HWH': 2.4, 'NDLS-ADI': 2.1, 'NDLS-JP': 1.3, 'NDLS-ASR': 1.5,
  'NDLS-BSB': 1.8, 'NDLS-LKO': 1.6, 'NDLS-AGC': 1.1, 'CSMT-SBC': 2.2,
  'CSMT-MAS': 3.1, 'CSMT-HWH': 3.8, 'SBC-MAS': 1.4, 'SBC-SC': 1.6,
  'HWH-MAS': 3.5, 'HWH-SC': 2.8, 'ADI-CSMT': 1.5, 'ADI-NDLS': 2.1,
};

export const FAMOUS_TRAINS = [
  { number: '12951', name: 'Mumbai Rajdhani', from: 'NDLS', to: 'BCT', dep: '16:55', arr: '08:00+1', duration: '15h 05m', type: 'Rajdhani', classes: ['1A','2A','3A'], runDays: 'Daily' },
  { number: '12301', name: 'Howrah Rajdhani', from: 'NDLS', to: 'HWH', dep: '16:55', arr: '09:55+1', duration: '17h 00m', type: 'Rajdhani', classes: ['1A','2A','3A'], runDays: 'Daily' },
  { number: '12001', name: 'Bhopal Shatabdi', from: 'NDLS', to: 'BPL', dep: '06:00', arr: '13:55', duration: '7h 55m', type: 'Shatabdi', classes: ['EC','CC'], runDays: 'Daily except Sun' },
  { number: '12259', name: 'Sealdah Duronto', from: 'NDLS', to: 'SDAH', dep: '22:00', arr: '17:30+1', duration: '19h 30m', type: 'Duronto', classes: ['1A','2A','3A','SL'], runDays: 'Fri, Sun' },
  { number: '22691', name: 'Rajdhani Express', from: 'NDLS', to: 'SBC', dep: '20:00', arr: '09:05+1', duration: '37h 05m', type: 'Rajdhani', classes: ['1A','2A','3A'], runDays: 'Daily' },
  { number: '12627', name: 'Karnataka Express', from: 'NDLS', to: 'SBC', dep: '22:30', arr: '04:30+2', duration: '42h 00m', type: 'Express', classes: ['SL','3A','2A','1A'], runDays: 'Daily' },
  { number: '12002', name: 'New Delhi Shatabdi', from: 'BPL', to: 'NDLS', dep: '15:00', arr: '22:55', duration: '7h 55m', type: 'Shatabdi', classes: ['EC','CC'], runDays: 'Daily except Sun' },
  { number: '12925', name: 'Paschim Express', from: 'CSMT', to: 'ASR', dep: '23:05', arr: '17:45+1', duration: '42h 40m', type: 'Express', classes: ['SL','3A','2A','1A'], runDays: 'Daily' },
  { number: '12003', name: 'Lucknow Shatabdi', from: 'NDLS', to: 'LKO', dep: '06:10', arr: '12:30', duration: '6h 20m', type: 'Shatabdi', classes: ['EC','CC'], runDays: 'Daily except Sun' },
  { number: '12381', name: 'Poorva Express', from: 'HWH', to: 'NDLS', dep: '20:15', arr: '14:55+1', duration: '42h 40m', type: 'Express', classes: ['SL','3A','2A','1A'], runDays: 'Tue, Fri' },
  { number: '12565', name: 'Bihar Sampark Kranti', from: 'PNBE', to: 'NDLS', dep: '15:40', arr: '06:10+1', duration: '14h 30m', type: 'Express', classes: ['SL','3A','2A'], runDays: 'Daily' },
  { number: '12009', name: 'Shatabdi Express', from: 'NDLS', to: 'ASR', dep: '07:20', arr: '13:05', duration: '5h 45m', type: 'Shatabdi', classes: ['EC','CC'], runDays: 'Daily' },
  { number: '12279', name: 'Taj Express', from: 'NDLS', to: 'AGC', dep: '07:15', arr: '09:50', duration: '2h 35m', type: 'Express', classes: ['CC','2A'], runDays: 'Daily' },
  { number: '12015', name: 'Ajmer Shatabdi', from: 'NDLS', to: 'AII', dep: '06:05', arr: '12:35', duration: '6h 30m', type: 'Shatabdi', classes: ['EC','CC'], runDays: 'Daily' },
  { number: '12549', name: 'Doon Express', from: 'NDLS', to: 'DDN', dep: '22:00', arr: '06:00+1', duration: '8h 00m', type: 'Express', classes: ['SL','3A','2A','1A'], runDays: 'Daily' },
];

export function generateAvailability(classes) {
  const statuses = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'WL', 'RAC', 'WL', 'AVAILABLE'];
  return classes.reduce((acc, cls) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const count = status === 'AVAILABLE' ? Math.floor(5 + Math.random() * 80) : Math.floor(Math.random() * 40) + 1;
    acc[cls] = { status, count, label: status === 'AVAILABLE' ? `${count} Avail` : `${status} ${count}` };
    return acc;
  }, {});
}

export function getTrainFares(classes, fromCode, toCode) {
  const routeKey = `${fromCode}-${toCode}`;
  const revKey = `${toCode}-${fromCode}`;
  const multiplier = ROUTE_MULTIPLIERS[routeKey] || ROUTE_MULTIPLIERS[revKey] || 2.0;
  return classes.reduce((acc, cls) => {
    const base = BASE_FARES[cls] || 500;
    const variance = Math.floor((Math.random() - 0.5) * 100);
    acc[cls] = Math.round((base * multiplier + variance) / 5) * 5;
    return acc;
  }, {});
}

export function searchTrains(fromCode, toCode) {
  return FAMOUS_TRAINS.filter(t =>
    (t.from === fromCode && t.to === toCode) ||
    (t.from === toCode && t.to === fromCode)
  ).concat(
    // Add generic trains for any route
    Array.from({ length: 3 }, (_, i) => ({
      number: `1${String(2200 + Math.floor(Math.random() * 800)).padStart(4, '0')}`,
      name: `${['Jan Shatabdi', 'Intercity', 'Mail Express', 'Superfast', 'Sampark Kranti'][i % 5]} Express`,
      from: fromCode,
      to: toCode,
      dep: ['06:30', '14:15', '21:45'][i],
      arr: ['13:15', '21:00', '06:30+1'][i],
      duration: ['6h 45m', '6h 45m', '8h 45m'][i],
      type: ['Shatabdi', 'Express', 'Mail'][i % 3],
      classes: ['SL', '3A', '2A', '1A'].slice(0, 3 + (i % 2)),
      runDays: ['Daily', 'Mon, Wed, Fri, Sun', 'Tue, Thu, Sat'][i % 3],
    }))
  ).map(train => ({
    ...train,
    availability: generateAvailability(train.classes),
    fares: getTrainFares(train.classes, fromCode, toCode),
  }));
}
