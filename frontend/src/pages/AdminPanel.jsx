/* AdminPanel.jsx — Admin dashboard for platform management */
import { useState } from 'react';
import { getAllBookings, formatPrice, getBookingTypeLabel } from '../services/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { sites } from '../data/sites.js';

const ADMIN_TABS = ['Overview', 'Bookings', 'Destinations', 'Users', 'Analytics'];

/* Simple bar chart using CSS */
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="admin-bar-chart">
      {data.map(d => (
        <div key={d.label} className="admin-bar-item">
          <div className="admin-bar-track">
            <div
              className="admin-bar-fill"
              style={{ height: `${Math.round((d.value / max) * 100)}%`, background: d.color || 'var(--teal)' }}
            />
          </div>
          <span className="admin-bar-label">{d.label}</span>
          <span className="admin-bar-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const allBookings = getAllBookings();

  // Check if user is admin (simple check)
  const isAdmin = user?.email?.includes('admin') || user?.email === 'demo@heritagex.com';

  if (!isAdmin) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 64 }}>🔐</div>
          <h2>Admin Access Required</h2>
          <p>You need admin privileges to access this panel.</p>
          <p style={{ color: '#666', marginTop: 8 }}>Login with <code>demo@heritagex.com</code> to access admin features.</p>
        </div>
      </section>
    );
  }

  const stats = {
    totalBookings: allBookings.length,
    confirmedBookings: allBookings.filter(b => b.status === 'Confirmed').length,
    totalRevenue: allBookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (b.price || 0), 0),
    totalDestinations: sites.length,
    uniqueUsers: new Set(allBookings.map(b => b.userEmail)).size,
    flightBookings: allBookings.filter(b => b.type === 'flight').length,
    hotelBookings: allBookings.filter(b => b.type === 'hotel').length,
    trainBookings: allBookings.filter(b => b.type === 'train').length,
  };

  const chartData = [
    { label: 'Flights', value: stats.flightBookings, color: '#0d7377' },
    { label: 'Hotels', value: stats.hotelBookings, color: '#c9a84c' },
    { label: 'Trains', value: stats.trainBookings, color: '#1a1a2e' },
    { label: 'Buses', value: allBookings.filter(b => b.type === 'bus').length, color: '#e74c3c' },
    { label: 'Cabs', value: allBookings.filter(b => b.type === 'cab').length, color: '#27ae60' },
  ];

  const monthlyRevenue = [
    { label: 'Jan', value: 85000, color: '#0d7377' },
    { label: 'Feb', value: 120000, color: '#0d7377' },
    { label: 'Mar', value: 95000, color: '#0d7377' },
    { label: 'Apr', value: 145000, color: '#0d7377' },
    { label: 'May', value: 180000, color: '#0d7377' },
    { label: 'Jun', value: 220000, color: '#c9a84c' },
  ];

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>⚙️ Admin Panel</h1>
            <p>Platform management and analytics</p>
          </div>
          <div className="admin-header-badge">
            <span>Admin: {user?.name}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {ADMIN_TABS.map(tab => (
            <button
              key={tab}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Overview' && '📊'}
              {tab === 'Bookings' && '📋'}
              {tab === 'Destinations' && '🏛️'}
              {tab === 'Users' && '👥'}
              {tab === 'Analytics' && '📈'}
              {' '}{tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'Overview' && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card stat-blue">
                <span className="admin-stat-icon">📋</span>
                <div>
                  <strong>{stats.totalBookings}</strong>
                  <span>Total Bookings</span>
                </div>
              </div>
              <div className="admin-stat-card stat-green">
                <span className="admin-stat-icon">✅</span>
                <div>
                  <strong>{stats.confirmedBookings}</strong>
                  <span>Confirmed</span>
                </div>
              </div>
              <div className="admin-stat-card stat-gold">
                <span className="admin-stat-icon">💰</span>
                <div>
                  <strong>{formatPrice(stats.totalRevenue)}</strong>
                  <span>Total Revenue</span>
                </div>
              </div>
              <div className="admin-stat-card stat-navy">
                <span className="admin-stat-icon">🏛️</span>
                <div>
                  <strong>{stats.totalDestinations}</strong>
                  <span>Destinations</span>
                </div>
              </div>
              <div className="admin-stat-card stat-purple">
                <span className="admin-stat-icon">👥</span>
                <div>
                  <strong>{Math.max(stats.uniqueUsers, 1)}</strong>
                  <span>Active Users</span>
                </div>
              </div>
              <div className="admin-stat-card stat-teal">
                <span className="admin-stat-icon">⭐</span>
                <div>
                  <strong>4.7</strong>
                  <span>Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="admin-charts-row">
              <div className="admin-chart-card">
                <h3>Bookings by Type</h3>
                <BarChart data={chartData} />
              </div>
              <div className="admin-chart-card">
                <h3>Monthly Revenue (₹)</h3>
                <BarChart data={monthlyRevenue} />
              </div>
            </div>

            {/* Recent bookings */}
            <div className="admin-recent-section">
              <h3>Recent Bookings</h3>
              <table className="payment-table admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.slice(0, 10).map(b => (
                    <tr key={b.id}>
                      <td><code>{b.id}</code></td>
                      <td>{getBookingTypeLabel(b.type)}</td>
                      <td>{b.userEmail || '—'}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{formatPrice(b.price || b.totalPrice || 0)}</td>
                      <td><StatusBadge status={b.status} small /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Bookings management */}
        {activeTab === 'Bookings' && (
          <div className="admin-bookings-section">
            <div className="admin-section-header">
              <h3>All Bookings</h3>
              <span className="admin-count-badge">{allBookings.length} total</span>
            </div>
            <table className="payment-table admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Details</th>
                  <th>Booked On</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(b => (
                  <tr key={b.id}>
                    <td><code>{b.id}</code></td>
                    <td>{getBookingTypeLabel(b.type)}</td>
                    <td style={{ fontSize: 13 }}>{b.userEmail || '—'}</td>
                    <td style={{ fontSize: 12, color: '#666' }}>
                      {b.type === 'flight' && `${b.from} → ${b.to} · ${b.date}`}
                      {b.type === 'hotel' && `${b.hotelName} · ${b.checkin}`}
                      {b.type === 'train' && `${b.trainName} · ${b.date}`}
                      {b.type === 'cab' && `${b.from} → ${b.to}`}
                      {b.type === 'bus' && `${b.from} → ${b.to} · ${b.date}`}
                    </td>
                    <td style={{ fontSize: 13 }}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><strong>{formatPrice(b.price || b.totalPrice || 0)}</strong></td>
                    <td><StatusBadge status={b.status} small /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Destinations */}
        {activeTab === 'Destinations' && (
          <div className="admin-destinations-section">
            <div className="admin-section-header">
              <h3>Heritage Destinations</h3>
              <span className="admin-count-badge">{sites.length} destinations</span>
            </div>
            <table className="payment-table admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.slice(0, 30).map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name?.en}</strong></td>
                    <td>{s.city}</td>
                    <td>{s.country}</td>
                    <td><span className="admin-cat-badge">{s.category}</span></td>
                    <td>⭐ {s.rating?.toFixed(1) || '—'}</td>
                    <td>
                      <a href={`/site/${s.id}`} className="admin-action-link">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users */}
        {activeTab === 'Users' && (
          <div className="admin-users-section">
            <div className="admin-section-header">
              <h3>Platform Users</h3>
            </div>
            <table className="payment-table admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Bookings</th>
                  <th>Total Spent</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {[...new Set(allBookings.map(b => b.userEmail))].filter(Boolean).map(email => {
                  const userBookings = allBookings.filter(b => b.userEmail === email);
                  const spent = userBookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (b.price || 0), 0);
                  const lastBooking = userBookings[0];
                  return (
                    <tr key={email}>
                      <td>{email}</td>
                      <td>{userBookings.length}</td>
                      <td>{formatPrice(spent)}</td>
                      <td style={{ fontSize: 12 }}>{lastBooking ? new Date(lastBooking.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  );
                })}
                {[...new Set(allBookings.map(b => b.userEmail))].filter(Boolean).length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#666' }}>No user data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'Analytics' && (
          <div className="admin-analytics-section">
            <div className="admin-charts-row">
              <div className="admin-chart-card">
                <h3>📊 Booking Distribution</h3>
                <BarChart data={chartData} />
              </div>
              <div className="admin-chart-card">
                <h3>📈 Revenue Trend (2026)</h3>
                <BarChart data={monthlyRevenue} />
              </div>
            </div>
            <div className="admin-analytics-metrics">
              <div className="analytics-metric">
                <span>Conversion Rate</span>
                <strong>68.4%</strong>
              </div>
              <div className="analytics-metric">
                <span>Avg Booking Value</span>
                <strong>{formatPrice(stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0)}</strong>
              </div>
              <div className="analytics-metric">
                <span>Most Popular Destination</span>
                <strong>Goa</strong>
              </div>
              <div className="analytics-metric">
                <span>Peak Booking Time</span>
                <strong>7–9 PM</strong>
              </div>
              <div className="analytics-metric">
                <span>Mobile Traffic</span>
                <strong>74%</strong>
              </div>
              <div className="analytics-metric">
                <span>Repeat Users</span>
                <strong>42%</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
