import { sites } from '../data/sites.js';

const apiBase = '/api';

export async function fetchSites() {
  try {
    const response = await fetch(`${apiBase}/sites`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch {
    return sites;
  }
}

export async function fetchSite(id) {
  try {
    const response = await fetch(`${apiBase}/sites/${id}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch {
    return sites.find((site) => site.id === id) || null;
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
    return response.json();
  } catch {
    const q = String(params.q || '').toLowerCase();
    const category = String(params.category || 'All');
    const country = String(params.country || 'All');
    const city = String(params.city || 'All');

    return sites.filter((site) => {
      const matchesCategory = category === 'All' || site.category === category;
      const matchesCountry = country === 'All' || site.country === country;
      const matchesCity = city === 'All' || site.city === city;
      const needle = `${site.name.en} ${site.city} ${site.country} ${site.category} ${site.description.en}`.toLowerCase();
      const matchesQuery = !q || needle.includes(q);
      return matchesCategory && matchesCountry && matchesCity && matchesQuery;
    });
  }
}

export async function fetchCountries() {
  try {
    const response = await fetch(`${apiBase}/countries`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch {
    return Array.from(new Set(sites.map((site) => site.country))).sort();
  }
}

export async function fetchCities(country = 'All') {
  try {
    const response = await fetch(`${apiBase}/cities?country=${encodeURIComponent(country)}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
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
