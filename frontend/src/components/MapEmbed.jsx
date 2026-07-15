export default function MapEmbed({ site }) {
  const src = site.googleMapsLink?.includes('embed')
    ? site.googleMapsLink
    : `https://www.google.com/maps?q=${site.latitude},${site.longitude}&z=7&output=embed`;
  return (
    <div className="map-embed">
      <iframe title={`${site.name.en} map`} src={src} loading="lazy" />
    </div>
  );
}
