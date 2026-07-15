/* TripCard.jsx — Day itinerary card with activity timeline */
export default function TripCard({ day, date, activities }) {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityTypeColors = {
    Heritage: '#c9a84c',
    Food: '#e74c3c',
    Shopping: '#9b59b6',
    Culture: '#0d7377',
    Scenic: '#27ae60',
    Leisure: '#3498db',
    Nature: '#2ecc71',
    Default: '#666',
  };

  return (
    <div className="trip-day-card">
      <div className="trip-day-header">
        <div className="trip-day-number">
          <span className="trip-day-label">Day</span>
          <span className="trip-day-num">{day}</span>
        </div>
        {date && (
          <div className="trip-day-date">
            <span>{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      <div className="trip-timeline">
        {activities?.map((act, idx) => {
          const color = activityTypeColors[act.type] || activityTypeColors.Default;
          return (
            <div key={idx} className="trip-activity">
              <div className="trip-activity-time">
                <span>{act.time}</span>
              </div>
              <div className="trip-activity-connector">
                <div className="trip-connector-dot" style={{ background: color }} />
                {idx < activities.length - 1 && <div className="trip-connector-line" />}
              </div>
              <div className="trip-activity-content">
                <div className="trip-activity-header">
                  <span className="trip-activity-icon">{act.icon}</span>
                  <strong className="trip-activity-name">{act.activity}</strong>
                  <span className="trip-activity-type-badge" style={{ background: color + '20', color }}>
                    {act.type}
                  </span>
                </div>
                <div className="trip-activity-meta">
                  <span>⏱ {act.duration}</span>
                </div>
                {act.notes && <p className="trip-activity-notes">💡 {act.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
