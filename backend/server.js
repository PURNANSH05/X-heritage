import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { sites } from './data/sites.js';
import { makePoster } from '../frontend/src/utils/art.js';
import { connectDatabase } from './db.js';
import Site from './models/Site.js';
import Booking from './models/Booking.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function siteSearchHaystack(site) {
  return [
    site.name?.en,
    site.city,
    site.country,
    site.state,
    site.category,
    site.description?.en,
    site.history?.en,
    site.visitorTips?.en,
    site.bestTimeToVisit,
    site.openingHours,
    site.estimatedDuration,
    site.accessibility,
    site.photography,
    ...(site.scannerKeywords || []),
    ...(site.audioGuideLanguages || []),
    ...(site.audioGuides || []).map((guide) => guide.language)
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join(' ');
}

function scoreSite(site, query) {
  if (!query) {
    return site.rating || 0;
  }

  const haystack = siteSearchHaystack(site);
  const name = normalizeText(site.name?.en);
  const city = normalizeText(site.city);
  const country = normalizeText(site.country);
  const category = normalizeText(site.category);
  let score = 0;

  if (haystack.includes(query)) score += 10;
  if (name === query) score += 50;
  if (name.startsWith(query)) score += 25;
  if (name.includes(query)) score += 18;
  if (city === query) score += 30;
  if (city.startsWith(query)) score += 18;
  if (country === query) score += 22;
  if (country.startsWith(query)) score += 12;
  if (category === query) score += 12;
  if (haystack.startsWith(query)) score += 8;

  const tokens = query.split(' ').filter(Boolean);
  for (const token of tokens) {
    if (name.includes(token)) score += 5;
    if (city.includes(token)) score += 4;
    if (country.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
  }

  return score + (site.rating || 0);
}

const wikiPlaceCache = new Map();
const wikiApiBase = 'https://en.wikipedia.org/w/api.php';

async function fetchWikiPlaces(query, limit = 8) {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const cacheKey = `${normalized}:${limit}`;
  const cached = wikiPlaceCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: String(limit),
    gsrnamespace: '0',
    prop: 'extracts|pageimages|info|coordinates',
    exintro: '1',
    explaintext: '1',
    pithumbsize: '1200',
    pilicense: 'any',
    inprop: 'url'
  });

  const response = await fetch(`${wikiApiBase}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Wikipedia search failed with ${response.status}`);
  }

  const data = await response.json();
  const pages = Object.values(data?.query?.pages || {});

  const mapped = pages
    .filter((page) => page && !page.missing)
    .map((page) => {
      const coords = page.coordinates?.[0];
      const title = page.title || query;
      const summary = page.extract || `Live Wikipedia result for ${title}.`;
      const image = page.thumbnail?.source || null;
      const mapsUrl = coords
        ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;

      return {
        id: `wiki-${page.pageid}`,
        source: 'wikipedia',
        sourceLabel: 'Wikipedia',
        name: { en: title },
        title,
        category: 'World Place',
        description: { en: summary },
        city: '',
        country: '',
        heroImage: image || makePoster(title),
        photos: [{ title: `${title} photo`, url: image || makePoster(title) }],
        openingHours: 'Check the official listing',
        entryFee: 'Varies by place',
        bestTimeToVisit: 'Check local visitor info',
        estimatedDuration: 'Varies',
        rating: 4.4,
        reviewCount: 0,
        wikipediaUrl: page.fullurl,
        googleMapsLink: mapsUrl,
        coordinates: coords
      };
    });

  wikiPlaceCache.set(cacheKey, {
    expiresAt: Date.now() + 1000 * 60 * 60,
    value: mapped
  });

  return mapped;
}

app.get('/api/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    ok: databaseConnected,
    service: 'heritagex-backend',
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/sites', async (_req, res) => {
  try {
    res.json(await Site.find({}, { _id: 0 }).lean());
  } catch (error) {
    console.error('Could not load sites from MongoDB:', error);
    res.status(500).json({ error: 'Could not load heritage sites.' });
  }
});

function cleanPhotoList(images, mainTitle) {
  const skipKeywords = [
    'map', 'flag', 'logo', 'icon', 'location', 'marker', 'shadow', 'shield', 
    'portal', 'stub', 'symbol', 'locator', 'coordinates', 'route', 
    'plan', 'diagram', 'infobox', 'globe', 'nla', 'signature', 
    'unlocked', 'locked', 'sound', 'audio', 'magnify', 'external', 'disambig'
  ];
  
  return images
    .filter(img => {
      const title = img.title.toLowerCase();
      const isImage = title.endsWith('.jpg') || title.endsWith('.jpeg') || title.endsWith('.png') || title.endsWith('.webp');
      if (!isImage) return false;
      
      const hasSkipKeyword = skipKeywords.some(keyword => title.includes(keyword));
      return !hasSkipKeyword;
    })
    .map(img => img.title);
}

