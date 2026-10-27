import { useEffect, useState } from 'react';
import { fetchPlaceThumbnails } from '../services/placeImageService.js';

function getImageSource(value) {
  return typeof value === 'string' ? value : value?.url || value?.src || '';
}

export default function SmartImage({ src, fallback, alt, className, style, loading = 'lazy', site, ...props }) {
  const imageSrc = getImageSource(src);
  const fallbackSrc = getImageSource(fallback);
  const [currentSrc, setCurrentSrc] = useState(imageSrc || fallbackSrc);
  const [usedFallback, setUsedFallback] = useState(false);
  const [retriedWithPlacePhoto, setRetriedWithPlacePhoto] = useState(false);

  useEffect(() => {
    setCurrentSrc(imageSrc || fallbackSrc);
    setUsedFallback(false);
    setRetriedWithPlacePhoto(false);

    if (!site || (imageSrc && !imageSrc.startsWith('data:image/svg+xml'))) return undefined;

    let active = true;
    fetchPlaceThumbnails([site]).then((thumbnails) => {
      const thumbnail = thumbnails.get(site.id);
      if (active && thumbnail) setCurrentSrc(thumbnail);
    });

    return () => { active = false; };
  }, [imageSrc, fallbackSrc, site?.id]);

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
        if (!usedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
          setUsedFallback(true);
          setCurrentSrc(fallbackSrc);
        } else if (site && !retriedWithPlacePhoto) {
          setRetriedWithPlacePhoto(true);
          fetchPlaceThumbnails([site], { force: true }).then((thumbnails) => {
            const thumbnail = thumbnails.get(site.id);
            if (thumbnail && thumbnail !== currentSrc) {
              setCurrentSrc(thumbnail);
              setUsedFallback(false);
            }
          });
        }
      }}
      {...props}
    />
  );
}
