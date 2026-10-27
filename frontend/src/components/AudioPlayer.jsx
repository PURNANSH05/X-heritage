import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/* ── Language to BCP-47 locale and display name ── */
const LANG_MAP = [
  { label: 'English',            code: 'en-US' },
  { label: 'Hindi',              code: 'hi-IN' },
  { label: 'Arabic',             code: 'ar-SA' },
  { label: 'French',             code: 'fr-FR' },
  { label: 'Spanish',            code: 'es-ES' },
  { label: 'German',             code: 'de-DE' },
  { label: 'Italian',            code: 'it-IT' },
  { label: 'Portuguese',         code: 'pt-BR' },
  { label: 'Japanese',           code: 'ja-JP' },
  { label: 'Chinese (Mandarin)', code: 'zh-CN' },
  { label: 'Korean',             code: 'ko-KR' },
  { label: 'Russian',            code: 'ru-RU' },
  { label: 'Turkish',            code: 'tr-TR' },
  { label: 'Dutch',              code: 'nl-NL' },
  { label: 'Polish',             code: 'pl-PL' },
  { label: 'Gujarati',           code: 'gu-IN' },
];

/* ── Build the full narration script from site data ── */
function buildScript(site) {
  if (!site) return '';
  const name        = site.name?.en        || site.name        || 'This heritage site';
  const city        = site.city             || '';
  const country     = site.country          || '';
  const category    = site.category         || '';
  const description = site.description?.en  || site.description || '';
  const history     = site.history?.en      || site.history     || '';
  const tips        = site.visitorTips?.en  || site.visitorTips || '';
  const hours       = site.openingHours     || '';
  const best        = site.bestTimeToVisit  || '';
  const duration    = site.estimatedDuration|| '';
  const access      = site.accessibility    || '';

  const parts = [];

  parts.push(`Welcome to the HeritageX audio guide for ${name}.`);
  if (city || country) parts.push(`Located in ${[city, country].filter(Boolean).join(', ')}.`);
  if (category)        parts.push(`Category: ${category}.`);

  if (description) {
    parts.push('Overview.');
    parts.push(description);
  }

  if (history) {
    parts.push('Historical background.');
    parts.push(history);
  }

  if (tips) {
    parts.push('Visitor tips.');
    parts.push(tips);
  }

  const practicals = [];
  if (hours)    practicals.push(`Opening hours: ${hours}.`);
  if (best)     practicals.push(`Best time to visit: ${best}.`);
  if (duration) practicals.push(`Estimated visit duration: ${duration}.`);
  if (access)   practicals.push(`Accessibility: ${access}.`);

  if (practicals.length) {
    parts.push('Practical information.');
    parts.push(...practicals);
  }

  parts.push(`Thank you for using HeritageX. Enjoy your visit to ${name}.`);
  return parts.join(' ');
}

