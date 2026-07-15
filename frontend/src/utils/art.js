const encode = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function makePoster(title, accent = '#0D7377', gold = '#C9A84C') {
  const safeTitle = escapeXml(title);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${title}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#1A1A2E"/>
        <stop offset="100%" stop-color="#101827"/>
      </linearGradient>
      <linearGradient id="wash" x1="0" x2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${gold}" stop-opacity="0.14"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)"/>
    <path d="M0 590C170 470 305 430 470 455c180 28 280 118 430 112 111-5 198-54 300-134v367H0Z" fill="url(#wash)"/>
    <circle cx="965" cy="162" r="96" fill="${gold}" fill-opacity="0.12"/>
    <circle cx="250" cy="155" r="60" fill="${accent}" fill-opacity="0.2"/>
    <circle cx="1030" cy="610" r="220" fill="#FFFFFF" fill-opacity="0.05"/>
    <rect x="120" y="390" width="960" height="26" rx="13" fill="${gold}" fill-opacity="0.18"/>
    <path d="M270 590h660v-54c0-58-30-98-87-125-72-34-140-55-243-55s-171 21-243 55c-57 27-87 67-87 125v54Z" fill="#F7F4EF" fill-opacity="0.08"/>
    <path d="M436 590h328v-126c0-22-18-40-40-40H476c-22 0-40 18-40 40v126Z" fill="#F7F4EF" fill-opacity="0.18"/>
    <path d="M118 525h110v-90h18v90h48v-118h18v118h62v-66h16v66h74v-152h19v152h77v-110h16v110h95v-128h18v128h64v-82h18v82h68v-138h18v138h130v18H118Z" fill="#F7F4EF" fill-opacity="0.12"/>
    <text x="72" y="86" fill="#F7F4EF" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700">${safeTitle}</text>
    <text x="72" y="136" fill="#C9A84C" font-family="Inter, Arial, sans-serif" font-size="20" letter-spacing="2">HERITAGEX</text>
  </svg>`;
  return encode(svg);
}

export function makeLandscape(title, accent = '#0D7377') {
  return makePoster(title, accent, '#C9A84C');
}

export function makePhotoUrl(query, width = 1600, height = 900) {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
}
