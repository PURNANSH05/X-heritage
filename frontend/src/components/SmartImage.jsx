import { useEffect, useState } from 'react';

export default function SmartImage({ src, fallback, alt, className, style, loading = 'lazy', ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback || '');
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallback || '');
    setUsedFallback(false);
  }, [src, fallback]);

  if (!currentSrc) return null;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={() => {
        if (!usedFallback && fallback && currentSrc !== fallback) {
          setUsedFallback(true);
          setCurrentSrc(fallback);
        }
      }}
      {...props}
    />
  );
}
