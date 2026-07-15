import { useNavigate } from 'react-router-dom';
import { languageChoices } from '../data/sites.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const current = languageChoices.find((item) => item.code === language) || languageChoices[0];

  return (
    <div className="language-select">
      <button type="button" className="language-select-button" onClick={() => navigate('/languages')}>
        <span className="flag-dot" aria-hidden="true" />
        <span>{current.native}</span>
      </button>
      <select
        aria-label="Language"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languageChoices.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
