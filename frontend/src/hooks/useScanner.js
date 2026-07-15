import { useMemo, useState } from 'react';
import { sites } from '../data/sites.js';

const API_BASE = 'http://localhost:4000/api';

const cleanInputText = (text) => {
  return String(text || '')
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const matchScore = (text, site) => {
  const haystack = [
    site.name.en,
    site.city,
    site.country,
    site.category,
    ...site.scannerKeywords
  ]
    .join(' ')
    .toLowerCase();
  const q = cleanInputText(text);
  if (!q) return 0;
  if (haystack === q) return 5;
  if (haystack.includes(q)) return 3;
  return q.split(/\s+/).reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
};

export function useScanner() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, scanning, matched, failed
  const [confidence, setConfidence] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [allSuggestions] = useState(sites);

  // Get suggestions as user types
  useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      setSuggestions(sites.slice(0, 8));
      return;
    }
    
    // Fetch suggestions from backend
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${API_BASE}/suggestions?q=${encodeURIComponent(normalized)}`);
        const data = await response.json();
        setSuggestions(data.length > 0 ? data : sites.slice(0, 8));
      } catch (error) {
        // Fallback to local matching
        const local = sites
          .map((site) => ({ site, score: matchScore(normalized, site) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8)
          .map((item) => item.site);
        setSuggestions(local);
      }
    };
    
    fetchSuggestions();
  }, [query]);

  const scan = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus('failed');
      setResult(null);
      return null;
    }

    setStatus('scanning');
    
    try {
      // Try backend API first
      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: trimmed })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.site);
        setConfidence(data.confidence || 'high');
        setStatus('matched');
        return data.site;
      } else if (response.status === 404) {
        // No match from backend, try local fallback
        const bestLocal = allSuggestions
          .map((site) => ({ site, score: matchScore(trimmed, site) }))
          .sort((a, b) => b.score - a.score)[0];
        
        if (bestLocal && bestLocal.score > 0) {
          setResult(bestLocal.site);
          setConfidence('low');
          setStatus('matched');
          return bestLocal.site;
        }
        
        setResult(null);
        setStatus('failed');
        return null;
      }
    } catch (error) {
      console.error('Scan error:', error);
      
      // Fallback to local matching
      const best = allSuggestions
        .map((site) => ({ site, score: matchScore(trimmed, site) }))
        .sort((a, b) => b.score - a.score)[0];
      
      if (best && best.score > 0) {
        setResult(best.site);
        setConfidence('medium');
        setStatus('matched');
        return best.site;
      }
      
      setResult(null);
      setStatus('failed');
      return null;
    }
  };

  return { 
    query, 
    setQuery, 
    result, 
    status, 
    confidence,
    scan, 
    suggestions 
  };
}

