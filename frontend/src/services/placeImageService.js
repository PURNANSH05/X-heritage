import { sites } from '../data/sites.js';

const thumbnailCache = new Map();
const pendingLookups = new Map();
const MAX_TITLES_PER_REQUEST = 40;
const WIKIPEDIA_TITLES = {
  'ellora-caves-46': 'Ellora Caves',
  'ranganathaswamy-temple-81': 'Ranganathaswamy Temple, Srirangam',
  'chennakeshava-temple-82': 'Chennakeshava Temple, Belur',
  'bara-imambara-85': 'Bara Imambara',
  'pompeii-87': 'Pompeii',
};

function normalizeTitle(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function needsRealPhoto(site, force = false) {
  return force || !site.heroImage || site.heroImage.startsWith('data:image/svg+xml');
}

async function fetchThumbnailBatch(batch) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '1200',
    redirects: '1',
    titles: batch.map((site) => WIKIPEDIA_TITLES[site.id] || site.name?.en).filter(Boolean).join('|')
  });

  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  if (!response.ok) throw new Error(`Place photo lookup failed (${response.status})`);

  const data = await response.json();
  const imagesByTitle = new Map();
  for (const page of Object.values(data?.query?.pages || {})) {
    if (page.thumbnail?.source) {
      imagesByTitle.set(normalizeTitle(page.title), page.thumbnail.source);
    }
  }

  const redirects = new Map((data?.query?.redirects || []).map(({ from, to }) => [
    normalizeTitle(from), normalizeTitle(to)
  ]));

  for (const site of batch) {
    const title = normalizeTitle(WIKIPEDIA_TITLES[site.id] || site.name?.en);
    const resolvedTitle = redirects.get(title) || title;
    const image = imagesByTitle.get(resolvedTitle) || imagesByTitle.get(title);
    if (image) thumbnailCache.set(site.id, image);
  }

  const unresolved = batch.filter((site) => !thumbnailCache.has(site.id));
  for (const site of unresolved) {
    try {
      const searchParams = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*',
        generator: 'search',
        gsrnamespace: '0',
        gsrlimit: '3',
        gsrsearch: `${site.name?.en || ''} ${site.city || ''}`.trim(),
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: '1200',
      });
      const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams.toString()}`);
      if (!searchResponse.ok) continue;
      const searchData = await searchResponse.json();
      const result = Object.values(searchData?.query?.pages || {})
        .find((page) => page.thumbnail?.source);
      if (result?.thumbnail?.source) thumbnailCache.set(site.id, result.thumbnail.source);
    } catch {
      // Ignore missing Wikipedia thumbnails and fall back to the local generated image.
    }
  }
}

export async function fetchPlaceThumbnails(placeList = sites, { force = false } = {}) {
  const pending = placeList.filter((site) => needsRealPhoto(site, force)
    && (force || !thumbnailCache.has(site.id))
    && !pendingLookups.has(site.id));

  for (let index = 0; index < pending.length; index += MAX_TITLES_PER_REQUEST) {
    const batch = pending.slice(index, index + MAX_TITLES_PER_REQUEST);
    const lookup = fetchThumbnailBatch(batch)
      .catch(() => undefined)
      .finally(() => batch.forEach((site) => pendingLookups.delete(site.id)));
    batch.forEach((site) => pendingLookups.set(site.id, lookup));
  }

  const lookups = [...new Set(placeList.map((site) => pendingLookups.get(site.id)).filter(Boolean))];
  if (lookups.length) await Promise.all(lookups);

  return new Map(placeList
    .filter((site) => thumbnailCache.has(site.id))
    .map((site) => [site.id, thumbnailCache.get(site.id)]));
}