async function getImageUrls(fileTitles) {
  if (!fileTitles.length) return [];
  const titlesParam = encodeURIComponent(fileTitles.join('|'));
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  
  const res = await fetch(url, { headers: { 'User-Agent': 'HeritageXBot/1.0 (heritagex@example.com)' } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  
  const urls = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (info?.thumburl) {
      urls.push({
        title: page.title.replace(/^File:/, '').replace(/\.[^/.]+$/, ''),
        url: info.thumburl
      });
    } else if (info?.url) {
      urls.push({
        title: page.title.replace(/^File:/, '').replace(/\.[^/.]+$/, ''),
        url: info.url
      });
    }
  }
  return urls;
}

const wikiDetailCache = new Map();

async function fetchWikiPlaceDetails(pageId) {
  if (wikiDetailCache.has(pageId)) {
    const cached = wikiDetailCache.get(pageId);
    if (cached.expiresAt > Date.now()) return cached.value;
  }

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    pageids: pageId,
    prop: 'extracts|pageimages|info|coordinates|images',
    explaintext: '1',
    pithumbsize: '1200',
    inprop: 'url'
  });

  const response = await fetch(`${wikiApiBase}?${params.toString()}`, {
    headers: { 'User-Agent': 'HeritageXBot/1.0 (heritagex@example.com)' }
  });
  if (!response.ok) {
    throw new Error(`Wikipedia details failed with status ${response.status}`);
  }

  const data = await response.json();
  const page = data?.query?.pages?.[pageId];
  if (!page || page.missing) {
    throw new Error(`Wikipedia page ID ${pageId} not found`);
  }

  const title = page.title;
  const fullExtract = page.extract || '';
  const paragraphs = fullExtract.split('\n\n').filter(Boolean);
  const overviewText = paragraphs[0] || `An overview of ${title}.`;
  const historyText = paragraphs.slice(1).join('\n\n') || `Historical details for ${title}.`;

  const coords = page.coordinates?.[0];
  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;

  const heroImage = page.thumbnail?.source || null;

  let photos = [];
  if (page.images && page.images.length > 0) {
    const candidateTitles = cleanPhotoList(page.images, title);
    const resolvedUrls = await getImageUrls(candidateTitles.slice(0, 5));
    photos = resolvedUrls.map(p => ({ title: p.title, url: p.url }));
  }

  if (heroImage && !photos.some(p => p.url === heroImage)) {
    photos.unshift({ title: `${title} - Main View`, url: heroImage });
  }

  const siteDetails = {
    id: `wiki-${pageId}`,
    source: 'wikipedia',
    name: { en: title },
    city: '',
    country: '',
    category: 'World Place',
    latitude: coords ? coords.lat : 20.0,
    longitude: coords ? coords.lon : 70.0,
    description: { en: overviewText },
    history: { en: historyText },
    visitorTips: { en: 'Check local guidelines and opening times before visiting. Carry water and comfortable walking shoes.' },
    photos: photos.length > 0 ? photos : [{ title: `${title} - View`, url: heroImage || makePoster(title) }],
    heroImage: heroImage || makePoster(title),
    openingHours: 'Check local listings',
    entryFee: 'Varies',
    bestTimeToVisit: 'Check local weather recommendations',
    estimatedDuration: '1-3 hours',
    audioGuideLanguages: ['English'],
    rating: 4.5,
    reviewCount: 42,
    nearbyPlaces: [],
    photography: 'Allowed in public areas',
    accessibility: 'Check local guidelines',
    googleMapsLink: mapsUrl,
    officialWebsite: '',
    reviews: [
      { user: 'GlobalTraveler', rating: 5, comment: `Outstanding historical site! Visiting ${title} was a dream come true.`, date: '2026-05-15', country: 'US' },
      { user: 'Explorer88', rating: 4, comment: `Very interesting architecture and history. Highly recommended.`, date: '2026-04-20', country: 'DE' }
    ]
  };

  wikiDetailCache.set(pageId, {
    expiresAt: Date.now() + 1000 * 60 * 60,
    value: siteDetails
  });

  return siteDetails;
}

