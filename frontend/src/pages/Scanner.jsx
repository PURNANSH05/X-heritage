import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useScanner } from '../hooks/useScanner.js';
import Icon from '../components/Icon.jsx';
import SmartImage from '../components/SmartImage.jsx';

/* ── Animated scan-line that sweeps inside the viewfinder ── */
function ScanLine({ active }) {
  return active ? <div className="sf-scanline" aria-hidden="true" /> : null;
}

/* ── Corner brackets overlay ── */
function Corners() {
  return (
    <div className="sf-corners" aria-hidden="true">
      <span className="sf-corner sf-tl" />
      <span className="sf-corner sf-tr" />
      <span className="sf-corner sf-bl" />
      <span className="sf-corner sf-br" />
    </div>
  );
}

/* ── Status badge that floats over the viewfinder ── */
function StatusBadge({ status, isScanning }) {
  const cfg = isScanning
    ? { icon: 'loading', text: 'Scanning…', cls: 'sf-badge-scanning' }
    : status === 'matched'
      ? { icon: 'confirmed', text: 'Match Found!', cls: 'sf-badge-matched' }
      : status === 'failed'
        ? { icon: 'close', text: 'No Match', cls: 'sf-badge-failed' }
        : { icon: 'circle', text: 'Ready', cls: 'sf-badge-idle' };

  return (
    <div className={`sf-badge ${cfg.cls}`} aria-live="polite">
      <span className="sf-badge-dot" />
      <span><Icon name={cfg.icon} size={14} /> {cfg.text}</span>
    </div>
  );
}

/* ── Mode icons for the tab pills ── */
const MODES = [
  { id: 'camera', icon: 'camera', label: 'Live Camera' },
  { id: 'upload', icon: 'image',  label: 'Upload Photo' },
  { id: 'search', icon: 'search', label: 'Text Search'  },
];

