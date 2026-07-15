import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/* ─── Floating particle for the animated background ─── */
function Particle({ style }) {
  return <div className="login-particle" style={style} />;
}

/* ─── Heritage monument silhouettes (SVG inline) ─── */
const MonumentSVG = () => (
  <svg
    viewBox="0 0 900 340"
    xmlns="http://www.w3.org/2000/svg"
    className="login-monuments"
    aria-hidden="true"
    preserveAspectRatio="xMidYMax meet"
  >
    {/* Taj Mahal center */}
    <g opacity="0.55" fill="currentColor">
      <ellipse cx="450" cy="162" rx="38" ry="42" />
      <rect x="430" y="200" width="40" height="80" />
      <rect x="390" y="210" width="20" height="60" />
      <rect x="490" y="210" width="20" height="60" />
      <ellipse cx="400" cy="208" rx="12" ry="14" />
      <ellipse cx="500" cy="208" rx="12" ry="14" />
      <rect x="370" y="260" width="160" height="12" />
      <rect x="355" y="268" width="190" height="8" rx="2" />
      {/* minarets */}
      <rect x="345" y="200" width="12" height="80" />
      <ellipse cx="351" cy="198" rx="8" ry="14" />
      <rect x="543" y="200" width="12" height="80" />
      <ellipse cx="549" cy="198" rx="8" ry="14" />
    </g>

    {/* Eiffel Tower left */}
    <g opacity="0.35" fill="currentColor" transform="translate(80,20)">
      <polygon points="60,260 80,260 90,160 50,160" />
      <polygon points="50,160 90,160 82,80 58,80" />
      <polygon points="58,80 82,80 72,20 68,20" />
      <rect x="40" y="155" width="60" height="8" />
      <rect x="48" y="100" width="44" height="6" />
    </g>

    {/* Colosseum right */}
    <g opacity="0.32" fill="currentColor" transform="translate(620,60)">
      <ellipse cx="100" cy="130" rx="110" ry="75" />
      <ellipse cx="100" cy="130" rx="85" ry="55" fill="none" stroke="currentColor" strokeWidth="12" />
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={30 + i * 22} y="80" width="10" height="95" opacity="0.5" />
      ))}
    </g>

    {/* Pyramid far left */}
    <g opacity="0.28" fill="currentColor" transform="translate(-30, 80)">
      <polygon points="70,240 170,240 120,80" />
      <polygon points="30,240 130,240 80,100" opacity="0.6" />
    </g>

    {/* Big Ben far right */}
    <g opacity="0.3" fill="currentColor" transform="translate(760, 40)">
      <rect x="30" y="60" width="50" height="200" />
      <rect x="20" y="40" width="70" height="25" />
      <rect x="35" y="15" width="40" height="30" />
      <polygon points="45,0 55,15 75,15 85,0" />
      <rect x="5" y="250" width="100" height="12" />
    </g>

    {/* Ground line */}
    <rect x="0" y="272" width="900" height="3" opacity="0.4" />
  </svg>
);