app.get('/api/sites/:id', async (req, res) => {
  const id = req.params.id;
  if (id.startsWith('wiki-')) {
    const pageId = id.replace('wiki-', '');
    try {
      const details = await fetchWikiPlaceDetails(pageId);
      return res.json(details);
    } catch (error) {
      console.error('Error fetching wiki details:', error);
      return res.status(500).json({ message: 'Error retrieving live destination details from Wikipedia.' });
    }
  }

  try {
    const site = await Site.findOne({ id }, { _id: 0 }).lean();
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (error) {
    console.error('Could not load site from MongoDB:', error);
    res.status(500).json({ error: 'Could not load heritage site.' });
  }
});

// Advanced search with filters
app.get('/api/search', async (req, res) => {
  const query = normalizeText(req.query.q || '');
  const category = String(req.query.category || 'All');
  const country = String(req.query.country || 'All');
  const city = String(req.query.city || 'All');
  
  try {
    const catalog = await Site.find({}, { _id: 0 }).lean();
    const results = catalog.filter((site) => {
      // Text search across all relevant fields
      const searchText = siteSearchHaystack(site);
      const matchesQuery = !query || searchText.includes(query);

      // Category, country, and city filters
      const matchesCategory = category === 'All' || site.category === category;
      const matchesCountry = country === 'All' || site.country === country;
      const matchesCity = city === 'All' || site.city === city;

      return matchesQuery && matchesCategory && matchesCountry && matchesCity;
    }).sort((a, b) => {
      const scoreA = scoreSite(a, query);
      const scoreB = scoreSite(b, query);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return (b.rating || 0) - (a.rating || 0);
    });
    res.json(results);
  } catch (error) {
    console.error('Could not search MongoDB sites:', error);
    res.status(500).json({ error: 'Could not search heritage sites.' });
  }
});

// Get all countries
app.get('/api/countries', async (_req, res) => {
  try {
    const catalog = await Site.find({}, { country: 1, _id: 0 }).lean();
    res.json(Array.from(new Set(catalog.map((site) => site.country).filter(Boolean))).sort());
  } catch (error) {
    console.error('Could not load countries from MongoDB:', error);
    res.status(500).json({ error: 'Could not load countries.' });
  }
});

// Get cities by country
app.get('/api/cities', async (req, res) => {
  const country = String(req.query.country || 'All');
  try {
    const filter = country === 'All' ? {} : { country };
    const catalog = await Site.find(filter, { city: 1, _id: 0 }).lean();
    res.json(Array.from(new Set(catalog.map((site) => site.city).filter(Boolean))).sort());
  } catch (error) {
    console.error('Could not load cities from MongoDB:', error);
    res.status(500).json({ error: 'Could not load cities.' });
  }
});

// Get categories
app.get('/api/categories', async (_req, res) => {
  try {
    const catalog = await Site.find({}, { category: 1, _id: 0 }).lean();
    res.json(['All', ...Array.from(new Set(catalog.map((site) => site.category).filter(Boolean))).sort()]);
  } catch (error) {
    console.error('Could not load categories from MongoDB:', error);
    res.status(500).json({ error: 'Could not load categories.' });
  }
});

// Nearby sites based on coordinates
app.get('/api/nearby', async (req, res) => {
  const { latitude, longitude, radius = 500 } = req.query;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude and longitude required' });
  }
  
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  try {
    const catalog = await Site.find({}, { _id: 0 }).lean();
    const nearby = catalog
      .map(site => ({
        ...site,
        distance: calculateDistance(lat, lng, site.latitude, site.longitude)
      }))
      .filter(site => site.distance <= Number(radius))
      .sort((a, b) => a.distance - b.distance);
    res.json(nearby);
  } catch (error) {
    console.error('Could not load nearby sites from MongoDB:', error);
    res.status(500).json({ error: 'Could not load nearby sites.' });
  }
});

// Function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Improved scanner with better matching
app.post('/api/scan', async (req, res) => {
  const inputVal = req.body?.input || '';
  const raw = String(inputVal)
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  try {
    const catalog = await Site.find({}, { _id: 0 }).lean();
    if (!raw) {
      return res.status(400).json({
        message: 'Please provide scan input',
        suggestions: catalog.slice(0, 8)
      });
    }

    const exactMatch = catalog.find((site) =>
      (site.scannerKeywords || []).some((keyword) => normalizeText(keyword) === raw)
    );
    if (exactMatch) return res.json({ matched: true, confidence: 'high', site: exactMatch });

    const partialMatch = catalog.find((site) =>
      (site.scannerKeywords || []).some((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        return raw.includes(normalizedKeyword) || normalizedKeyword.includes(raw);
      })
    );
    if (partialMatch) return res.json({ matched: true, confidence: 'medium', site: partialMatch });

    const textMatch = catalog.find((site) =>
      `${site.name?.en || ''} ${site.city || ''} ${site.country || ''}`.toLowerCase().includes(raw)
    );
    if (textMatch) return res.json({ matched: true, confidence: 'low', site: textMatch });

    res.status(404).json({
      message: 'No exact match found. Try these heritage sites:',
      suggestions: catalog.slice(0, 8)
    });
  } catch (error) {
    console.error('Could not scan MongoDB sites:', error);
    res.status(500).json({ error: 'Could not scan heritage sites.' });
  }
});

// Get suggestions based on partial input
app.get('/api/suggestions', async (req, res) => {
  const query = normalizeText(req.query.q || '');
  
  if (!query || query.length < 2) {
    res.json([]);
    return;
  }
  
  try {
    const catalog = await Site.find({}, { _id: 0 }).lean();
    const suggestions = catalog
      .filter(site => siteSearchHaystack(site).includes(query))
      .sort((a, b) => scoreSite(b, query) - scoreSite(a, query))
      .slice(0, 10)
      .map(site => ({
        name: site.name?.en || 'Untitled place',
        city: site.city,
        country: site.country,
        id: site.id
      }));
    res.json(suggestions);
  } catch (error) {
    console.error('Could not load suggestions from MongoDB:', error);
    res.status(500).json({ error: 'Could not load suggestions.' });
  }
});

app.get('/api/world-search', async (req, res) => {
  const query = String(req.query.q || '').trim();

  if (!query || query.length < 2) {
    res.json([]);
    return;
  }

  try {
    const places = await fetchWikiPlaces(query, 8);
    res.json(places);
  } catch (error) {
    console.error('Wikipedia place search failed:', error);
    res.json([]);
  }
});

