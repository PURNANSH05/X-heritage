import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';

export default function NavBar() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const compact = location.pathname === '/scanner';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const NAV_SECTIONS = [
    {
      label: t('nav.explore'),
      items: [
        { to: '/', label: t('nav.home'), icon: '🏛️', end: true },
        { to: '/search', label: t('nav.destinations'), icon: '🔍' },
        { to: '/scanner', label: t('nav.scanner'), icon: '📷' },
        { to: '/favorites', label: t('nav.favorites'), icon: '❤️' },
      ],
    },
    {
      label: t('nav.bookTravel'),
      items: [
        { to: '/trip-planner', label: t('nav.tripPlanner'), icon: '🗺️' },
        { to: '/flights', label: t('nav.flights'), icon: '✈️' },
        { to: '/trains', label: t('nav.trains'), icon: '🚂' },
        { to: '/buses', label: t('nav.buses'), icon: '🚌' },
        { to: '/hotels', label: t('nav.hotels'), icon: '🏨' },
        { to: '/local-transport', label: t('nav.cabs'), icon: '🚗' },
      ],
    },
    {
      label: t('nav.account'),
      items: [
        { to: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
        { to: '/about', label: t('nav.about'), icon: 'ℹ️' },
        { to: '/security', label: '🛡️ Security & Trust', icon: '🔒' },
        { to: '/privacy', label: 'Privacy Policy', icon: '📋' },
      ],
    },
  ];
  const dropRef = useRef(null);
  const sidebarRef = useRef(null);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    setDropOpen(false);
    setSidebarOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Show admin link if applicable
  const isAdmin = user?.email?.includes('admin') || user?.email === 'demo@heritagex.com';

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <header className={`nav-shell ${compact ? 'nav-shell-compact' : ''}`} style={{
        position: 'sticky', top: 0, zIndex: 900,
        background: 'var(--nav-bg, rgba(10,10,15,0.96))',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
      }}>
        <div className="container nav-inner" style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '60px' }}>
          
          {/* Hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '5px',
              padding: '8px', borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#fff', borderRadius: '2px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: sidebarOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#fff', borderRadius: '2px',
              transition: 'opacity 0.3s',
              opacity: sidebarOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#fff', borderRadius: '2px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: sidebarOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>

          {/* Logo / Brand */}
          <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.svg" alt="HeritageX" className="brand-mark" />
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right: Language + User */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageSelector />

            {user && (
              <div className="nav-user" ref={dropRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="nav-avatar"
                  onClick={() => setDropOpen(v => !v)}
                  aria-expanded={dropOpen}
                  aria-label="User menu"
                >
                  <span className="nav-avatar-initials">{user.avatar || user.name?.[0] || '?'}</span>
                  <span className="nav-avatar-name">{user.name?.split(' ')[0]}</span>
                  <span className="nav-avatar-chevron">{dropOpen ? '▲' : '▼'}</span>
                </button>

                {dropOpen && (
                  <div className="nav-dropdown" role="menu">
                    <div className="nav-dropdown-header">
                      <span className="nav-dropdown-avatar">{user.avatar}</span>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to="/dashboard" className="nav-dropdown-item" onClick={() => setDropOpen(false)} role="menuitem">
                      📊 My Dashboard
                    </Link>
                    <Link to="/favorites" className="nav-dropdown-item" onClick={() => setDropOpen(false)} role="menuitem">
                      ❤️ My Favorites
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="nav-dropdown-item" onClick={() => setDropOpen(false)} role="menuitem">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <div className="nav-dropdown-divider" />
                    <button type="button" className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout} role="menuitem">
                      ⏏ Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── BACKDROP ─────────────────────────────────────────── */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 950,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(3px)',
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── SIDEBAR DRAWER ───────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '280px', zIndex: 960,
          background: 'linear-gradient(160deg, #0d0f13 0%, #13161d 60%, #0e1118 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: sidebarOpen ? '4px 0 40px rgba(0,0,0,0.6)' : 'none',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="HeritageX" style={{ height: '32px', width: '32px' }} />
            <span style={{ fontWeight: '800', fontSize: '18px', color: '#c9a84c', letterSpacing: '0.5px' }}>
              HeritageX
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', cursor: 'pointer', color: '#aaa', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            ✕
          </button>
        </div>

        {/* User Info Strip */}
        {user && (
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(201,168,76,0.06)',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a84c, #8b6914)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700', color: '#000', flexShrink: 0,
            }}>
              {user.avatar || user.name?.[0] || '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Nav Sections */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div style={{
                padding: '14px 20px 6px',
                fontSize: '10px', fontWeight: '700', letterSpacing: '1.4px',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              }}>
                {section.label}
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '11px 20px',
                    margin: '2px 10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px', fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.75)',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid #c9a84c' : '3px solid transparent',
                    transition: 'all 0.18s ease',
                  })}
                  onMouseEnter={e => {
                    if (!e.currentTarget.style.borderLeft.includes('#c9a84c')) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!e.currentTarget.style.borderLeft.includes('#c9a84c')) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px', width: '22px', textAlign: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Admin link if applicable */}
          {isAdmin && (
            <div>
              <div style={{
                padding: '14px 20px 6px',
                fontSize: '10px', fontWeight: '700', letterSpacing: '1.4px',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              }}>
                {t('nav.admin')}
              </div>
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '11px 20px', margin: '2px 10px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '14px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.75)',
                  background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #c9a84c' : '3px solid transparent',
                  transition: 'all 0.18s ease',
                })}
              >
                <span style={{ fontSize: '18px', width: '22px', textAlign: 'center' }}>⚙️</span>
                {t('nav.admin')}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Sidebar Footer — Sign Out */}
        {user && (
          <div style={{ padding: '12px 20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Security Badge */}
          <div style={{
            margin: '0 10px 10px',
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.18)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>🔒</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#86efac' }}>SSL Secured</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>256-bit TLS 1.3 encryption</div>
            </div>
          </div>
          <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%', padding: '11px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.18)',
                borderRadius: '10px', cursor: 'pointer', color: '#ff6b6b',
                fontSize: '14px', fontWeight: '600', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,60,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,60,60,0.08)'}
            >
              <span style={{ fontSize: '16px' }}>⏏</span> {t('nav.signOut')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
