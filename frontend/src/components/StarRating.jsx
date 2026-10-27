/* StarRating.jsx — Reusable star rating component */
import Icon from './Icon.jsx';
export default function StarRating({ rating, max = 5, size = 14, showValue = true, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
    <span className="star-rating" aria-label={`${rating} out of ${max} stars`}>
      <span className="star-rating-stars" aria-hidden="true">
        {Array.from({ length: full }, (_, index) => <Icon key={`full-${index}`} name="star" size={size} fill="currentColor" />)}
        {half && <Icon name="star" size={size} fill="currentColor" style={{ opacity: 0.55 }} />}
        {Array.from({ length: empty }, (_, index) => <Icon key={`empty-${index}`} name="star" size={size} />)}
      </span>
      {showValue && <span className="star-rating-value">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="star-rating-count">({count.toLocaleString()})</span>}
    </span>
  );
}