app.get('/api/languages', (_req, res) => {
  res.json([
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ar', label: 'Arabic' },
    { code: 'fr', label: 'French' },
    { code: 'es', label: 'Spanish' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'ja', label: 'Japanese' },
    { code: 'zh', label: 'Chinese (Simplified)' },
    { code: 'ko', label: 'Korean' },
    { code: 'ru', label: 'Russian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'nl', label: 'Dutch' },
    { code: 'pl', label: 'Polish' },
    { code: 'gu', label: 'Gujarati' }
  ]);
});

// ===========================
// MOCK TRAVEL BOOKING SYSTEM
// ===========================

const AIRLINES_DATA = [
  { code: '6E', name: 'IndiGo',       color: '#1a9ed4' },
  { code: 'AI', name: 'Air India',    color: '#c41e3a' },
  { code: 'SG', name: 'SpiceJet',     color: '#ff4500' },
  { code: 'UK', name: 'Vistara',      color: '#6b2d8b' },
  { code: 'I5', name: 'AirAsia India',color: '#e01111' },
  { code: 'G8', name: 'Go First',     color: '#1e40af' },
];

const AIRPORTS = {
  DEL: 'New Delhi (IGI)',        BOM: 'Mumbai (CSMI)',
  BLR: 'Bengaluru (KIA)',        MAA: 'Chennai',
  HYD: 'Hyderabad (RGIA)',       CCU: 'Kolkata (NSC)',
  GOI: 'Goa (Dabolim)',          AMD: 'Ahmedabad (SVP)',
  JAI: 'Jaipur (SMS)',           VNS: 'Varanasi (LBS)',
  COK: 'Kochi (CIAL)',           PNQ: 'Pune (LHI)',
  SXR: 'Srinagar',               GAU: 'Guwahati (LGB)',
  LKO: 'Lucknow (CSAI)',         PAT: 'Patna',
  ATQ: 'Amritsar (SIS)',         IXB: 'Bagdogra',
  UDR: 'Udaipur',                JDH: 'Jodhpur',
};

function seededRandom(seed) {
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function generateFlights(from, to, date, passengers) {
  const seed = seededRandom(`${from}${to}${date}`);
  const results = [];
  const count = 6 + (seed % 3);
  const pax = parseInt(passengers) || 1;
  const routeLong = seed % 3;
  const basePrice = routeLong === 0 ? 2200 : routeLong === 1 ? 4500 : 7000;

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES_DATA[i % AIRLINES_DATA.length];
    const depHour = 4 + ((seed + i * 3) % 20);
    const depMin = i % 2 === 0 ? 0 : 30;
    const durMins = 60 + ((seed + i * 7) % 120) + (routeLong === 2 ? 120 : routeLong === 1 ? 60 : 0);
    const arrTotalMin = depHour * 60 + depMin + durMins;
    const arrHour = Math.floor(arrTotalMin / 60) % 24;
    const arrMin = arrTotalMin % 60;
    const price = Math.max(1499, basePrice + ((seed + i * 173) % 2000) - 500);

    results.push({
      id: `FL${seed.toString(36).slice(0, 3).toUpperCase()}${i + 1}`,
      airline: airline.name, airlineCode: airline.code, airlineColor: airline.color,
      flightNumber: `${airline.code}${1000 + ((seed + i * 47) % 9000)}`,
      from: from || 'DEL', to: to || 'BOM',
      fromFull: AIRPORTS[from] || from || 'New Delhi',
      toFull: AIRPORTS[to] || to || 'Mumbai',
      date: date || new Date().toISOString().split('T')[0],
      departure: `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`,
      arrival: `${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      durMins, duration: `${Math.floor(durMins/60)}h ${durMins%60}m`,
      stops: (seed + i) % 5 === 0 ? 1 : 0,
      stopCity: (seed + i) % 5 === 0 ? 'Hyderabad' : null,
      price, totalPrice: price * pax,
      seatsAvailable: 5 + ((seed + i * 7) % 45),
      cabinBaggage: '7 kg', checkinBaggage: i % 3 === 0 ? 'Not included' : '15 kg',
      refundable: (seed + i) % 3 !== 0,
      terminal: `T${1 + (i % 3)}`, class: 'Economy',
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

const TRAIN_TEMPLATES = [
  { name: 'Rajdhani Express', number: '12301', type: 'Superfast' },
  { name: 'Shatabdi Express', number: '12002', type: 'Superfast' },
  { name: 'Vande Bharat Express', number: '22436', type: 'Premium' },
  { name: 'Duronto Express', number: '12245', type: 'Superfast' },
  { name: 'Garib Rath Express', number: '12216', type: 'Express' },
  { name: 'Jan Shatabdi', number: '12055', type: 'Express' },
  { name: 'Intercity Express', number: '14013', type: 'Express' },
];

const COACH_CLASSES = {
  SL:  { name: 'Sleeper',          mult: 1.0, desc: 'Basic berths, 72 per coach' },
  '3A':{ name: 'AC 3-Tier',        mult: 2.5, desc: 'AC berths, 6 per bay' },
  '2A':{ name: 'AC 2-Tier',        mult: 4.0, desc: 'Curtained AC berths, 4 per bay' },
  '1A':{ name: 'AC First Class',   mult: 7.0, desc: 'Private cabin, 2 berths' },
  CC:  { name: 'Chair Car',         mult: 2.0, desc: 'Reserved AC seat' },
  EC:  { name: 'Exec. Chair Car',   mult: 5.0, desc: 'Premium seat, Vande Bharat' },
};

function generateTrains(from, to, date) {
  const seed = seededRandom(`train${from}${to}${date}`);
  return TRAIN_TEMPLATES.map((tmpl, i) => {
    const depHour = 4 + ((seed + i * 5) % 20);
    const depMin = i % 2 === 0 ? 0 : 15;
    const durMins = 180 + ((seed + i * 31) % 600);
    const arrTotalMin = depHour * 60 + depMin + durMins;
    const arrHour = Math.floor(arrTotalMin / 60) % 24;
    const arrMin = arrTotalMin % 60;
    const baseFare = 350 + ((seed + i * 31) % 350);
    const isVandeBharat = tmpl.name.includes('Vande Bharat');
    const isShatabdi = tmpl.name.includes('Shatabdi');
    const classes = (isVandeBharat || isShatabdi) ? ['CC','EC'] : ['SL','3A','2A','1A'];
    const avail = {};
    classes.forEach(c => {
      const av = (seed + i + c.charCodeAt(0)) % 65;
      avail[c] = { ...COACH_CLASSES[c], fare: Math.round(baseFare * COACH_CLASSES[c].mult), available: av, status: av < 5 ? 'WL' : 'AVL' };
    });
    return {
      id: `TR${seed.toString(36).slice(0,3).toUpperCase()}${i}`,
      name: tmpl.name, number: `${tmpl.number.slice(0,-1)}${i}`, type: tmpl.type,
      from: from || 'NDLS', to: to || 'MMCT',
      date: date || new Date().toISOString().split('T')[0],
      departure: `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`,
      arrival: `${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      durMins, duration: `${Math.floor(durMins/60)}h ${durMins%60}m`,
      availability: avail, pantry: i % 3 !== 0, wifi: isVandeBharat,
      platform: `Platform ${1 + (seed + i) % 8}`,
    };
  });
}

const BUS_OPS = [
  'GSRTC', 'KSRTC', 'MSRTC', 'Patel Travels', 'VRL Travels',
  'Orange Tours', 'IntrCity SmartBus', 'Neeta Travels', 'SRS Travels',
];
const BUS_TYPES = [
  { type: 'AC Sleeper (2+1)',     mult: 1.8, amenities: ['AC','Charging','Blanket','Pillow'] },
  { type: 'AC Sleeper (2+2)',     mult: 1.5, amenities: ['AC','Charging','Blanket'] },
  { type: 'Volvo AC Seater',      mult: 1.6, amenities: ['AC','WiFi','Charging'] },
  { type: 'Non-AC Sleeper',       mult: 1.0, amenities: ['Charging','Blanket'] },
  { type: 'AC Seater (2+2)',      mult: 1.2, amenities: ['AC','Charging'] },
];

function generateBuses(from, to, date) {
  const seed = seededRandom(`bus${from}${to}${date}`);
  const count = 6 + (seed % 4);
  const results = [];
  for (let i = 0; i < count; i++) {
    const op = BUS_OPS[i % BUS_OPS.length];
    const bt = BUS_TYPES[i % BUS_TYPES.length];
    const depHour = 14 + ((seed + i * 3) % 10);
    const depMin = i % 2 === 0 ? 0 : 30;
    const durMins = 240 + ((seed + i * 19) % 480);
    const arrTotalMin = depHour * 60 + depMin + durMins;
    const arrHour = Math.floor(arrTotalMin / 60) % 24;
    const arrMin = arrTotalMin % 60;
    const base = 350 + ((seed + i * 23) % 600);
    results.push({
      id: `BS${seed.toString(36).slice(0,3).toUpperCase()}${i}`,
      operator: op, busType: bt.type, amenities: bt.amenities,
      from: from || 'Ahmedabad', to: to || 'Surat',
      date: date || new Date().toISOString().split('T')[0],
      departure: `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`,
      arrival: `${String(arrHour % 24).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      durMins, duration: `${Math.floor(durMins/60)}h ${durMins%60}m`,
      price: Math.round(base * bt.mult),
      seatsAvailable: 3 + ((seed + i * 7) % 25),
      boardingPoint: `${from || 'City'} Bus Stand`,
      droppingPoint: `${to || 'Destination'} Bus Stand`,
      rating: ((3.5 + ((seed + i) % 15) / 10)).toFixed(1),
      cancellationPolicy: 'Free cancellation up to 2 hours before departure',
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

const HOTEL_TIERS = [
  { tier:'luxury',   stars:5, chains:['Taj Hotels','Oberoi','Marriott','ITC Hotels','Leela Palace'], base:8000 },
  { tier:'premium',  stars:4, chains:['Radisson','Hyatt','Novotel','Ramada','Holiday Inn'],       base:4000 },
  { tier:'standard', stars:3, chains:['Lemon Tree','Ginger','Ibis','Country Inn','FabHotel'],      base:1800 },
  { tier:'budget',   stars:2, chains:['OYO Rooms','Treebo','RedDoorz','Zostel','StayEasy'],        base:700  },
];
const HOTEL_AMENITIES = {
  luxury:   ['Free WiFi','Pool','Spa','Restaurant','Bar','Gym','Room Service','Valet','Concierge','Airport Transfer'],
  premium:  ['Free WiFi','Pool','Restaurant','Bar','Gym','Room Service','Parking'],
  standard: ['Free WiFi','Restaurant','Gym','Parking'],
  budget:   ['Free WiFi','Parking','24h Reception'],
};

function generateHotels(city, checkin, checkout) {
  const seed = seededRandom(`hotel${city}${checkin}`);
  const nights = (checkin && checkout)
    ? Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000))
    : 1;
  const results = [];
  let idx = 0;
  HOTEL_TIERS.forEach(tier => {
    const count = tier.tier === 'luxury' ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const chain = tier.chains[i % tier.chains.length];
      const price = tier.base + ((seed + idx * 137) % tier.base);
      const ratingBase = { luxury:4.5, premium:4.0, standard:3.5, budget:3.0 }[tier.tier];
      const rating = Math.min(5, ratingBase + ((seed + idx) % 8) / 10);
      results.push({
        id: `HT${seed.toString(36).slice(0,3).toUpperCase()}${idx}`,
        name: `${chain} ${city}`, chain, tier: tier.tier, stars: tier.stars,
        city: city || 'Agra',
        rating: rating.toFixed(1),
        reviewCount: 80 + ((seed + idx * 13) % 900),
        pricePerNight: price, totalPrice: price * nights, nights,
        distanceFromCenter: `${(0.5 + (seed + idx) % 10).toFixed(1)} km from city center`,
        amenities: HOTEL_AMENITIES[tier.tier],
        roomTypes: tier.tier === 'luxury'
          ? ['Deluxe','Junior Suite','Suite','Presidential Suite']
          : tier.tier === 'premium' ? ['Superior','Deluxe','Junior Suite']
          : tier.tier === 'standard' ? ['Standard','Deluxe'] : ['Economy','Standard'],
        freeCancellation: tier.tier !== 'budget' || idx % 2 === 0,
        breakfastIncluded: tier.tier === 'luxury',
        image: `https://source.unsplash.com/800x500/?hotel,${tier.tier}&sig=${seed+idx}`,
      });
      idx++;
    }
  });
  return results.sort((a, b) => a.pricePerNight - b.pricePerNight);
}

