/* Dashboard.jsx — Professional HeritageX User Dashboard */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserBookings, addSampleBookings, cancelBooking, formatPrice, getBookingTypeLabel } from '../services/bookingService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { openTicketPrintWindow } from '../utils/ticketGenerator.js';

const TABS = ['All Bookings', 'Upcoming', 'Past Trips', 'E-Tickets', 'Payments', 'Profile'];

const TAB_ICONS = {
  'All Bookings': '📋',
  'Upcoming': '🗓️',
  'Past Trips': '🕐',
  'E-Tickets': '🎟️',
  'Payments': '💳',
  'Profile': '👤',
};

/* ── Booking Card ──────────────────────────────────────────── */
function BookingCard({ booking, onCancel }) {
  const isCancellable = booking.status === 'Confirmed';
  const isUpcoming = booking.date && new Date(booking.date) >= new Date();
  const price = booking.price || booking.totalPrice || 0;

  return (
    <div className={`dashboard-booking-card booking-type-${booking.type}`}>

      {/* Header row */}
      <div className="dbc-header">
        <span className="dbc-type">{getBookingTypeLabel(booking.type)}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={booking.status} small />
          {booking.status !== 'Cancelled' && (
            <button
              className="dbc-ticket-btn"
              onClick={() => openTicketPrintWindow(booking)}
              title="Download or Print your E-Ticket as PDF"
            >
              ⬇ E-Ticket
            </button>
          )}
        </div>
      </div>

      {/* Route / Details */}
      <div className="dbc-main">
        {booking.type === 'flight' && (
          <>
            <div className="dbc-route">
              <div className="dbc-city">
                <span className="dbc-city-code">{booking.from}</span>
                <span className="dbc-city-time">{booking.departure}</span>
              </div>
              <div className="dbc-route-mid">
                <span className="dbc-route-line">────✈────</span>
                <span className="dbc-route-class">{booking.travelClass}</span>
              </div>
              <div className="dbc-city dbc-city-right">
                <span className="dbc-city-code">{booking.to}</span>
                <span className="dbc-city-time">{booking.arrival}</span>
              </div>
            </div>
            <div className="dbc-tags">
              <span className="dbc-tag">✈ {booking.airline}</span>
              <span className="dbc-tag">🔢 {booking.flightNumber}</span>
              <span className="dbc-tag">🗓 {booking.date}</span>
              <span className="dbc-tag">👥 {booking.passengers} Pax</span>
              {booking.pnr && <span className="dbc-tag dbc-pnr">PNR: {booking.pnr}</span>}
            </div>
          </>
        )}

        {booking.type === 'train' && (
          <>
            <div className="dbc-route">
              <div className="dbc-city">
                <span className="dbc-city-code">{booking.from}</span>
                <span className="dbc-city-time">{booking.departure}</span>
              </div>
              <div className="dbc-route-mid">
                <span className="dbc-route-line">────🚂────</span>
                <span className="dbc-route-class">{booking.coachType}</span>
              </div>
              <div className="dbc-city dbc-city-right">
                <span className="dbc-city-code">{booking.to}</span>
                <span className="dbc-city-time">{booking.arrival}</span>
              </div>
            </div>
            <div className="dbc-tags">
              <span className="dbc-tag">🚂 {booking.trainName}</span>
              <span className="dbc-tag">🔢 #{booking.trainNumber}</span>
              <span className="dbc-tag">🗓 {booking.date}</span>
              <span className="dbc-tag">👥 {booking.passengers} Pax</span>
              {booking.pnr && <span className="dbc-tag dbc-pnr">PNR: {booking.pnr}</span>}
            </div>
          </>
        )}

        {booking.type === 'hotel' && (
          <>
            <div className="dbc-route">
              <div className="dbc-city" style={{ alignItems: 'flex-start' }}>
                <span className="dbc-city-code" style={{ fontSize: 16 }}>{booking.hotelName}</span>
                <span className="dbc-city-time">📍 {booking.destination}</span>
              </div>
            </div>
            <div className="dbc-tags">
              <span className="dbc-tag">🛏 {booking.roomType}</span>
              <span className="dbc-tag">📅 Check-in: {booking.checkin}</span>
              <span className="dbc-tag">📅 Check-out: {booking.checkout}</span>
              <span className="dbc-tag">🌙 {booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
              <span className="dbc-tag">👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
            </div>
          </>
        )}

        {booking.type === 'bus' && (
          <>
            <div className="dbc-route">
              <div className="dbc-city">
                <span className="dbc-city-code">{booking.from}</span>
                <span className="dbc-city-time">{booking.departure}</span>
              </div>
              <div className="dbc-route-mid">
                <span className="dbc-route-line">────🚌────</span>
                <span className="dbc-route-class">{booking.busType || 'AC Bus'}</span>
              </div>
              <div className="dbc-city dbc-city-right">
                <span className="dbc-city-code">{booking.to}</span>
              </div>
            </div>
            <div className="dbc-tags">
              <span className="dbc-tag">🚌 {booking.operator}</span>
              <span className="dbc-tag">🗓 {booking.date}</span>
              <span className="dbc-tag">👥 {booking.passengers} Pax</span>
            </div>
          </>
        )}

        {booking.type === 'cab' && (
          <>
            <div className="dbc-route">
              <div className="dbc-city">
                <span className="dbc-city-code" style={{ fontSize: 14 }}>{booking.from}</span>
              </div>
              <div className="dbc-route-mid">
                <span className="dbc-route-line">────🚗────</span>
              </div>
              <div className="dbc-city dbc-city-right">
                <span className="dbc-city-code" style={{ fontSize: 14 }}>{booking.to}</span>
              </div>
            </div>
            <div className="dbc-tags">
              <span className="dbc-tag">🚗 {booking.vehicleType}</span>
              {booking.provider && <span className="dbc-tag">📱 {booking.provider}</span>}
              {booking.schedule && <span className="dbc-tag">⏰ {booking.schedule}</span>}
            </div>
          </>
        )}
      </div>

      {/* Footer with prominent Download button */}
      <div className="dbc-footer">
        <div className="dbc-amount">
          <span className="dbc-amount-label">Amount Paid</span>
          <strong className="dbc-amount-value">{formatPrice(price)}</strong>
        </div>
        <div className="dbc-actions">
          {booking.status !== 'Cancelled' && (
            <button
              className="dbc-download-btn"
              onClick={() => openTicketPrintWindow(booking)}
              title="Download PDF E-Ticket"
            >
              📄 Download E-Ticket PDF
            </button>
          )}
          {isCancellable && isUpcoming && (
            <button className="btn dbc-cancel-btn" onClick={() => onCancel(booking.id)}>
              ✕ Cancel
            </button>
          )}
          {booking.status === 'Cancelled' && booking.refundStatus && (
            <span className="dbc-refund-tag">↩ Refund: {booking.refundStatus}</span>
          )}
        </div>
      </div>

      <div className="dbc-id">
        Booking ID: <strong>{booking.id}</strong> &nbsp;·&nbsp; Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
}

/* ── E-Ticket Gallery Card ─────────────────────────────────── */
function ETicketCard({ booking }) {
  const price = booking.price || booking.totalPrice || 0;
  const typeIcons = { flight: '✈️', train: '🚂', hotel: '🏨', bus: '🚌', cab: '🚗' };

  return (
    <div className="eticket-card">
      <div className="eticket-left">
        <div className="eticket-icon">{typeIcons[booking.type] || '🎟️'}</div>
        <div>
          <div className="eticket-type">{getBookingTypeLabel(booking.type)}</div>
          <div className="eticket-route">
            {booking.type === 'hotel'
              ? `${booking.hotelName} · ${booking.destination}`
              : `${booking.from} → ${booking.to}`}
          </div>
          <div className="eticket-date">
            📅 {booking.date || booking.checkin || new Date(booking.createdAt).toLocaleDateString('en-IN')}
          </div>
          <div className="eticket-id">Booking ID: #{booking.id}</div>
        </div>
      </div>
      <div className="eticket-right">
        <div className="eticket-amount">{formatPrice(price)}</div>
        <StatusBadge status={booking.status} small />
        <button
          className="eticket-download-btn"
          onClick={() => openTicketPrintWindow(booking)}
        >
          📄 Download E-Ticket PDF
        </button>
      </div>
    </div>
  );
}

/* ── Main Dashboard ────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [bookings, setBookings] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', city: '' });

  useEffect(() => {
    if (user?.email) {
      addSampleBookings(user.email, user.name);
      setBookings(getUserBookings(user.email));
    }
  }, [user]);

  const handleCancel = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    cancelBooking(bookingId, user.email);
    setBookings(getUserBookings(user.email));
  };

  const today = new Date();
  const upcomingBookings = bookings.filter(b => b.date && new Date(b.date) >= today && b.status !== 'Cancelled');
  const pastBookings = bookings.filter(b => (b.date && new Date(b.date) < today) || b.status === 'Completed' || b.status === 'Cancelled');
  const ticketableBookings = bookings.filter(b => b.status !== 'Cancelled');
  const totalSpent = bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (b.price || b.totalPrice || 0), 0);

  const displayBookings =
    activeTab === 'Upcoming' ? upcomingBookings :
    activeTab === 'Past Trips' ? pastBookings :
    bookings;

  return (
    <section className="section dashboard-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">{user?.name?.[0]?.toUpperCase() || '👤'}</div>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800 }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="dashboard-email">📧 {user?.email}</p>
            </div>
          </div>
          <div className="dashboard-quick-actions">
            <Link to="/trip-planner" className="btn btn-primary">🗺️ Plan New Trip</Link>
            <Link to="/flights" className="btn btn-secondary">✈️ Book Flight</Link>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span className="dst-icon">📋</span>
            <div>
              <strong>{bookings.length}</strong>
              <span>Total Bookings</span>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <span className="dst-icon">🗓️</span>
            <div>
              <strong>{upcomingBookings.length}</strong>
              <span>Upcoming Trips</span>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <span className="dst-icon">🎟️</span>
            <div>
              <strong>{ticketableBookings.length}</strong>
              <span>E-Tickets</span>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <span className="dst-icon">💰</span>
            <div>
              <strong>{formatPrice(totalSpent)}</strong>
              <span>Total Spent</span>
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="dashboard-booking-strip">
          <Link to="/flights" className="dash-strip-btn">✈️ Book Flights</Link>
          <Link to="/trains" className="dash-strip-btn">🚂 Book Trains</Link>
          <Link to="/hotels" className="dash-strip-btn">🏨 Book Hotels</Link>
          <Link to="/buses" className="dash-strip-btn">🚌 Book Buses</Link>
          <Link to="/local-transport" className="dash-strip-btn">🚗 Book Cabs</Link>
          <Link to="/trip-planner" className="dash-strip-btn">🗺️ AI Trip Planner</Link>
        </div>

        {/* ── Tabs ── */}
        <div className="dashboard-tabs" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {TAB_ICONS[tab]} {tab}
            </button>
          ))}
        </div>

        {/* ── All / Upcoming / Past Bookings ── */}
        {['All Bookings', 'Upcoming', 'Past Trips'].includes(activeTab) && (
          <div className="dashboard-bookings-list">
            {displayBookings.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 56 }}>🗺️</div>
                <h3>No {activeTab.toLowerCase()} found</h3>
                <p>{activeTab === 'Upcoming'
                  ? "You don't have any upcoming trips. Start planning now!"
                  : "Your booking history will appear here once you make a booking."}</p>
                <Link to="/trip-planner" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
                  Plan Your First Trip →
                </Link>
              </div>
            ) : (
              displayBookings.map(b => (
                <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
              ))
            )}
          </div>
        )}

        {/* ── E-Tickets Tab ── */}
        {activeTab === 'E-Tickets' && (
          <div>
            <div className="eticket-header-banner">
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🎟️ My E-Tickets</h2>
                <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: 13 }}>
                  Download any ticket as PDF — save to your phone or print for travel.
                </p>
              </div>
              <div className="eticket-count-badge">
                {ticketableBookings.length} ticket{ticketableBookings.length !== 1 ? 's' : ''} available
              </div>
            </div>

            {ticketableBookings.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 56 }}>🎟️</div>
                <h3>No e-tickets yet</h3>
                <p>Book a flight, train, hotel or bus — your e-ticket will appear here for download.</p>
                <Link to="/flights" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
                  Book a Flight →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ticketableBookings.map(b => (
                  <ETicketCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Payments Tab ── */}
        {activeTab === 'Payments' && (
          <div className="dashboard-payment-history">
            <div style={{ overflowX: 'auto' }}>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Booked On</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No payment records found.</td></tr>
                  ) : bookings.map(b => (
                    <tr key={b.id}>
                      <td><code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{b.id}</code></td>
                      <td>{getBookingTypeLabel(b.type)}</td>
                      <td style={{ fontSize: 12, color: '#475569', maxWidth: 200 }}>
                        {b.type === 'flight' ? `${b.from} → ${b.to} · ${b.airline}` :
                         b.type === 'hotel' ? `${b.hotelName} · ${b.destination}` :
                         b.type === 'train' ? `${b.from} → ${b.to} · ${b.trainName}` :
                         `${b.from || ''} → ${b.to || ''}`}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><strong style={{ color: '#0d7377' }}>{formatPrice(b.price || b.totalPrice || 0)}</strong></td>
                      <td><StatusBadge status={b.status} small /></td>
                      <td>
                        {b.status !== 'Cancelled' ? (
                          <button
                            onClick={() => openTicketPrintWindow(b)}
                            className="payment-ticket-btn"
                          >
                            📄 PDF
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}><strong>Total Paid</strong></td>
                    <td><strong style={{ color: '#0d7377', fontSize: 15 }}>{formatPrice(totalSpent)}</strong></td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 'Profile' && (
          <div className="dashboard-profile">
            <div className="profile-card">
              <div className="profile-avatar-large">{user?.name?.[0]?.toUpperCase() || '👤'}</div>
              <h3>{user?.name}</h3>
              <p style={{ color: '#64748b', margin: '4px 0 24px' }}>{user?.email}</p>

              {!editProfile ? (
                <>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <label>Full Name</label>
                      <span>{profileForm.name || user?.name}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Email Address</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Phone Number</label>
                      <span>{profileForm.phone || <em style={{ color: '#94a3b8' }}>Not added</em>}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>City</label>
                      <span>{profileForm.city || <em style={{ color: '#94a3b8' }}>Not added</em>}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Member Since</label>
                      <span>{new Date().getFullYear()}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Total Trips</label>
                      <span>{bookings.length} bookings</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setEditProfile(true)} style={{ marginTop: 20 }}>
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <div className="profile-edit-form">
                  <div className="trip-field">
                    <label>Full Name</label>
                    <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                  </div>
                  <div className="trip-field">
                    <label>Phone Number</label>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="trip-field">
                    <label>City</label>
                    <input value={profileForm.city} onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))} placeholder="Your city" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button className="btn btn-secondary" onClick={() => setEditProfile(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => setEditProfile(false)}>💾 Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
