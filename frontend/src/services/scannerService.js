import { sites } from '../data/sites.js';

export async function recognizeSite(input) {
  const text = String(input || '').toLowerCase();
  const match = sites.find((site) => site.scannerKeywords.some((keyword) => text.includes(keyword)));
  return match || null;
}

