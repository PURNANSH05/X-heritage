/**
 * generateFavoritesPDF.js
 * Uses jsPDF + html2canvas to create a beautiful, professional PDF of saved sites.
 */

import jsPDF from 'jspdf';

/* ── Brand colours (RGB) ── */
const TEAL  = [13, 115, 119];
const GOLD  = [201, 168, 76];
const NAVY  = [10, 18, 32];
const WHITE = [255, 255, 255];
const LIGHT = [248, 247, 245];
const MUTED = [140, 130, 115];
const LINE  = [228, 224, 216];

const PAGE_W = 210;   // A4 mm
const PAGE_H = 297;
const M      = 14;    // margin
const COL_W  = (PAGE_W - M * 2 - 6) / 2;  // two columns with 6mm gap

/* ── helpers ── */
const hex = (arr) => `#${arr.map(v => v.toString(16).padStart(2, '0')).join('')}`;
const setColor  = (doc, rgb) => doc.setTextColor(...rgb);
const setFill   = (doc, rgb) => doc.setFillColor(...rgb);
const setDraw   = (doc, rgb) => doc.setDrawColor(...rgb);

/* Load an image URL into a base64 data-URL */
async function loadImageAsDataUrl(url) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || 800;
        canvas.height = img.naturalHeight || 450;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    // Try proxying through a cors-anywhere or just load directly
    img.src = url;
    // Timeout fallback
    setTimeout(() => resolve(null), 6000);
  });
}

