export default function QuickInfoBar({ site }) {
  const entryFee = site.entryFee?.free
    ? 'Free'
    : site.entryFee?.amount
    ? site.entryFee.amount
    : typeof site.entryFee === 'object'
    ? Object.values(site.entryFee).filter(Boolean).join(' · ') || 'Varies'
    : site.entryFee || 'Varies';
  const guideCount = site.audioGuideLanguages?.length || site.audioGuides?.length || 0;

  return (
    <div className="quick-info">
      <div>
        <span>Best Time</span>
        <strong>{site.bestTimeToVisit}</strong>
      </div>
      <div>
        <span>Entry Fee</span>
        <strong>{entryFee}</strong>
      </div>
      <div>
        <span>Opening Hours</span>
        <strong>{site.openingHours}</strong>
      </div>
      <div>
        <span>Languages</span>
        <strong>{guideCount}+ guides</strong>
      </div>
    </div>
  );
}