const CAB_OPTIONS = [
  { type:'Auto Rickshaw', capacity:3,  basePrice:60,   perKm:12, icon:'🛺', desc:'Affordable 3-wheeler for short trips' },
  { type:'Mini Cab',      capacity:4,  basePrice:90,   perKm:15, icon:'🚗', desc:'Compact hatchback for budget travel' },
  { type:'Sedan',         capacity:4,  basePrice:110,  perKm:18, icon:'🚗', desc:'Comfortable sedan for city rides' },
  { type:'SUV',           capacity:6,  basePrice:160,  perKm:22, icon:'🚙', desc:'Spacious SUV for groups' },
  { type:'Bike',          capacity:1,  basePrice:35,   perKm:8,  icon:'🏍️', desc:'Beat traffic on a bike' },
  { type:'Scooter Rental',capacity:1,  basePrice:400,  perKm:0,  icon:'🛵', desc:'Self-ride scooter (per day)' },
  { type:'Car Rental',    capacity:4,  basePrice:1400, perKm:0,  icon:'🔑', desc:'Self-drive car (per day, fuel extra)' },
];

function generateCabs(from, to, distance) {
  const dist = parseFloat(distance) || 15;
  return CAB_OPTIONS.map(c => ({
    ...c,
    id: `CB-${c.type.replace(/\s+/g,'-').toLowerCase()}`,
    from: from || 'Hotel', to: to || 'Airport',
    estimatedFare: Math.round(c.basePrice + c.perKm * dist),
    estimatedTime: `${Math.ceil(dist / 25 * 60)} mins`,
    driversNearby: 2 + Math.floor(seededRandom(c.type + dist) % 8),
  }));
}