/* ─── Main Login Page ─── */
export default function Login() {
  const { login, register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);

  // Already logged in → redirect
  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError('');
    setForm({ name: '', email: '', password: '', confirm: '' });
    setTimeout(() => emailRef.current?.focus(), 80);
  }, [mode]);

  const handleChange = useCallback((e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');

      if (mode === 'register') {
        if (!form.name.trim()) return setError('Please enter your full name.');
        if (!form.email.trim()) return setError('Please enter your email address.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        if (form.password !== form.confirm) return setError('Passwords do not match.');

        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // UX delay
        const res = register(form.name, form.email, form.password);
        setLoading(false);
        if (!res.ok) return setError(res.error);
        setSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 700);
      } else {
        if (!form.email.trim()) return setError('Please enter your email address.');
        if (!form.password) return setError('Please enter your password.');

        setLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        const res = login(form.email, form.password);
        setLoading(false);
        if (!res.ok) return setError(res.error);
        setSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 700);
      }
    },
    [mode, form, login, register, navigate]
  );

  const fillDemo = useCallback(() => {
    setForm((f) => ({ ...f, email: 'demo@heritagex.com', password: 'heritage123' }));
    setError('');
  }, []);

  // Random particles
  const particles = Array.from({ length: 18 }, (_, i) => ({
    width: `${6 + (i % 5) * 4}px`,
    height: `${6 + (i % 5) * 4}px`,
    left: `${(i * 347) % 100}%`,
    top: `${(i * 173) % 100}%`,
    animationDelay: `${(i * 0.7) % 6}s`,
    animationDuration: `${8 + (i % 4) * 3}s`,
    opacity: 0.12 + (i % 4) * 0.07
  }));

  return (
    <div className="login-root">
      {/* ── Left Panel: Branding ── */}
      <div className="login-left">
        {/* Animated background particles */}
        <div className="login-particles" aria-hidden="true">
          {particles.map((p, i) => <Particle key={i} style={p} />)}
        </div>

        {/* Monument Silhouettes */}
        <MonumentSVG />

        {/* Brand Content */}
        <div className="login-brand">
          <div className="login-logo-wrap">
            <img src="/logo.svg" alt="HeritageX" className="login-logo" />
          </div>

          <div className="login-brand-text">
            <h1 className="login-tagline">
              Discover the World's
              <br />
              <span className="login-tagline-accent">Greatest Heritage</span>
            </h1>
            <p className="login-tagline-sub">
              Scan monuments, explore history, and uncover the stories behind the world's most remarkable sites.
            </p>
          </div>

          {/* Stats */}
          <div className="login-stats">
            <div className="login-stat">
              <strong>42+</strong>
              <span>UNESCO Sites</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <strong>16</strong>
              <span>Languages</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <strong>AI</strong>
              <span>Scanner</span>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="login-orb login-orb-1" aria-hidden="true" />
        <div className="login-orb login-orb-2" aria-hidden="true" />
        <div className="login-orb login-orb-3" aria-hidden="true" />
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          {/* Mobile Logo */}
          <div className="login-mobile-logo">
            <img src="/logo.svg" alt="HeritageX" />
          </div>

          {/* Mode Toggle */}
          <div className="login-toggle-bar">
            <button
              type="button"
              className={`login-toggle ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`login-toggle ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="login-heading">
            <h2>
              {mode === 'login' ? 'Welcome back' : 'Join HeritageX'}
            </h2>
            <p>
              {mode === 'login'
                ? 'Sign in to continue your heritage journey.'
                : 'Create your free account and start exploring.'}
            </p>
          </div>

          {/* Demo Banner (login mode only) */}
          {mode === 'login' && (
            <button type="button" className="login-demo-banner" onClick={fillDemo}>
              <span className="login-demo-icon">🚀</span>
              <div>
                <strong>Try the demo account</strong>
                <span>demo@heritagex.com · heritage123</span>
              </div>
              <span className="login-demo-arrow">→</span>
            </button>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Name field (register only) */}
            {mode === 'register' && (
              <div className="login-field">
                <label htmlFor="login-name">Full Name</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">👤</span>
                  <input
                    id="login-name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉️</span>
                <input
                  id="login-email"
                  ref={emailRef}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-header">
                <label htmlFor="login-password">Password</label>
                {mode === 'login' && (
                  <button type="button" className="login-forgot">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  id="login-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password (register) */}
            {mode === 'register' && (
              <div className="login-field">
                <label htmlFor="login-confirm">Confirm Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="login-confirm"
                    name="confirm"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember me (login) */}
            {mode === 'login' && (
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
            )}

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="login-success" role="status">
                <span>✅</span>{' '}
                {mode === 'login' ? 'Welcome back! Redirecting…' : 'Account created! Redirecting…'}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`login-submit ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : success ? (
                '✓ Welcome!'
              ) : mode === 'login' ? (
                'Sign In →'
              ) : (
                'Create My Account →'
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="login-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')}>
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')}>
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          <p className="login-terms">
            By continuing, you agree to our{' '}
            <button type="button" className="login-link">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="login-link">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