/* ── Waveform bars that animate while speaking ── */
function Waveform({ active }) {
  return (
    <div className="ag-waveform" aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className={`ag-bar ${active ? 'ag-bar-active' : ''}`}
          style={{ animationDelay: `${(i * 0.09).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ pct }) {
  return (
    <div className="ag-progress-track">
      <div className="ag-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main AudioPlayer component
   Props: site (full site object), availableLanguages (string[])
══════════════════════════════════════════════════════ */
export default function AudioPlayer({ site, availableLanguages = [] }) {
  const [langCode, setLangCode]       = useState('en-US');
  const [playing, setPlaying]         = useState(false);
  const [paused, setPaused]           = useState(false);
  const [progress, setProgress]       = useState(0);
  const [supported, setSupported]     = useState(true);
  const [voices, setVoices]           = useState([]);
  const [speed, setSpeed]             = useState(1);
  const [charsRead, setCharsRead]     = useState(0);
  const [totalChars, setTotalChars]   = useState(0);
  const [currentLine, setCurrentLine] = useState('');
  const uttRef   = useRef(null);
  const scriptRef = useRef('');
  const timerRef = useRef(null);

  /* Check browser support & load voices */
  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  /* Stop speech when component unmounts or site changes */
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      clearInterval(timerRef.current);
    };
  }, [site]);

  /* Pick the best available voice for a locale */
  const pickVoice = useCallback((code) => {
    const lang = code.split('-')[0];
    return (
      voices.find(v => v.lang === code) ||
      voices.find(v => v.lang.startsWith(lang)) ||
      voices.find(v => v.default) ||
      voices[0] ||
      null
    );
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    clearInterval(timerRef.current);
    setPlaying(false);
    setPaused(false);
    setProgress(0);
    setCharsRead(0);
    setCurrentLine('');
  }, []);

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);

    const script = buildScript(site);
    scriptRef.current = script;
    setTotalChars(script.length);
    setCharsRead(0);
    setProgress(0);

    const utt = new SpeechSynthesisUtterance(script);
    utt.lang  = langCode;
    utt.rate  = speed;
    utt.pitch = 1.05;
    utt.volume = 1;

    const voice = pickVoice(langCode);
    if (voice) utt.voice = voice;

    utt.onboundary = (e) => {
      if (e.name === 'word') {
        const read = e.charIndex + e.charLength;
        setCharsRead(read);
        setProgress(Math.min(100, Math.round((read / script.length) * 100)));
        setCurrentLine(script.substring(Math.max(0, e.charIndex - 40), e.charIndex + 60));
      }
    };

    utt.onstart = () => { setPlaying(true); setPaused(false); };
    utt.onend   = () => { setPlaying(false); setPaused(false); setProgress(100); setCurrentLine(''); clearInterval(timerRef.current); };
    utt.onerror = (e) => { if (e.error !== 'interrupted') { setPlaying(false); setPaused(false); } };
    utt.onpause = () => setPaused(true);
    utt.onresume = () => setPaused(false);

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [site, langCode, speed, pickVoice]);

  const pause = useCallback(() => {
    if (window.speechSynthesis?.speaking && !window.speechSynthesis?.paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, []);

  /* Filter language menu to what the site supports (+ always include English) */
  const displayLangs = LANG_MAP.filter(l =>
    l.code === 'en-US' ||
    availableLanguages.some(al =>
      l.label.toLowerCase().includes(al.toLowerCase()) ||
      al.toLowerCase().includes(l.label.toLowerCase().split(' ')[0])
    )
  );
  if (displayLangs.length === 0) displayLangs.push(...LANG_MAP.slice(0, 5));

  const elapsed = totalChars > 0
    ? Math.round((charsRead / totalChars) * (totalChars / 15)) // rough sec estimate
    : 0;
  const total = totalChars > 0 ? Math.round(totalChars / 15) : 0;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!supported) {
    return (
      <div className="ag-shell ag-unsupported">
        <div className="ag-unsupported-icon"><Icon name="volumeOff" size={24} /></div>
        <p>Audio guide not supported in this browser. Please use Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="ag-shell">
      {/* Header */}
      <div className="ag-header">
        <div className="ag-title-row">
          <span className="ag-icon"><Icon name="headphones" size={20} /></span>
          <div>
            <strong className="ag-title">Audio Guide</strong>
            <span className="ag-subtitle">
              {site?.audioGuideLanguages?.length
                ? `${site.audioGuideLanguages.length} languages available`
                : 'Text-to-Speech powered'}
            </span>
          </div>
        </div>
      </div>

      {/* Waveform */}
      <Waveform active={playing && !paused} />

      {/* Current word display */}
      <div className="ag-current-line" aria-live="polite">
        {playing && currentLine ? (
          <span>{currentLine.trim()}</span>
        ) : (
          <span className="ag-hint">
            {playing ? 'Playing…' : 'Press play to start the audio guide'}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="ag-progress-row">
        <span className="ag-time">{fmt(elapsed)}</span>
        <ProgressBar pct={progress} />
        <span className="ag-time">{fmt(total)}</span>
      </div>

      {/* Controls */}
      <div className="ag-controls">
        <button
          type="button"
          className="ag-btn ag-btn-secondary"
          onClick={stop}
          disabled={!playing && !paused}
          title="Stop"
          aria-label="Stop audio guide"
        >
          <Icon name="stop" size={17} />
        </button>
        {!playing ? (
          <button
            type="button"
            className="ag-btn ag-btn-primary ag-btn-play"
            onClick={play}
            title="Play audio guide"
            aria-label="Play audio guide"
          >
            <Icon name="play" size={16} /> Play
          </button>
        ) : paused ? (
          <button
            type="button"
            className="ag-btn ag-btn-primary ag-btn-play"
            onClick={resume}
            title="Resume"
            aria-label="Resume audio guide"
          >
            <Icon name="play" size={16} /> Resume
          </button>
        ) : (
          <button
            type="button"
            className="ag-btn ag-btn-primary ag-btn-play"
            onClick={pause}
            title="Pause"
            aria-label="Pause audio guide"
          >
            <Icon name="pause" size={16} /> Pause
          </button>
        )}

        {/* Speed selector */}
        <div className="ag-speed-wrap">
          <label className="ag-speed-label">Speed</label>
          <div className="ag-speed-btns">
            {[0.75, 1, 1.25, 1.5].map(s => (
              <button
                key={s}
                type="button"
                className={`ag-speed-btn ${speed === s ? 'active' : ''}`}
                aria-pressed={speed === s}
                onClick={() => {
                  setSpeed(s);
                  if (playing && !paused) { stop(); setTimeout(() => play(), 80); }
                }}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div className="ag-lang-wrap">
        <label className="ag-lang-label" htmlFor="ag-lang-select">
          <Icon name="globe" size={15} /> Language
        </label>
        <select
          id="ag-lang-select"
          className="ag-lang-select"
          value={langCode}
          onChange={(e) => {
            setLangCode(e.target.value);
            if (playing) stop();
          }}
        >
          {displayLangs.map(l => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* What will be read */}
      <details className="ag-script-preview">
        <summary>Preview narration script</summary>
        <p className="ag-script-text">{buildScript(site)}</p>
      </details>
    </div>
  );
}
