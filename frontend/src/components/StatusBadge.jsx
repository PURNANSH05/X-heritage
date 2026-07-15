/* StatusBadge.jsx — Booking status badge */
import { getStatusColor } from '../services/bookingService.js';

export default function StatusBadge({ status, small }) {
  const color = getStatusColor(status);
  return (
    <span
      className={`status-badge ${small ? 'status-badge-sm' : ''}`}
      style={{ '--badge-color': color }}
    >
      <span className="status-badge-dot" />
      {status}
    </span>
  );
}