/* Draw the cover page */
function drawCover(doc, siteCount, userName) {
  const w = PAGE_W;
  const h = PAGE_H;

  // Background
  setFill(doc, NAVY);
  doc.rect(0, 0, w, h, 'F');

  // Teal gradient band (top)
  setFill(doc, TEAL);
  doc.rect(0, 0, w, 68, 'F');

  // Gold accent strip
  setFill(doc, GOLD);
  doc.rect(0, 68, w, 3, 'F');

  // Decorative circles
  doc.setFillColor(255, 255, 255, 0.04);
  doc.circle(w + 10, 20, 80, 'F');
  doc.circle(-10, h - 30, 60, 'F');

  // Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  setColor(doc, WHITE);
  doc.text('HERITAGE', M, 34);
  setColor(doc, GOLD);
  doc.text('X', M + doc.getTextWidth('HERITAGE') + 1, 34);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setColor(doc, [180, 200, 210]);
  doc.text('Discover · Explore · Preserve', M, 42);

  // Gold line
  setFill(doc, GOLD);
  doc.rect(M, 52, 40, 1.5, 'F');

  // Report title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  setColor(doc, WHITE);
  doc.text('My Heritage Collection', M, 86);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setColor(doc, [180, 200, 210]);
  doc.text('A curated selection of world heritage sites', M, 96);

  // Stats cards
  const stats = [
    { label: 'Saved Sites',   value: String(siteCount) },
    { label: 'Countries',     value: '—' },
    { label: 'Generated',     value: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) },
  ];
  let sx = M;
  const cardW = (w - M * 2 - 8) / 3;
  stats.forEach((s) => {
    setFill(doc, [255, 255, 255, 0.06]);
    doc.roundedRect(sx, 108, cardW, 28, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    setColor(doc, GOLD);
    doc.text(s.value, sx + cardW / 2, 120, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setColor(doc, [160, 180, 195]);
    doc.text(s.label, sx + cardW / 2, 128, { align: 'center' });
    sx += cardW + 4;
  });

  // Wavy monument silhouette (simple line drawing)
  doc.setLineWidth(0.5);
  setDraw(doc, [255, 255, 255, 0.12]);
  // Simplified skyline hint
  setFill(doc, [255, 255, 255, 0.04]);
  doc.rect(0, h - 55, w, 55, 'F');

  // User name
  if (userName) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(doc, [160, 180, 195]);
    doc.text(`Prepared for: ${userName}`, M, h - 20);
  }

  // Footer line
  setFill(doc, GOLD);
  doc.rect(M, h - 14, w - M * 2, 0.5, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setColor(doc, [100, 120, 140]);
  doc.text('HeritageX — Discover the World\'s Greatest Heritage  |  heritagex.app', w / 2, h - 8, { align: 'center' });
}

/* Draw a single site card (returns height used) */
async function drawSiteCard(doc, site, x, y, maxW) {
  const pad   = 5;
  const imgH  = 36;
  const r     = 3;
  let   cy    = y;

  // Load image
  const imgUrl = site.heroImage || site.photos?.[0]?.url || site.photos?.[0] || '';
  const imgData = imgUrl ? await loadImageAsDataUrl(imgUrl) : null;

  // Card background
  setFill(doc, WHITE);
  setDraw(doc, LINE);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, cy, maxW, imgH + 72, r, r, 'FD');

  // Image
  if (imgData) {
    // Clip image to rounded top
    doc.addImage(imgData, 'JPEG', x, cy, maxW, imgH, undefined, 'FAST');

    // Gradient overlay on image (simulate with semi-transparent rect)
    setFill(doc, [10, 18, 32, 0.45]);
    doc.rect(x, cy, maxW, imgH, 'F');
  } else {
    // Placeholder gradient
    setFill(doc, TEAL);
    doc.roundedRect(x, cy, maxW, imgH, r, r, 'F');
    setFill(doc, NAVY);
    doc.rect(x, cy + imgH / 2, maxW, imgH / 2, 'F');
  }

  // Category badge over image
  setFill(doc, GOLD);
  doc.roundedRect(x + pad, cy + pad, doc.getTextWidth(site.category || '') + 6, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  setColor(doc, NAVY);
  doc.text(site.category || 'Heritage', x + pad + 3, cy + pad + 4.8);

  // Site name over image
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(doc, WHITE);
  const nameLines = doc.splitTextToSize(site.name?.en || 'Heritage Site', maxW - pad * 2);
  doc.text(nameLines[0], x + pad, cy + imgH - 12);

  // Location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setColor(doc, [200, 220, 225]);
  doc.text(`📍 ${site.city || ''}, ${site.country || ''}`, x + pad, cy + imgH - 5.5);

  cy += imgH + 5;

  // Rating row
  if (site.rating) {
    const stars = '★'.repeat(Math.round(site.rating)) + '☆'.repeat(5 - Math.round(site.rating));
    setColor(doc, GOLD);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(stars, x + pad, cy + 4);
    setColor(doc, MUTED);
    doc.text(`${site.rating.toFixed(1)} / 5`, x + pad + 22, cy + 4);
    cy += 8;
  }

  // Teal divider
  setFill(doc, TEAL);
  doc.rect(x + pad, cy, 10, 1, 'F');
  cy += 4;

  // Description
  setColor(doc, [60, 60, 60]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const desc = (site.description?.en || '').slice(0, 200);
  const descLines = doc.splitTextToSize(desc, maxW - pad * 2);
  const maxDescLines = 4;
  doc.text(descLines.slice(0, maxDescLines), x + pad, cy + 4);
  cy += Math.min(descLines.length, maxDescLines) * 4.2 + 4;

  // Info chips row
  const chips = [];
  if (site.bestTimeToVisit) chips.push({ icon: '🗓', text: site.bestTimeToVisit.slice(0, 16) });
  if (site.estimatedDuration) chips.push({ icon: '⏱', text: site.estimatedDuration });
  if (chips.length) {
    cy += 2;
    chips.forEach((ch, i) => {
      setFill(doc, LIGHT);
      setDraw(doc, LINE);
      doc.setLineWidth(0.2);
      const tw = doc.getTextWidth(ch.text) + 8;
      const cx2 = x + pad + i * (tw + 4);
      if (cx2 + tw < x + maxW - pad) {
        doc.roundedRect(cx2, cy, tw, 7, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        setColor(doc, MUTED);
        doc.text(ch.text, cx2 + 4, cy + 4.8);
      }
    });
    cy += 10;
  }

  // URL / link hint
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  setColor(doc, TEAL);
  doc.text(`heritagex.app/site/${site.id}`, x + pad, cy + 2);

  return imgH + 78; // total card height
}

/* Page footer */
function drawFooter(doc, pageNum, total) {
  const y = PAGE_H - 8;
  setFill(doc, LINE);
  doc.rect(M, y - 4, PAGE_W - M * 2, 0.4, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setColor(doc, MUTED);
  doc.text('HeritageX Heritage Collection', M, y);
  doc.text(`Page ${pageNum} of ${total}`, PAGE_W - M, y, { align: 'right' });
}

/* Page header (for content pages) */
function drawPageHeader(doc) {
  setFill(doc, TEAL);
  doc.rect(0, 0, PAGE_W, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setColor(doc, WHITE);
  doc.text('HERITAGEX', M, 6.8);
  setColor(doc, GOLD);
  doc.text('My Collection', PAGE_W - M, 6.8, { align: 'right' });
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT FUNCTION
══════════════════════════════════════════════════ */
export async function generateFavoritesPDF(favorites, userName = '') {
  if (!favorites || favorites.length === 0) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  /* ── Cover page ── */
  drawCover(doc, favorites.length, userName);

  /* ── Site pages (2 per page in 2-column grid) ── */
  const CARD_H = 115;  // approximate fixed card height per site
  const COLS   = 2;
  const rows_per_page = Math.floor((PAGE_H - 26 - 16) / (CARD_H + 6)); // header + footer
  const per_page = COLS * rows_per_page;

  let pageNum = 1;
  const totalContentPages = Math.ceil(favorites.length / per_page);

  for (let pi = 0; pi < totalContentPages; pi++) {
    doc.addPage();
    pageNum++;
    drawPageHeader(doc);

    const slice = favorites.slice(pi * per_page, (pi + 1) * per_page);
    let col = 0;
    let row = 0;

    for (let i = 0; i < slice.length; i++) {
      col = i % COLS;
      row = Math.floor(i / COLS);
      const x = M + col * (COL_W + 6);
      const y = 14 + row * (CARD_H + 6);
      await drawSiteCard(doc, slice[i], x, y, COL_W);
    }

    drawFooter(doc, pageNum, totalContentPages + 1);
  }

  /* ── Save ── */
  const filename = `HeritageX-Collection-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
}