export default function Scanner() {
  const { query, setQuery, result, status, scan, suggestions } = useScanner();
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const webcamRef = useRef(null);
  const inputRef  = useRef(null);

  const [mode,         setMode]         = useState('camera');
  const [previewUrl,   setPreviewUrl]   = useState(null);
  const [previewName,  setPreviewName]  = useState('');
  const [cameraError,  setCameraError]  = useState(null);
  const [isScanning,   setIsScanning]   = useState(false);
  const [scanFlash,    setScanFlash]    = useState(false);
  const [dragOver,     setDragOver]     = useState(false);

  /* Clean up blob URL on unmount / change */
  useEffect(() => () => { if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const resultSite = useMemo(() => (status === 'matched' && result) ? result : null, [result, status]);

  /* ── Switch mode ── */
  const switchMode = useCallback((m) => {
    setMode(m);
    setPreviewUrl(null);
    setPreviewName('');
    setCameraError(null);
    if (m === 'search') setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  /* ── Camera capture ── */
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    setScanFlash(true);
    setTimeout(() => setScanFlash(false), 280);
    const shot = webcamRef.current.getScreenshot();
    if (!shot) return;
    setPreviewUrl(shot);
    setPreviewName('Camera capture');
    setIsScanning(true);
    await scan(query.trim() || 'heritage monument');
    setIsScanning(false);
  }, [query, scan]);

  /* ── File processing ── */
  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewName(file.name);
    const clean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
    setIsScanning(true);
    await scan(query.trim() || clean || 'heritage monument');
    setIsScanning(false);
  }, [previewUrl, query, scan]);

  const handleFileInput = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = '';
  }, [processFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  /* ── Text search submit ── */
  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsScanning(true);
    await scan(query);
    setIsScanning(false);
  }, [query, scan]);

  /* ── Clear state ── */
  const handleClear = useCallback(() => {
    setPreviewUrl(null);
    setPreviewName('');
    setQuery('');
  }, [setQuery]);

  return (
    <div className="sc-root">

      {/* ══ PAGE HERO BANNER ══ */}
      <div className="sc-hero">
        <div className="sc-hero-glow sc-hero-glow-1" />
        <div className="sc-hero-glow sc-hero-glow-2" />
        <div className="sc-hero-inner container">
          <div className="sc-hero-badge"><Icon name="landmark" size={16} /> AI Heritage Scanner</div>
          <h1 className="sc-hero-title">Identify Any Heritage Site</h1>
          <p className="sc-hero-sub">
            Point your camera at a monument, upload a photo, or type its name —
            our AI will identify it and show you its full story.
          </p>

          {/* ── Method tabs ── */}
          <div className="sc-tabs" role="tablist" aria-label="Scan method">
            {MODES.map(m => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                className={`sc-tab ${mode === m.id ? 'sc-tab-active' : ''}`}
                onClick={() => switchMode(m.id)}
              >
                <span className="sc-tab-icon"><Icon name={m.icon} size={17} /></span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="sc-body container">

        {/* ── LEFT: Viewfinder + controls ── */}
        <div className="sc-left">

          {/* ── CAMERA MODE ── */}
          {mode === 'camera' && (
            <div className="sc-panel">
              <div className="sc-panel-header">
                <span className="sc-panel-icon"><Icon name="camera" size={19} /></span>
                <div>
                  <strong>Live Camera</strong>
                  <span>Allow camera access and capture any monument</span>
                </div>
              </div>

              {/* Viewfinder */}
              <div className="sc-viewfinder">
                {scanFlash && <div className="sc-flash" />}
                <Corners />
                <ScanLine active={isScanning} />
                <StatusBadge status={status} isScanning={isScanning} />

                {previewUrl ? (
                  <img src={previewUrl} alt="Captured" className="sc-vf-media" />
                ) : cameraError ? (
                  <div className="sc-vf-error">
                    <span className="sc-vf-error-icon"><Icon name="camera" size={22} /></span>
                    <strong>Camera Unavailable</strong>
                    <p>Your browser blocked camera access, or no camera is connected.</p>
                    <button type="button" className="sc-link" onClick={() => switchMode('upload')}>
                      Upload a photo instead →
                    </button>
                  </div>
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.92}
                    videoConstraints={{ facingMode: 'environment', width: 1280, height: 720 }}
                    className="sc-vf-media"
                    onUserMediaError={(err) => setCameraError(err?.message || 'Not accessible')}
                  />
                )}

                {/* Scanning pulse ring */}
                {isScanning && <div className="sc-pulse-ring" />}
              </div>

              {/* Preview info bar */}
              {previewUrl && (
                <div className="sc-preview-bar">
                  <span className="sc-preview-name"><Icon name="camera" size={14} /> {previewName}</span>
                  <button type="button" className="sc-clear-btn" onClick={handleClear}>✕ Clear</button>
                </div>
              )}

              {/* Camera action buttons */}
              <div className="sc-cam-actions">
                <button
                  type="button"
                  className="sc-capture-btn"
                  onClick={handleCapture}
                  disabled={isScanning || !!cameraError}
                >
                  {isScanning ? (
                    <><span className="sc-spinner" /> Analysing…</>
                  ) : (
                    <><span className="sc-capture-circle" /> Capture &amp; Scan</>
                  )}
                </button>
                <button
                  type="button"
                  className="sc-secondary-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={isScanning}
                >
                  <><Icon name="image" size={16} /> Upload Instead</>
                </button>
              </div>
            </div>
          )}

          {/* ── UPLOAD MODE ── */}
          {mode === 'upload' && (
            <div className="sc-panel">
              <div className="sc-panel-header">
                <span className="sc-panel-icon"><Icon name="image" size={19} /></span>
                <div>
                  <strong>Upload a Photo</strong>
                  <span>JPG, PNG, WEBP — drop or click to select</span>
                </div>
              </div>

              {previewUrl ? (
                <>
                  <div className="sc-viewfinder">
                    {isScanning && <><div className="sc-flash sc-flash-soft" /><ScanLine active={true} /></>}
                    <Corners />
                    <StatusBadge status={status} isScanning={isScanning} />
                    <img src={previewUrl} alt="Uploaded" className="sc-vf-media" />
                    {isScanning && <div className="sc-pulse-ring" />}
                  </div>
                  <div className="sc-preview-bar">
                    <span className="sc-preview-name"><Icon name="image" size={14} /> {previewName.length > 36 ? previewName.slice(0, 36) + '…' : previewName}</span>
                    <button type="button" className="sc-clear-btn" onClick={handleClear}>✕ Clear</button>
                  </div>
                </>
              ) : (
                <div
                  className={`sc-dropzone ${dragOver ? 'sc-dropzone-over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                  aria-label="Upload photo"
                >
                  <div className="sc-dropzone-icon"><Icon name="landmark" size={28} /></div>
                  <strong className="sc-dropzone-title">Drop your photo here</strong>
                  <p className="sc-dropzone-sub">or click to browse files</p>
                  <div className="sc-dropzone-formats">
                    <span>JPG</span><span>PNG</span><span>WEBP</span><span>GIF</span>
                  </div>
                </div>
              )}

              <div className="sc-cam-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="sc-capture-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={isScanning}
                >
                  {isScanning ? <><span className="sc-spinner" /> Analysing…</> : <><Icon name="image" size={16} /> Choose Photo</>}
                </button>
              </div>
            </div>
          )}

          {/* ── SEARCH MODE ── */}
          {mode === 'search' && (
            <div className="sc-panel">
              <div className="sc-panel-header">
                <span className="sc-panel-icon"><Icon name="search" size={19} /></span>
                <div>
                  <strong>Search by Name</strong>
                  <span>Type any monument, city, or country</span>
                </div>
              </div>

              <form className="sc-search-form" onSubmit={handleSearch}>
                <div className="sc-search-wrap">
                  <span className="sc-search-icon"><Icon name="search" size={17} /></span>
                  <input
                    ref={inputRef}
                    className="sc-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Taj Mahal, Colosseum, Machu Picchu…"
                    autoComplete="off"
                  />
                  {query && (
                    <button type="button" className="sc-search-clear" onClick={() => setQuery('')}>✕</button>
                  )}
                </div>
                <button type="submit" className="sc-capture-btn" disabled={isScanning || !query.trim()}>
                  {isScanning ? <><span className="sc-spinner" /> Searching…</> : <><Icon name="search" size={16} /> Search</>}
                </button>
              </form>

              {/* Live suggestions */}
              {query.trim() && suggestions.length > 0 && !resultSite && (
                <div className="sc-live-suggestions">
                  <p className="sc-live-suggestions-label">Suggested matches</p>
                  {suggestions.slice(0, 6).map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className="sc-live-item"
                      onClick={() => { setQuery(s.name.en); handleSearch(); }}
                    >
                      <span className="sc-live-item-icon">🏛️</span>
                      <div>
                        <strong>{s.name.en}</strong>
                        <span>{s.city}, {s.country}</span>
                      </div>
                      <span className="sc-live-item-arrow">→</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular searches when no query */}
              {!query.trim() && (
                <div className="sc-popular">
                  <p className="sc-popular-label">Popular searches</p>
                  <div className="sc-popular-chips">
                    {['Taj Mahal', 'Colosseum', 'Eiffel Tower', 'Great Wall', 'Machu Picchu', 'Angkor Wat'].map(name => (
                      <button key={name} type="button" className="sc-popular-chip"
                        onClick={() => { setQuery(name); setTimeout(handleSearch, 50); }}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESULT PANEL ── */}
          {resultSite && (
            <div className="sc-result-panel">
              <div className="sc-result-header">
                <div className="sc-result-match-badge">✓ Heritage Site Identified</div>
              </div>
              <div className="sc-result-body">
                {resultSite.heroImage && (
                  <div className="sc-result-image-wrap">
                    <SmartImage
                      src={resultSite.heroImage}
                      fallback={resultSite.photos?.[0]?.url || resultSite.photos?.[0]}
                      alt={resultSite.name?.en}
                      className="sc-result-image"
                      site={resultSite}
                    />
                    <div className="sc-result-image-overlay" />
                  </div>
                )}
                <div className="sc-result-info">
                  <h2 className="sc-result-name">{resultSite.name?.en}</h2>
                  <div className="sc-result-meta">
                    <span>📍 {resultSite.city}, {resultSite.country}</span>
                    <span>🏛️ {resultSite.category}</span>
                    {resultSite.rating && <span>★ {resultSite.rating.toFixed(1)}</span>}
                  </div>
                  <p className="sc-result-desc">{resultSite.description?.en?.slice(0, 200)}…</p>
                  <div className="sc-result-stats">
                    {resultSite.openingHours && (
                      <div className="sc-result-stat">
                        <span className="sc-result-stat-label">Hours</span>
                        <span>{resultSite.openingHours.slice(0, 40)}</span>
                      </div>
                    )}
                    {resultSite.bestTimeToVisit && (
                      <div className="sc-result-stat">
                        <span className="sc-result-stat-label">Best Time</span>
                        <span>{resultSite.bestTimeToVisit.slice(0, 40)}</span>
                      </div>
                    )}
                    {resultSite.estimatedDuration && (
                      <div className="sc-result-stat">
                        <span className="sc-result-stat-label">Duration</span>
                        <span>{resultSite.estimatedDuration}</span>
                      </div>
                    )}
                  </div>
                  <div className="sc-result-actions">
                    <button
                      type="button"
                      className="sc-capture-btn"
                      onClick={() => navigate(`/site/${resultSite.id}`)}
                    >
                      Explore Full Details →
                    </button>
                    <button type="button" className="sc-secondary-btn" onClick={handleClear}>
                      New Scan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── No match warning ── */}
          {status === 'failed' && !isScanning && (
            <div className="sc-no-match">
              <span className="sc-no-match-icon">🔍</span>
              <div>
                <strong>No heritage site matched</strong>
                <p>Try a different photo, check the spelling, or choose from the suggestions on the right.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="sc-sidebar">

          {/* How it works */}
          <div className="sc-sidebar-card">
            <h3 className="sc-sidebar-title">How It Works</h3>
            <div className="sc-steps">
              <div className="sc-step">
                <div className="sc-step-num">1</div>
                <div>
                  <strong>Choose a method</strong>
                  <span>Camera, upload, or search</span>
                </div>
              </div>
              <div className="sc-step-line" />
              <div className="sc-step">
                <div className="sc-step-num">2</div>
                <div>
                  <strong>Point or type</strong>
                  <span>Aim at a monument or enter its name</span>
                </div>
              </div>
              <div className="sc-step-line" />
              <div className="sc-step">
                <div className="sc-step-num">3</div>
                <div>
                  <strong>Discover history</strong>
                  <span>View full details, audio guide &amp; map</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supported sites */}
          <div className="sc-sidebar-card">
            <h3 className="sc-sidebar-title">Quick Access</h3>
            <p className="sc-sidebar-sub">Click any site to jump directly to its details</p>
            <div className="sc-quick-list">
              {suggestions.slice(0, 8).map(site => (
                <button
                  key={site.id}
                  type="button"
                  className="sc-quick-item"
                  onClick={() => navigate(`/site/${site.id}`)}
                >
                  <div className="sc-quick-dot" />
                  <div className="sc-quick-info">
                    <strong>{site.name.en}</strong>
                    <span>{site.city}, {site.country}</span>
                  </div>
                  <span className="sc-quick-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips card */}
          <div className="sc-sidebar-card sc-tips-card">
            <h3 className="sc-sidebar-title">📸 Tips for Best Results</h3>
            <ul className="sc-tips">
              <li>Ensure good lighting on the monument</li>
              <li>Frame the main structure clearly</li>
              <li>Avoid heavy motion blur</li>
              <li>For text search, use the English monument name</li>
              <li>Try zooming in if the AI misses details</li>
            </ul>
          </div>

        </aside>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileInput} />
    </div>
  );
}
