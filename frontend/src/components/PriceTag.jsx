/* PriceTag.jsx — Formatted INR price display */
import { formatPrice } from '../services/bookingService.js';

export default function PriceTag({ amount, label, size = 'md', highlight }) {
  return (
    <span className={`price-tag price-tag-${size} ${highlight ? 'price-tag-highlight' : ''}`}>
      <span className="price-tag-amount">{formatPrice(amount)}</span>
      {label && <span className="price-tag-label">{label}</span>}
    </span>
  );
}
