import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const defaultLanguage = 'en';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(defaultLanguage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('heritagex-language');
    if (saved) setLanguageState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem('heritagex-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, ready]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      ready,
      isRTL: language === 'ar'
    }),
    [language, ready]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}

