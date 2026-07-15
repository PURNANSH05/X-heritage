import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';

export default function ImageLightbox({ isOpen, onClose, photos = [], currentIndex, onChangeIndex }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onChangeIndex(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onChangeIndex(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length, onClose, onChangeIndex]);

  if (!isOpen || !photos.length) return null;

  const currentPhoto = photos[currentIndex];
  const src = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto?.url || '';
  const fallback = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto?.fallback || '';
  const alt = typeof currentPhoto === 'string' ? `Photo ${currentIndex + 1}` : currentPhoto?.alt || currentPhoto?.title || `Photo ${currentIndex + 1}`;
  const title = typeof currentPhoto === 'string' ? '' : currentPhoto?.title || currentPhoto?.alt || '';

  return (
    <div className="image-lightbox" onClick={onClose}>
      <button className="image-lightbox-close" onClick={onClose} aria-label="Close lightbox">
        <X size={28} />
      </button>

      {currentIndex > 0 && (
        <button
          className="image-lightbox-nav prev"
          onClick={(e) => {
            e.stopPropagation();
            onChangeIndex(currentIndex - 1);
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <SmartImage
          src={src}
          fallback={fallback}
          alt={alt}
          className="image-lightbox-img"
        />
        {title && <div className="image-lightbox-caption">{title}</div>}
      </div>

      {currentIndex < photos.length - 1 && (
        <button
          className="image-lightbox-nav next"
          onClick={(e) => {
            e.stopPropagation();
            onChangeIndex(currentIndex + 1);
          }}
          aria-label="Next photo"
        >
          <ChevronRight size={36} />
        </button>
      )}

      <div className="image-lightbox-counter">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