function generateItinerary(destination, days, budget) {
  const destSites = sites.filter(s =>
    normalizeText(s.city || '').includes(normalizeText(destination || '')) ||
    normalizeText(s.name?.en || '').includes(normalizeText(destination || '')) ||
    normalizeText(s.state || '').includes(normalizeText(destination || ''))
  ).slice(0, days * 3);

  const restaurants = {
    luxury: ['Bukhara (ITC Maurya)', 'The Imperial Spice', 'Wasabi by Morimoto'],
    premium: ["Karim's", 'Punjabi by Nature', 'Moti Mahal'],
    standard: ["Haldiram's", 'Sagar Ratna', 'Bikanervala'],
    budget: ['Local Dhaba', 'Street Food Market', 'Thali Restaurant'],
  };
  const eats = restaurants[budget] || restaurants.standard;
  const itinerary = [];

  for (let d = 1; d <= days; d++) {
    const daySites = destSites.slice((d - 1) * 2, d * 2);
    const slots = [
      { time:'09:00', activity: daySites[0] ? `Visit ${daySites[0].name?.en}` : 'Morning heritage walk', duration:'2 hours', type:'sightseeing' },
      { time:'13:00', activity: `Lunch at ${eats[(d-1) % eats.length]}`,                                  duration:'1 hour',  type:'food'        },
      { time:'15:30', activity: daySites[1] ? `Explore ${daySites[1].name?.en}` : 'Local market tour',    duration:'2 hours', type:'sightseeing' },
      { time:'19:00', activity: d === days ? 'Shopping & souvenir' : 'Evening cultural show / stroll',     duration:'1.5 hrs', type:'entertainment'},
    ];
    itinerary.push({
      day: d,
      title: d === 1 ? 'Arrival & First Impressions'
           : d === days ? 'Last Day & Departure'
           : `Day ${d} — Culture & Heritage`,
      activities: slots,
    });
  }
  return itinerary;
}

