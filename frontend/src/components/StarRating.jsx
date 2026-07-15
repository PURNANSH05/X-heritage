/* StarRating.jsx — Reusable star rating component */
export default function StarRating({ rating, max = 5, size = 14, showValue = true, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
    <span className="star-rating" aria-label={`${rating} out of ${max} stars`}>
      <span className="star-rating-stars" style={{ fontSize: size }}>
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(empty)}
      </span>
      {showValue && <span className="star-rating-value">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="star-rating-count">({count.toLocaleString()})</span>}
    </span>
  );
}
