import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { languageChoices } from '../data/sites.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';

export default function LanguagePicker() {
  const navigate = useNavigate();
  const { setLanguage, language } = useLanguage();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const choices = useMemo(
    () =>
      languageChoices.filter((item) =>
        `${item.label} ${item.native} ${item.code}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <section className="language-page">
      <div className="container language-page-inner">
        <img src="/logo.svg" alt="HeritageX" className="language-logo" />
        <h1>{t('selectLanguage')}</h1>
        <input
          className="language-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search languages"
        />
        <div className="language-grid">
          {choices.map((item) => (
            <button
              key={item.code}
              className={`language-card ${language === item.code ? 'language-card-active' : ''}`}
              onClick={() => setLanguage(item.code)}
            >
              <strong>{item.native}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Continue
        </button>
      </div>
    </section>
  );
}
