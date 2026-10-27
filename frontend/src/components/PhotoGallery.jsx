import SmartImage from './SmartImage.jsx';

export default function PhotoGallery({ photos, onPick, site }) {
  return (
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <button
          type="button"
          key={(photo?.url || photo) + index}
          className="photo-tile"
          onClick={() => onPick(index, photo)}
        >
          <SmartImage
            src={typeof photo === 'string' ? photo : photo?.url}
            fallback={typeof photo === 'string' ? photo : photo?.fallback}
            alt={typeof photo === 'string' ? `Gallery view ${index + 1}` : photo?.alt || `Gallery view ${index + 1}`}
            className="photo-tile-image"
            site={site}
          />
        </button>
      ))}
    </div>
  );
}
