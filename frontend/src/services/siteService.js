import { sites } from '../data/sites.js';

const apiBase = '/api';

function isGeneratedImage(image) {
  return typeof image === 'string' && image.startsWith('data:image/svg+xml');
}

function hasRealImages(site) {
  const photoUrls = (site?.photos || []).map((photo) => typeof photo === 'string' ? photo : photo?.url);
  return (site?.heroImage && !isGeneratedImage(site.heroImage))
    || photoUrls.some((url) => url && !isGeneratedImage(url));
}

function mergeSites(remoteSites = [], localSites = sites) {
  const merged = new Map(remoteSites.map((site) => [site.id, site]));
  for (const localSite of localSites) {
    const remoteSite = merged.get(localSite.id);
    if (!remoteSite) {
      merged.set(localSite.id, localSite);
      continue;
    }

    const imageSource = hasRealImages(localSite) ? localSite : hasRealImages(remoteSite) ? remoteSite : localSite;
    merged.set(localSite.id, {
      ...remoteSite,
      ...localSite,
      heroImage: imageSource.heroImage,
      photos: imageSource.photos
    });
  }
  return [...merged.values()];
}

function matchesFilters(site, params = {}) {
  const query = String(params.q || '').trim().toLowerCase();
  const category = String(params.category || 'All');
  const country = String(params.country || 'All');
  const city = String(params.city || 'All');
  const name = typeof site.name === 'string' ? site.name : site.name?.en;
  const description = typeof site.description === 'string' ? site.description : site.description?.en;
  const searchableFields = [
    name,
    site.city,
    site.country,
    site.state,
    site.category,
    description,
    typeof site.history === 'string' ? site.history : site.history?.en,
    typeof site.visitorTips === 'string' ? site.visitorTips : site.visitorTips?.en,
    ...(site.scannerKeywords || [])
  ];
  const haystack = searchableFields.filter(Boolean).join(' ').toLowerCase();

  return (category === 'All' || site.category === category)
    && (country === 'All' || site.country === country)
    && (city === 'All' || site.city === city)
    && (!query || haystack.includes(query));
}

export async function fetchSites() {
  try {
    const response = await fetch(`${apiBase}/sites`);
    if (!response.ok) throw new Error('Request failed');
    return mergeSites(await response.json());
  } catch {
    return sites;
  }
}

export async function fetchSite(id) {
  const localSite = sites.find((site) => site.id === id) || null;

  try {
    const response = await fetch(`${apiBase}/sites/${id}`);
    if (!response.ok) throw new Error('Request failed');
    const remoteSite = await response.json();
    if (!localSite) return remoteSite;

    const imageSource = hasRealImages(localSite) ? localSite : hasRealImages(remoteSite) ? remoteSite : localSite;
    return {
      ...remoteSite,
      heroImage: imageSource.heroImage,
      photos: imageSource.photos
    };
  } catch {
    return localSite;
  }
}

export async function searchSites(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category) query.set('category', params.category);
    if (params.country) query.set('country', params.country);
    if (params.city) query.set('city', params.city);

    const response = await fetch(`${apiBase}/search?${query.toString()}`);
    if (!response.ok) throw new Error('Request failed');
    const remoteSites = await response.json();
    const matchingLocalSites = sites.filter((site) => matchesFilters(site, params));
    return mergeSites(remoteSites, matchingLocalSites);
  } catch {
    return sites.filter((site) => matchesFilters(site, params));
  }
}

export async function fetchCountries() {
  try {
    const response = await fetch(`${apiBase}/countries`);
    if (!response.ok) throw new Error('Request failed');
    const remoteCountries = await response.json();
    return [...new Set([...remoteCountries, ...sites.map((site) => site.country)])].sort();
  } catch {
    return Array.from(new Set(sites.map((site) => site.country))).sort();
  }
}

export async function fetchCities(country = 'All') {
  try {
    const response = await fetch(`${apiBase}/cities?country=${encodeURIComponent(country)}`);
    if (!response.ok) throw new Error('Request failed');
    const remoteCities = await response.json();
    const localCities = sites
      .filter((site) => country === 'All' || site.country === country)
      .map((site) => site.city);
    return [...new Set([...remoteCities, ...localCities])].sort();
  } catch {
    return Array.from(new Set(sites.filter((site) => country === 'All' || site.country === country).map((site) => site.city))).sort();
  }
}

export async function searchWorldPlaces(query) {
  const q = String(query || '').trim();
  if (q.length < 2) return [];

  try {
    const response = await fetch(`${apiBase}/world-search?q=${encodeURIComponent(q)}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch {
    return [];
  }
}