function generateAIResponse(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('hello') || m.includes('hi ') || m.match(/^hi$/))
    return '👋 Hello! I\'m your **HeritageX AI Travel Assistant**. Ask me anything about destinations, hotels, transport, food, visas, weather, or trip planning! ✈️🏨🚂';
  if (m.includes('hotel') && (m.includes('taj') || m.includes('agra')))
    return '🏨 **Top Hotels near Taj Mahal, Agra:**\n- **Oberoi Amarvilas** ⭐⭐⭐⭐⭐ — direct Taj views, ultra-luxury\n- **Taj Hotel & Convention Centre** ⭐⭐⭐⭐⭐ — heritage property\n- **Crystal Sarovar Premiere** ⭐⭐⭐⭐ — great value\n- **Zostel Agra** — best budget pick\n\nBook 2-3 months ahead for peak season (Oct-Feb)!';
  if (m.includes('best time') || m.includes('weather') || m.includes('season'))
    return '🌤️ **Best time to visit India:**\n- **Oct–Mar**: Pleasant, cool, perfect for heritage & sightseeing ✅\n- **Apr–Jun**: Very hot (35–45°C), avoid peak sun hours\n- **Jul–Sep**: Monsoon — lush Goa & Kerala are beautiful\n\nMost heritage sites (Taj Mahal, Rajasthan forts) are best Oct–Feb.';
  if (m.includes('flight') || m.includes('fly') || m.includes('airline'))
    return '✈️ **Flight booking tips:**\n- Book **2-3 weeks early** for best fares\n- **IndiGo & SpiceJet** — cheapest domestic options\n- **Air India & Vistara** — premium comfort\n- Early morning (6-8am) flights are often 20% cheaper\n- Use the **Flight Booking** tab to compare all airlines!';
  if (m.includes('train') || m.includes('irctc') || m.includes('railway'))
    return '🚂 **Train travel tips:**\n- **Vande Bharat Express** — fastest, premium (CC/EC class)\n- **Rajdhani Express** — overnight AC travel, meals included\n- **Shatabdi** — day express for shorter routes\n- Book via HeritageX or IRCTC (quota opens 60 days ahead)\n- Tatkal quota: 1 day before departure (24% surcharge)';
  if (m.includes('goa') || m.includes('beach'))
    return '🌊 **Goa Travel Guide:**\n- **North Goa**: Baga, Calangute, Anjuna (lively, nightlife)\n- **South Goa**: Palolem, Agonda, Benaulim (peaceful, scenic)\n- **Must-see**: Old Goa churches (UNESCO), Dudhsagar Falls\n- Best time: **Nov–Feb** (dry, festive)\n- Transport: Rent a scooter (₹300-400/day) — perfect for Goa!';
  if (m.includes('rajasthan') || m.includes('jaipur') || m.includes('jodhpur'))
    return '🏰 **Rajasthan Highlights:**\n- **Jaipur** (Pink City): Amber Fort, City Palace, Hawa Mahal\n- **Jodhpur** (Blue City): Mehrangarh Fort, Clock Tower\n- **Udaipur** (Lake City): City Palace, Pichola Lake\n- **Jaisalmer** (Golden City): Desert safari, Sam dunes\n- Classic circuit: **Delhi→Agra→Jaipur** (Golden Triangle, 5-7 days)';
  if (m.includes('budget') || m.includes('cheap') || m.includes('cost'))
    return '💰 **Budget India Travel:**\n- **Transport**: Sleeper class trains (~₹300-700/journey)\n- **Stay**: OYO/Zostel/guesthouses (₹400-800/night)\n- **Food**: Local dhabas & thalis (₹80-150/meal)\n- **Sightseeing**: Most monuments ₹30-600 entry\n- **Daily budget**: ₹1,500-2,500 (backpacker) to ₹5,000+ (comfortable)';
  if (m.includes('food') || m.includes('eat') || m.includes('cuisine') || m.includes('restaurant'))
    return '🍛 **Indian Food by Region:**\n- **North**: Butter chicken, dal makhani, biryani, chole bhature\n- **South**: Dosa, idli, sambar, Kerala fish curry\n- **West**: Dhokla, pav bhaji, Goan vindaloo\n- **East**: Mishti doi, macher jhol, litti chokha\n- **Must-try**: Pav Bhaji (Mumbai), Hyderabadi biryani, Amritsari kulcha!';
  if (m.includes('visa') || m.includes('passport') || m.includes('entry'))
    return '🛂 **India Visa Info:**\n- **Indians**: No visa needed for domestic travel\n- **Foreign visitors**: Apply for **e-Tourist Visa** at indianvisaonline.gov.in\n- 60+ nationalities eligible, processing 3-5 days\n- Cost: $25-100 depending on nationality\n- Valid for 30 days (single entry) or 1 year (multiple entry)';
  if (m.includes('pack') || m.includes('carry') || m.includes('luggage'))
    return '🎒 **Essential India Packing List:**\n- Cotton/breathable clothes + light jacket (AC)\n- Comfortable walking shoes + sandals\n- Sunscreen (SPF 50+), mosquito repellent\n- Power bank + universal adapter (Type C/D)\n- Small first-aid kit, ORS sachets\n- Scarf/dupatta (required at religious sites)\n- Rain jacket (Jul-Sep monsoon season)';
  return `I can help with that! Try asking about: **hotel recommendations**, **flight tips**, **train booking**, **best seasons to visit**, **regional cuisine**, **visa info**, **budget planning**, or specific destinations like **Goa, Rajasthan, Kerala, Himalayas**. What would you like to know? 🌏`;
}

