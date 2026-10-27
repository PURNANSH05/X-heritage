import Icon from './Icon.jsx';

export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-head">
        <strong>{review.user}</strong>
        <span>{review.date}</span>
      </div>
      <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => <Icon key={index} name="star" size={14} fill={index < review.rating ? 'currentColor' : 'none'} />)}
      </div>
      <p>{review.comment}</p>
      <small>{review.country}</small>
    </article>
  );
}

