import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import SearchResultCard from '../components/SearchResultCard.jsx';
import { categories } from '../data/sites.js';
import { fetchCities, fetchCountries, searchSites, searchWorldPlaces } from '../services/siteService.js';
import { useTranslation } from '../hooks/useTranslation.js';

export default function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [country, setCountry] = useState('All');
  const [city, setCity] = useState('All');
  const [countries, setCountries] = useState(['All']);
  const [cities, setCities] = useState(['All']);
  const [results, setResults] = useState([]);
  const [worldResults, setWorldResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [worldLoading, setWorldLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchCountries()
      .then((data) => {
        if (active) setCountries(['All', ...data.filter((item) => item !== 'All')]);
      })
      .catch(() => {
        if (active) setCountries(['All']);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchCities(country)
      .then((data) => {
        if (!active) return;
        setCities(['All', ...data.filter((item) => item !== 'All')]);
        setCity('All');
      })
      .catch(() => {
        if (active) setCities(['All']);
      });

    if (country === 'All') {
      setCity('All');
    }

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const timeout = window.setTimeout(() => {
      searchSites({ q: query, category, country, city })
        .then((data) => {
          if (!active) return;
          setResults(data);
        })
        .catch((err) => {
          if (!active) return;
          setError(err?.message || 'Search failed.');
          setResults([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, query.trim() ? 220 : 0);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query, category, country, city]);

  useEffect(() => {
    let active = true;
    const normalized = query.trim();
    setWorldLoading(Boolean(normalized));

    if (normalized.length < 2) {
      setWorldResults([]);
      setWorldLoading(false);
      return () => {
        active = false;
      };
    }

    const timeout = window.setTimeout(() => {
      searchWorldPlaces(normalized)
        .then((data) => {
          if (!active) return;
          setWorldResults(data);
        })
        .catch(() => {
          if (!active) return;
          setWorldResults([]);
        })
        .finally(() => {
          if (active) setWorldLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  const featuredResult = results[0] || null;
  const secondaryResults = useMemo(() => results.slice(1), [results]);

  return (
    <section className="section">
      <div className="container">
        <div className="search-intro">
          <div>
            <h1>{t('search')} any city, place, or country</h1>
            <p>
              Search by destination name, city, country, or landmark and get the strongest match with photos,
              timings, entry info, and travel details.
            </p>
          </div>
          <Link to="/scanner" className="btn btn-secondary">
            Open Scanner
          </Link>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={(event) => event.preventDefault()}
          placeholder={t('searchPlaceholder')}
        />

        <div className="search-filters">
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Country</span>
            <select value={country} onChange={(event) => setCountry(event.target.value)}>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>City</span>
            <select value={city} onChange={(event) => setCity(event.target.value)} disabled={country === 'All'}>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="search-summary">
          <div>
            <strong>{loading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'}`}</strong>
            <span>
              {query ? `Matched for "${query}"` : 'Browse all destinations to start exploring.'}
            </span>
          </div>
          <div className="search-summary-pills">
            <span>{country === 'All' ? 'All countries' : country}</span>
            <span>{city === 'All' ? 'All cities' : city}</span>
            <span>{category}</span>
          </div>
        </div>

        {error && <div className="empty-state">{error}</div>}

        {!error && featuredResult && (
          <div className="search-featured">
            <SearchResultCard site={featuredResult} featured />
          </div>
        )}

        {!error && secondaryResults.length > 0 && (
          <div className="card-grid search-results-grid">
            {secondaryResults.map((site) => (
              <SearchResultCard key={site.id} site={site} />
            ))}
          </div>
        )}

        {!error && !loading && results.length === 0 && query.trim().length >= 2 && !worldLoading && worldResults.length === 0 && (
          <div className="empty-state">
            <p>No places matched your search.</p>
            <p>Try a broader city or country name, or clear the filters to explore the full catalog.</p>
          </div>
        )}

        {query.trim().length >= 2 && (
          <div className="search-world-section">
            <div className="section-heading">
              <h2>Live web results</h2>
              <p>Public Wikipedia and Wikimedia data for broader place searches.</p>
            </div>

            {worldLoading && <div className="empty-state">Looking up live place data...</div>}

            {!worldLoading && worldResults.length > 0 && (
              <div className="card-grid search-results-grid">
                {worldResults.map((place) => (
                  <SearchResultCard key={place.id} site={place} />
                ))}
              </div>
            )}

            {!worldLoading && worldResults.length === 0 && (
              <div className="empty-state">
                <p>No live web result found yet.</p>
                <p>Try a different spelling or a more specific landmark name.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