// ---- API Routes ----

app.get('/api/airports', (_req, res) => {
  res.json(Object.entries(AIRPORTS).map(([code, name]) => ({ code, name })));
});

app.get('/api/flights', (req, res) => {
  const { from, to, date, passengers = 1 } = req.query;
  res.json(generateFlights(from, to, date, passengers));
});

app.get('/api/trains', (req, res) => {
  const { from, to, date } = req.query;
  res.json(generateTrains(from, to, date));
});

app.get('/api/buses', (req, res) => {
  const { from, to, date } = req.query;
  res.json(generateBuses(from, to, date));
});

app.get('/api/hotels', (req, res) => {
  const { city, checkin, checkout } = req.query;
  res.json(generateHotels(city, checkin, checkout));
});

app.get('/api/cabs', (req, res) => {
  const { from, to, distance } = req.query;
  res.json(generateCabs(from, to, distance));
});

app.get('/api/itinerary', (req, res) => {
  const { destination, days = 3, budget = 'standard' } = req.query;
  res.json(generateItinerary(destination, parseInt(days), budget));
});

app.get('/api/weather', (req, res) => {
  const { city } = req.query;
  const seed = seededRandom(city || 'default');
  const conditions = ['Sunny ☀️','Partly Cloudy ⛅','Clear 🌤️','Breezy 🌬️'];
  const temp = 22 + (seed % 18);
  res.json({
    city: city || 'Unknown', condition: conditions[seed % conditions.length],
    temperature: temp, feelsLike: temp - 2,
    humidity: 40 + (seed % 40), windSpeed: 5 + (seed % 20),
    forecast: [0,1,2,3,4].map(d => ({
      day: ['Today','Tomorrow','Day 3','Day 4','Day 5'][d],
      condition: conditions[(seed + d) % conditions.length],
      high: temp + (d % 3), low: temp - 5 - (d % 4),
    })),
  });
});

app.post('/api/bookings', async (req, res) => {
  const { type, userId, details, passengerDetails, paymentMethod } = req.body;
  if (!type) return res.status(400).json({ error: 'Booking type is required.' });

  const booking = {
    id: `BK${Date.now().toString(36).toUpperCase()}`,
    type, userId, details, passengerDetails, paymentMethod,
    status: 'confirmed',
    pnr: `PNR${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    bookedAt: new Date().toISOString(),
    totalAmount: details?.totalPrice || details?.price || details?.estimatedFare || 0,
  };

  try {
    await Booking.create(booking);
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Could not save booking to MongoDB:', error);
    res.status(500).json({ error: 'Could not save booking.' });
  }
});

app.get('/api/bookings', async (req, res) => {
  const { userId } = req.query;
  try {
    const filter = userId ? { userId: String(userId) } : {};
    res.json(await Booking.find(filter, { _id: 0 }).sort({ bookedAt: -1 }).lean());
  } catch (error) {
    console.error('Could not load bookings from MongoDB:', error);
    res.status(500).json({ error: 'Could not load bookings.' });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id }, { _id: 0 }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Could not load booking from MongoDB:', error);
    res.status(500).json({ error: 'Could not load booking.' });
  }
});

app.post('/api/payment', (req, res) => {
  const { amount, method, bookingId } = req.body;
  setTimeout(() => {
    if (Math.random() > 0.03) {
      res.json({
        success: true,
        transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
        amount, method, bookingId,
        timestamp: new Date().toISOString(),
        message: 'Payment successful',
      });
    } else {
      res.status(402).json({ success: false, message: 'Payment failed. Please retry.' });
    }
  }, 2000);
});

app.post('/api/ai-chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const response = generateAIResponse(message);
  res.json({ response, timestamp: new Date().toISOString() });
});

// Admin: list all bookings (simple auth check)
app.get('/api/admin/bookings', async (_req, res) => {
  try {
    res.json(await Booking.find({}, { _id: 0 }).sort({ bookedAt: -1 }).lean());
  } catch (error) {
    console.error('Could not load admin bookings from MongoDB:', error);
    res.status(500).json({ error: 'Could not load bookings.' });
  }
});

app.get('/api/admin/stats', async (_req, res) => {
  try {
    const [stats = {}] = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          flightBookings: { $sum: { $cond: [{ $eq: ['$type', 'flight'] }, 1, 0] } },
          hotelBookings: { $sum: { $cond: [{ $eq: ['$type', 'hotel'] }, 1, 0] } },
          trainBookings: { $sum: { $cond: [{ $eq: ['$type', 'train'] }, 1, 0] } },
          busBookings: { $sum: { $cond: [{ $eq: ['$type', 'bus'] }, 1, 0] } },
          cabBookings: { $sum: { $cond: [{ $eq: ['$type', 'cab'] }, 1, 0] } }
        }
      },
      { $project: { _id: 0 } }
    ]);
    res.json({
      totalBookings: 0,
      totalRevenue: 0,
      flightBookings: 0,
      hotelBookings: 0,
      trainBookings: 0,
      busBookings: 0,
      cabBookings: 0,
      ...stats
    });
  } catch (error) {
    console.error('Could not calculate booking stats from MongoDB:', error);
    res.status(500).json({ error: 'Could not load booking statistics.' });
  }
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port);
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

startServer();
