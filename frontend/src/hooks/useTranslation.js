import { translations } from '../i18n.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key) => {
    const tree = translations[language] || translations.en;
    return key.split('.').reduce((value, part) => value?.[part], tree) ?? key;
  };

  return { t, language };
}

