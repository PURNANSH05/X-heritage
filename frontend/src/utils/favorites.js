export function readFavorites() {
  try {
    return JSON.parse(window.localStorage.getItem('heritagex-favorites') || '[]');
  } catch {
    return [];
  }
}

export function writeFavorites(next) {
  window.localStorage.setItem('heritagex-favorites', JSON.stringify(next));
}

export function toggleFavorite(siteId) {
  const current = readFavorites();
  const next = current.includes(siteId) ? current.filter((id) => id !== siteId) : [...current, siteId];
  writeFavorites(next);
  return next;
}

