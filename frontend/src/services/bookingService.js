/* ── HeritageX Booking Service ── */
/* Handles all booking operations with localStorage persistence */

const BOOKINGS_KEY = 'heritagex_bookings';
const BOOKING_COUNTER_KEY = 'heritagex_booking_counter';

function getCounter() {
  return parseInt(localStorage.getItem(BOOKING_COUNTER_KEY) || '1000', 10);
}

function nextCounter() {
  const c = getCounter() + 1;
  localStorage.setItem(BOOKING_COUNTER_KEY, String(c));
  return c;
}

export function getAllBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getUserBookings(userEmail) {
  return getAllBookings().filter(b => b.userEmail === userEmail);
}

export function getBookingById(bookingId) {
  return getAllBookings().find(b => b.id === bookingId) || null;
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function createBooking(type, details, userEmail, userName) {
  const bookings = getAllBookings();
  const id = `HX${String(nextCounter()).padStart(6, '0')}`;
  const booking = {
    id,
    type, // 'flight' | 'train' | 'bus' | 'hotel' | 'cab'
    status: 'Confirmed',
    userEmail,
    userName,
    createdAt: new Date().toISOString(),
    ...details,
  };
  bookings.unshift(booking);
  saveBookings(bookings);
  return booking;
}

export function cancelBooking(bookingId, userEmail) {
  const bookings = getAllBookings();
  const idx = bookings.findIndex(b => b.id === bookingId && b.userEmail === userEmail);
  if (idx === -1) return { ok: false, error: 'Booking not found' };
  bookings[idx].status = 'Cancelled';
  bookings[idx].cancelledAt = new Date().toISOString();
  bookings[idx].refundStatus = 'Processing';
  saveBookings(bookings);
  return { ok: true, booking: bookings[idx] };
}

export function addSampleBookings(userEmail, userName) {
  const existing = getUserBookings(userEmail);
  if (existing.length > 0) return; // already seeded

  const samples = [
    {
      type: 'flight',
      status: 'Confirmed',
      userEmail, userName,
      id: `HX${String(nextCounter()).padStart(6, '0')}`,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      flightNumber: '6E204',
      airline: 'IndiGo',
      from: 'DEL', to: 'GOI',
      departure: '07:15', arrival: '09:25',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelClass: 'Economy',
      passengers: 2,
      price: 8600,
      pnr: `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
    {
      type: 'hotel',
      status: 'Confirmed',
      userEmail, userName,
      id: `HX${String(nextCounter()).padStart(6, '0')}`,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      hotelName: 'Taj Exotica Resort & Spa',
      destination: 'Goa',
      checkin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkout: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      roomType: 'Deluxe Room',
      guests: 2, rooms: 1, nights: 3,
      pricePerNight: 26000,
      price: 78000,
    },
    {
      type: 'train',
      status: 'Completed',
      userEmail, userName,
      id: `HX${String(nextCounter()).padStart(6, '0')}`,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      trainName: 'Mumbai Rajdhani',
      trainNumber: '12951',
      from: 'NDLS', to: 'BCT',
      departure: '16:55', arrival: '08:00',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      coachType: '2A',
      passengers: 1,
      price: 1800,
      pnr: `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
  ];

  const bookings = getAllBookings();
  bookings.unshift(...samples);
  saveBookings(bookings);
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getBookingTypeLabel(type) {
  const labels = { flight: '✈️ Flight', train: '🚂 Train', bus: '🚌 Bus', hotel: '🏨 Hotel', cab: '🚗 Cab' };
  return labels[type] || type;
}

export function getStatusColor(status) {
  const colors = {
    Confirmed: '#00a651',
    Pending: '#f5a623',
    Cancelled: '#e31837',
    Completed: '#0051a5',
    Processing: '#9b59b6',
  };
  return colors[status] || '#666';
}
