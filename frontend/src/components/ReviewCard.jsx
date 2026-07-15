export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-head">
        <strong>{review.user}</strong>
        <span>{review.date}</span>
      </div>
      <div className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
      <p>{review.comment}</p>
      <small>{review.country}</small>
    </article>
  );
}

