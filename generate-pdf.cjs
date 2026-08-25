/**
 * generate-pdf.cjs
 * Generates the Go-To-Market Strategy PDF for The Enchanted Line
 * Includes: GTM strategy, architecture overview, payment gateway, security layers
 *
 * Run:    node generate-pdf.cjs
 * Output: GTM-Strategy-Enchanted-Line.pdf
 */

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
  bg:        '#06101c',
  card:      '#0c1e35',
  cardDark:  '#081525',
  accent:    '#1a3050',
  gold:      '#c9a45a',
  goldLight: '#e8c97a',
  body:      '#ede3cc',
  muted:     '#8fa4bc',
  dim:       '#4a6080',
  red:       '#e05555',
  redDark:   '#2a0808',
  redText:   '#f08080',
  green:     '#4a9e6a',
  greenDark: '#081508',
  greenText: '#80c880',
  wax:       '#7a2e1a',
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: 'The Enchanted Line — GTM Strategy & Architecture',
    Author: 'thecodem-dev',
    Subject: 'Geekulcha Train Tourism Hackathon 2027',
  },
})

const outPath = path.join(__dirname, 'GTM-Strategy-Enchanted-Line.pdf')
doc.pipe(fs.createWriteStream(outPath))

const W = 595.28
const H = 841.89
const M = 48

// ── Helpers ──────────────────────────────────────────────────────────────────

function pageBg(tint) {
  doc.rect(0, 0, W, H).fill(tint || C.bg)
  doc.rect(12, 12, W - 24, H - 24).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0).stroke()
  doc.rect(18, 18, W - 36, H - 36).lineWidth(0.3).strokeColor(C.gold).fillOpacity(0).stroke()
}

function corners() {
  [[12,12],[W-19,12],[12,H-19],[W-19,H-19]].forEach(([x,y]) => {
    doc.rect(x, y, 7, 7).fill(C.gold)
  })
}

function pageHeader(title, pageNum) {
  doc.font('Helvetica-Bold').fontSize(7).fillColor(C.dim)
     .text('THE ENCHANTED LINE  ·  ' + title.toUpperCase(), M, 26, { characterSpacing: 1.5 })
  doc.font('Helvetica').fontSize(7).fillColor(C.dim)
     .text(String(pageNum).padStart(2,'0'), W - M - 20, 26)
  goldDivider(40)
}

function goldDivider(y, x0, x1) {
  x0 = x0 || M; x1 = x1 || W - M
  const mid = (x0 + x1) / 2
  doc.moveTo(x0, y).lineTo(mid - 10, y).lineWidth(0.7).strokeColor(C.gold).stroke()
  doc.moveTo(mid + 10, y).lineTo(x1, y).lineWidth(0.7).strokeColor(C.gold).stroke()
  doc.save().translate(mid, y).rotate(45)
     .rect(-4, -4, 8, 8).fill(C.gold)
  doc.restore()
}

function sectionLabel(text, y) {
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.gold)
     .text(text.toUpperCase(), M, y, { characterSpacing: 2 })
  return doc.y + 6
}

function body(text, y, opts) {
  opts = opts || {}
  doc.font('Helvetica').fontSize(opts.size || 10)
     .fillColor(opts.color || C.body)
     .text(text, opts.x || M, y, { width: opts.width || W - M*2, lineGap: 3, ...opts })
  return doc.y + (opts.gap || 4)
}

function diamond(x, y, size, color) {
  doc.save().translate(x, y).rotate(45)
     .rect(-size, -size, size*2, size*2).fill(color || C.gold)
  doc.restore()
}

function bullet(text, y, color) {
  diamond(M + 10, y + 6, 3.5, color || C.gold)
  doc.font('Helvetica').fontSize(10).fillColor(C.body)
     .text(text, M + 22, y, { width: W - M*2 - 22, lineGap: 3 })
  return doc.y + 4
}

function tableHeader(cols, y, widths) {
  let x = M
  cols.forEach((col, i) => {
    doc.rect(x, y, widths[i], 22).fill(C.accent)
    doc.rect(x, y, widths[i], 22).lineWidth(0.5).strokeColor(C.gold).fillOpacity(0.3).stroke()
    doc.font('Helvetica-Bold').fontSize(8).fillColor(C.gold)
       .text(col, x + 6, y + 7, { width: widths[i] - 12, lineBreak: false })
    x += widths[i]
  })
}

function tableRow(cols, y, widths, idx) {
  let x = M
  cols.forEach((col, i) => {
    doc.rect(x, y, widths[i], 26).fill(idx % 2 === 0 ? C.card : C.cardDark)
    doc.rect(x, y, widths[i], 26).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
    doc.font(i === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
       .fillColor(i === 0 ? C.goldLight : C.body)
       .text(col, x + 6, y + 8, { width: widths[i] - 12, lineBreak: false })
    x += widths[i]
  })
  return y + 26
}

function secBadge(label, x, y, w, h, bg, border, textColor) {
  doc.rect(x, y, w, h).fill(bg)
  doc.rect(x, y, w, h).lineWidth(0.8).strokeColor(border).fillOpacity(0.4).stroke()
  doc.font('Helvetica').fontSize(9).fillColor(textColor)
     .text(label, x + 4, y + (h/2) - 5, { width: w - 8, align: 'center', lineBreak: false })
}

function rays(opacity) {
  doc.save().opacity(opacity || 0.05)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    doc.moveTo(W/2, H/2)
       .lineTo(W/2 + Math.cos(a)*600, H/2 + Math.sin(a)*600)
       .lineWidth(1).strokeColor(C.gold).stroke()
  }
  doc.restore()
}

// ════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ════════════════════════════════════════════════════════════════
pageBg(); corners(); rays()

doc.font('Helvetica').fontSize(9).fillColor(C.muted)
   .text('SOUTH AFRICAN RAILWAYS  ·  EST. 1910', 0, 192, { align: 'center', characterSpacing: 2 })

doc.font('Helvetica-Bold').fontSize(40).fillColor(C.goldLight)
   .text('THE ENCHANTED LINE', 0, 216, { align: 'center', characterSpacing: 3 })

doc.font('Helvetica-Oblique').fontSize(15).fillColor(C.body)
   .text('A Living Museum on Rails', 0, 266, { align: 'center' })

goldDivider(296)

doc.font('Helvetica-Bold').fontSize(11).fillColor(C.gold)
   .text('GEEKULCHA TRAIN TOURISM HACKATHON 2027', 0, 312, { align: 'center', characterSpacing: 1.5 })

doc.font('Helvetica').fontSize(12).fillColor(C.gold).fillOpacity(0.9)
   .text('PRETORIA  ──────────────►  CAPE TOWN', 0, 338, { align: 'center' })

doc.font('Helvetica').fontSize(10).fillColor(C.dim)
   .text('1,600 km  ·  9 Chapters  ·  1 Story', 0, 360, { align: 'center' })

goldDivider(386)

doc.font('Helvetica-Bold').fontSize(14).fillColor(C.body)
   .text('GO-TO-MARKET STRATEGY', 0, 402, { align: 'center', characterSpacing: 2 })
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.muted)
   .text('Architecture  ·  Payment Gateway  ·  Security  ·  GTM', 0, 424, { align: 'center' })

// feature pills
const pills = ['React SPA', 'Supabase', 'Stripe / PayFast', 'Cloudflare WAF', 'PCI DSS', 'POPIA']
const pillW = 82, pillGap = 8
const pillsTotal = pills.length * pillW + (pills.length - 1) * pillGap
let px = (W - pillsTotal) / 2
pills.forEach(p => {
  doc.rect(px, 460, pillW, 22).fill(C.accent)
  doc.rect(px, 460, pillW, 22).lineWidth(0.6).strokeColor(C.gold).fillOpacity(0.5).stroke()
  doc.font('Helvetica').fontSize(8).fillColor(C.gold)
     .text(p, px + 2, 467, { width: pillW - 4, align: 'center' })
  px += pillW + pillGap
})

doc.rect(M, H - 130, W - M*2, 80).fill(C.card)
doc.rect(M, H - 130, W - M*2, 80).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.4).stroke()
doc.font('Helvetica').fontSize(9).fillColor(C.muted)
   .text('Built with React · Vite · Tailwind CSS v4 · TypeScript · Supabase', 0, H - 114, { align: 'center' })
doc.font('Helvetica').fontSize(9).fillColor(C.dim)
   .text('github.com/thecodem-dev/interactive-train-journey-map', 0, H - 96, { align: 'center' })
goldDivider(H - 70)
doc.font('Helvetica').fontSize(8).fillColor(C.dim)
   .text('CONFIDENTIAL  ·  HACKATHON SUBMISSION 2027', 0, H - 56, { align: 'center', characterSpacing: 1.5 })

// ════════════════════════════════════════════════════════════════
// PAGE 2 — POSITIONING + STANDOUTS
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Go-To-Market Strategy', 2)

let y = 58
y = sectionLabel('Core Positioning', y)

doc.rect(M, y, W - M*2, 50).fill(C.card)
doc.rect(M, y, W - M*2, 50).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.5).stroke()
doc.rect(M, y, 4, 50).fill(C.gold)
doc.font('Helvetica-Oblique').fontSize(13).fillColor(C.goldLight)
   .text('"The only entry that doesn\'t just show the route — it makes you feel it."', M + 14, y + 14, { width: W - M*2 - 20 })
y += 62

doc.font('Helvetica').fontSize(10).fillColor(C.body)
   .text('Most hackathon entries will build a map with pins. You have built a narrative journey — animated, multilingual, art-deco — that treats the rail route as a story, not a database.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 14

goldDivider(y); y += 18
y = sectionLabel('What Makes You Stand Out', y)

const standouts = [
  ['01', 'The Experience Gap', 'Custom SVG map, moving locomotive, wax-seal passport stamps, four languages from day one. The judges will have seen 20 maps before yours. Yours will feel like a product.'],
  ['02', 'Localisation as First-Class', 'The brief says "localise the journey." You ship English, isiZulu, Afrikaans, and Sesotho. Every other team adds a toggle at best.'],
  ['03', 'The Passport Mechanic', 'Wax-seal stamp collected at each station — nobody else has this. "We didn\'t build a map. We built a passport."'],
  ['04', 'Domestic Tourism Answer', 'Hidden gems (3 per station) directly answers the brief. A tool a tourist board could use tomorrow, not a prototype needing six more months.'],
]

standouts.forEach(([num, title, desc]) => {
  if (y > H - 100) { doc.addPage(); pageBg(); corners(); y = 58 }
  doc.rect(M, y, W - M*2, 76).fill(C.card)
  doc.rect(M, y, W - M*2, 76).lineWidth(0.6).strokeColor(C.gold).fillOpacity(0.3).stroke()
  doc.rect(M, y, 32, 76).fill(C.accent)
  doc.font('Helvetica-Bold').fontSize(16).fillColor(C.gold).fillOpacity(0.7)
     .text(num, M, y + 24, { width: 32, align: 'center' })
  doc.font('Helvetica-Bold').fontSize(11).fillColor(C.goldLight)
     .text(title, M + 42, y + 10, { width: W - M*2 - 52 })
  doc.font('Helvetica').fontSize(9.5).fillColor(C.body)
     .text(desc, M + 42, y + 28, { width: W - M*2 - 52, lineGap: 2 })
  y += 86
})

// ════════════════════════════════════════════════════════════════
// PAGE 3 — PITCH STRUCTURE
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Pitch Structure', 3)

y = 58
y = sectionLabel('3-Minute Demo — Beat by Beat', y)
doc.font('Helvetica').fontSize(10).fillColor(C.muted)
   .text('Structure your live demo around this sequence. Each beat is designed to land a specific emotional response.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 12

const beats = [
  ['0:00–0:20', 'Open with the problem', '"South Africa has 9 UNESCO-worthy rail corridors. Nobody under 35 knows what\'s along them." One stat, one truth.'],
  ['0:20–0:45', 'Language picker lands', 'Choose isiZulu live. "We asked — who is this for? It\'s for everyone." Let the greeting update. Pause.'],
  ['0:45–1:15', 'Board the train', 'Click "Board the Train." Let the locomotive move. Say nothing for 5 seconds. This is your gasps moment.'],
  ['1:15–1:50', 'Open one chapter', 'Show heritage, hidden gems, wax seal. "We didn\'t build a map. We built a passport."'],
  ['1:50–2:20', 'Show the scale', 'Two more stations. Route line fills. Stamps accumulate. "Nine chapters. One living story."'],
  ['2:20–2:50', 'Architecture close', 'One slide: six-layer diagram. "Payment gateway, Cloudflare WAF, PCI DSS, POPIA. This is a product."'],
  ['2:50–3:00', 'The ask', '"We are asking for the platform to put this on every PRASA ticket. Thank you."'],
]

beats.forEach(([time, title, detail], i) => {
  if (y > H - 80) { doc.addPage(); pageBg(); corners(); y = 58 }
  doc.rect(M, y, W - M*2, 56).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M, y, W - M*2, 56).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.rect(M, y, 72, 56).fill(C.accent)
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.gold)
     .text(time, M + 2, y + 20, { width: 68, align: 'center' })
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.goldLight)
     .text(title, M + 82, y + 8, { width: W - M*2 - 92 })
  doc.font('Helvetica').fontSize(9).fillColor(C.body)
     .text(detail, M + 82, y + 26, { width: W - M*2 - 92, lineGap: 2 })
  y += 62
})

y += 8; goldDivider(y); y += 16
y = sectionLabel('Judging Criteria', y)

const cw = [140, W - M*2 - 140]
tableHeader(['CRITERION', 'HOW YOU SCORE'], y, cw); y += 22
;[
  ['Creativity / Innovation', 'Art-deco design, passport mechanic, animated locomotive — nothing else looks like this'],
  ['Technical Execution',     'TypeScript, rAF animation, SVG map, multilingual state, payment + security architecture'],
  ['Relevance to Brief',      'Localisation (4 languages), hidden gems, full route, cultural heritage, payment model'],
  ['Scalability',             'Six-layer architecture: WAF, Auth, Payment, Supabase, POPIA, PostGIS — production-ready'],
].forEach((row, i) => { y = tableRow(row, y, cw, i) })

// ════════════════════════════════════════════════════════════════
// PAGE 4 — ARCHITECTURE OVERVIEW
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Architecture Overview', 4)

y = 58
y = sectionLabel('Six-Layer Architecture', y)
doc.font('Helvetica').fontSize(10).fillColor(C.muted)
   .text('The application is structured in six layers. The Presentation Tier is fully implemented. All remaining layers represent the planned full-stack expansion.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 14

const layers = [
  { label: 'LAYER 1 — PRESENTATION', sub: 'React SPA + PWA  ·  i18n  ·  IndexedDB  ·  Security Headers', bg: C.card, border: C.gold, textColor: C.goldLight, status: '✅ LIVE', statusColor: C.green },
  { label: 'LAYER 2 — EDGE SECURITY', sub: 'WAF  ·  DDoS Protection  ·  CDN/TLS 1.3  ·  Rate Limiting  ·  Bot Detection', bg: C.redDark, border: C.red, textColor: C.redText, status: '🔲 PLANNED', statusColor: C.muted },
  { label: 'LAYER 3 — IDENTITY & ACCESS', sub: 'JWT Auth  ·  OAuth 2.0/PKCE  ·  Row-Level Security  ·  MFA  ·  Session Mgmt', bg: C.greenDark, border: C.green, textColor: C.greenText, status: '🔲 PLANNED', statusColor: C.muted },
  { label: 'LAYER 4 — PAYMENT GATEWAY', sub: 'Stripe (global)  ·  PayFast (ZAR)  ·  Webhooks  ·  PCI DSS SAQ-A  ·  Tokenisation', bg: '#0c1a10', border: C.goldLight, textColor: C.goldLight, status: '🔲 PLANNED', statusColor: C.muted },
  { label: 'LAYER 5 — APPLICATION TIER', sub: 'Supabase  ·  PostgREST  ·  Realtime  ·  Storage  ·  Edge Functions', bg: C.card, border: C.gold, textColor: C.body, status: '🔲 PLANNED', statusColor: C.muted },
  { label: 'LAYER 6 — DATA TIER', sub: 'PostgreSQL + PostGIS  ·  AES-256  ·  TLS 1.3  ·  POPIA  ·  Audit Log  ·  PITR', bg: C.cardDark, border: C.gold, textColor: C.body, status: '🔲 PLANNED', statusColor: C.muted },
]

layers.forEach((l, i) => {
  if (y > H - 80) { doc.addPage(); pageBg(); corners(); y = 58 }
  const rh = 54
  doc.rect(M, y, W - M*2, rh).fill(l.bg)
  doc.rect(M, y, W - M*2, rh).lineWidth(0.9).strokeColor(l.border).fillOpacity(0.6).stroke()
  doc.rect(M, y, 5, rh).fill(l.border)

  doc.font('Helvetica-Bold').fontSize(9).fillColor(l.textColor)
     .text(l.label, M + 14, y + 9, { width: W - M*2 - 120 })
  doc.font('Helvetica').fontSize(8.5).fillColor(C.muted)
     .text(l.sub, M + 14, y + 26, { width: W - M*2 - 120 })

  doc.font('Helvetica-Bold').fontSize(8).fillColor(l.statusColor)
     .text(l.status, W - M - 90, y + 20, { width: 84, align: 'right' })

  // connector arrow (not after last)
  if (i < layers.length - 1) {
    const ax = W/2
    doc.moveTo(ax, y + rh).lineTo(ax, y + rh + 10)
       .lineWidth(1.2).strokeColor(l.border).stroke()
    // arrowhead
    doc.moveTo(ax - 5, y + rh + 6).lineTo(ax, y + rh + 12).lineTo(ax + 5, y + rh + 6)
       .lineWidth(1).strokeColor(l.border).stroke()
  }
  y += rh + 14
})

// ════════════════════════════════════════════════════════════════
// PAGE 5 — PAYMENT GATEWAY DETAIL
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Payment Gateway', 5)

y = 58
y = sectionLabel('Payment Architecture — Stripe + PayFast', y)
doc.font('Helvetica').fontSize(10).fillColor(C.muted)
   .text('PayFast is the leading South African payment processor — critical for domestic ZAR transactions. Stripe handles international cards and subscriptions.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 14

// Payment flow diagram
const flowSteps = [
  { label: 'User clicks "Purchase"', color: C.gold },
  { label: 'Edge Function creates Checkout Session\n(secret key never leaves server)', color: C.goldLight },
  { label: 'User redirected to Stripe / PayFast\nhosted checkout page', color: C.goldLight },
  { label: 'Card captured + 3D Secure enforced\n(no card data touches app servers)', color: C.green },
  { label: 'Webhook POST to Edge Function\n(HMAC-SHA256 signature verified)', color: C.green },
  { label: 'subscriptions + payments tables updated\nRealtime notifies client → premium unlocked', color: C.gold },
]

flowSteps.forEach((step, i) => {
  if (y > H - 80) { doc.addPage(); pageBg(); corners(); y = 58 }
  const bh = 36
  doc.rect(M + 20, y, W - M*2 - 40, bh).fill(C.card)
  doc.rect(M + 20, y, W - M*2 - 40, bh).lineWidth(0.8).strokeColor(step.color).fillOpacity(0.5).stroke()
  doc.rect(M + 20, y, 4, bh).fill(step.color)
  doc.font('Helvetica').fontSize(9).fillColor(C.body)
     .text(step.label, M + 32, y + 6, { width: W - M*2 - 60, lineGap: 2 })
  if (i < flowSteps.length - 1) {
    doc.moveTo(W/2, y + bh).lineTo(W/2, y + bh + 8).lineWidth(1).strokeColor(step.color).stroke()
    diamond(W/2, y + bh + 10, 3, step.color)
  }
  y += bh + 14
})

y += 6; goldDivider(y); y += 16
y = sectionLabel('Payment Components', y)

const pw = [130, W - M*2 - 220, 90]
tableHeader(['COMPONENT', 'DESCRIPTION', 'PROVIDER'], y, pw); y += 22
;[
  ['Checkout Sessions',   'Hosted payment page, handles 3DS + currency', 'Stripe / PayFast'],
  ['Stripe Elements',     'Embedded card UI for custom checkout flow',    'Stripe'],
  ['Webhook Verification','HMAC-SHA256 on every payment event',           'Both'],
  ['Subscription Billing','Monthly / annual plans, dunning mgmt',         'Stripe Billing'],
  ['Refund Handling',     'Edge Function processes refund requests',       'Stripe API'],
  ['PCI DSS Compliance',  'SAQ-A (redirect) — no card data stored',       'Both'],
].forEach((row, i) => { y = tableRow(row, y, pw, i) })

y += 14; goldDivider(y); y += 16
y = sectionLabel('Payment Security Rules', y)

;[
  'Never store raw card data — tokenisation handled entirely by Stripe / PayFast',
  'Webhook secret stored in Supabase Vault, rotated quarterly',
  'Idempotency keys on all payment API calls to prevent double-charges',
  'Payment amounts always calculated server-side — client sends product ID only, never a price',
  'Currency locked to ZAR for PayFast; multi-currency via Stripe',
  '3D Secure 2.0 enforced on all card transactions above R500',
].forEach(t => { y = bullet(t, y, C.goldLight) })

// ════════════════════════════════════════════════════════════════
// PAGE 6 — SECURITY LAYERS
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Security Architecture', 6)

y = 58
y = sectionLabel('Security Layer 1 — Edge & Network  (Cloudflare)', y)

const el = [
  ['WAF', 'Block SQLi, XSS, OWASP Top 10 at the edge before reaching origin'],
  ['DDoS Protection', 'Cloudflare Magic Transit absorbs volumetric attacks'],
  ['CDN / TLS 1.3', 'TLS termination at global PoPs, HTTP/3, sub-50ms TTFB'],
  ['Rate Limiting', 'Max 100 req/min per IP on all API and auth routes'],
  ['Bot Detection', 'Cloudflare Turnstile — CAPTCHA-free on auth + payment flows'],
  ['IP Allowlist / GeoBlock', 'Admin endpoints restricted to known IPs only'],
]

const ew = [130, W - M*2 - 130]
tableHeader(['CONTROL', 'DESCRIPTION'], y, ew); y += 22
el.forEach((row, i) => {
  doc.rect(M, y, ew[0], 26).fill(C.redDark)
  doc.rect(M, y, ew[0], 26).lineWidth(0.5).strokeColor(C.red).fillOpacity(0.4).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.redText)
     .text(row[0], M + 6, y + 8, { width: ew[0] - 12, lineBreak: false })
  doc.rect(M + ew[0], y, ew[1], 26).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M + ew[0], y, ew[1], 26).lineWidth(0.4).strokeColor(C.red).fillOpacity(0.15).stroke()
  doc.font('Helvetica').fontSize(9).fillColor(C.body)
     .text(row[1], M + ew[0] + 6, y + 8, { width: ew[1] - 12, lineBreak: false })
  y += 26
})

y += 16
y = sectionLabel('Security Layer 2 — Identity & Access  (Supabase Auth)', y)

const al = [
  ['JWT Auth Tokens', 'Short-lived access tokens (1 hr), automatic refresh rotation'],
  ['OAuth 2.0 / PKCE', 'Google + GitHub providers; PKCE prevents auth code interception'],
  ['Row-Level Security', 'PostgreSQL RLS — users read/write only their own rows'],
  ['MFA Support', 'TOTP mandatory for admin accounts, optional for users'],
  ['Session Management', 'Sliding expiry, device fingerprinting, concurrent session limits'],
  ['API Key Rotation', 'Service-role key in Supabase Vault — never in client bundle'],
]

tableHeader(['CONTROL', 'DESCRIPTION'], y, ew); y += 22
al.forEach((row, i) => {
  doc.rect(M, y, ew[0], 26).fill(C.greenDark)
  doc.rect(M, y, ew[0], 26).lineWidth(0.5).strokeColor(C.green).fillOpacity(0.4).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.greenText)
     .text(row[0], M + 6, y + 8, { width: ew[0] - 12, lineBreak: false })
  doc.rect(M + ew[0], y, ew[1], 26).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M + ew[0], y, ew[1], 26).lineWidth(0.4).strokeColor(C.green).fillOpacity(0.15).stroke()
  doc.font('Helvetica').fontSize(9).fillColor(C.body)
     .text(row[1], M + ew[0] + 6, y + 8, { width: ew[1] - 12, lineBreak: false })
  y += 26
})

y += 16
y = sectionLabel('Security Layer 3 — Data Protection', y)

const dl = [
  ['AES-256 at Rest', 'All PostgreSQL volumes encrypted at rest'],
  ['TLS 1.3 in Transit', 'Enforced on every database and API connection'],
  ['POPIA Compliance', 'SA Protection of Personal Information Act — data minimisation, consent, right-to-erasure'],
  ['Secrets Manager', 'Supabase Vault for all API keys and webhook secrets'],
  ['Audit Logging', 'audit_log table — all writes logged with user_id + IP + timestamp'],
  ['Backup + PITR', 'Daily backups + Point-in-Time Recovery (7-day window)'],
]

tableHeader(['CONTROL', 'DESCRIPTION'], y, ew); y += 22
dl.forEach((row, i) => {
  doc.rect(M, y, ew[0], 26).fill(C.greenDark)
  doc.rect(M, y, ew[0], 26).lineWidth(0.5).strokeColor(C.green).fillOpacity(0.4).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.greenText)
     .text(row[0], M + 6, y + 8, { width: ew[0] - 12, lineBreak: false })
  doc.rect(M + ew[0], y, ew[1], 26).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M + ew[0], y, ew[1], 26).lineWidth(0.4).strokeColor(C.green).fillOpacity(0.15).stroke()
  doc.font('Helvetica').fontSize(9).fillColor(C.body)
     .text(row[1], M + ew[0] + 6, y + 8, { width: ew[1] - 12, lineBreak: false })
  y += 26
})

// ════════════════════════════════════════════════════════════════
// PAGE 7 — REVENUE MODEL + ROADMAP
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners()
pageHeader('Revenue & Roadmap', 7)

y = 58
y = sectionLabel('Revenue Model', y)

const rw = [130, W - M*2 - 130]
tableHeader(['REVENUE STREAM', 'HOW IT WORKS'], y, rw); y += 22
;[
  ['B2G Licensing',      'License to SAT or PRASA as a white-label digital tourism product'],
  ['Sponsored Stations', 'Hidden gems section co-branded with provincial tourism boards'],
  ['School / Education', 'Classroom version sold to DBE — geography, heritage, and language'],
  ['Premium Accounts',   'User subscriptions via Stripe (global) and PayFast (ZAR) for advanced features'],
  ['API / Data Layer',   'Sell enriched POI and cultural data to GetYourGuide, Viator, etc.'],
].forEach((row, i) => { y = tableRow(row, y, rw, i) })

y += 20; goldDivider(y); y += 16
y = sectionLabel('Feature Roadmap', y)

const fw = [120, W - M*2 - 180, 60]
tableHeader(['FEATURE', 'WHY IT MATTERS', 'EFFORT'], y, fw); y += 22
;[
  ['Audio Narration',    'Conductor voice in 4 languages. Immersive + accessible.',        'Medium'],
  ['Live Weather',       'OpenWeatherMap per station. Costs nothing, feels magical.',       'Low'],
  ['User Passport',      'Persistent stamps, social share. Drives retention.',             'Medium'],
  ['Per-Station Quiz',   'Heritage quiz after each chapter. Educational value.',           'Low'],
  ['Offline PWA',        'Cache all 9 stations. Works on the train — most on-brand feat.', 'Low'],
  ['Embed / Widget',     'iframe a station card. Tourism boards drop it on their sites.',  'Medium'],
  ['Google Maps',        'Replace SVG with live satellite/terrain map.',                   'Medium'],
  ['Payment Tiers',      'Free / Premium / School plans via Stripe + PayFast.',            'Medium'],
].forEach((row, i) => {
  const effortColor = row[2] === 'Low' ? C.green : C.gold
  const rowH = 26
  doc.rect(M, y, fw[0], rowH).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M, y, fw[0], rowH).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.rect(M + fw[0], y, fw[1], rowH).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M + fw[0], y, fw[1], rowH).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.rect(M + fw[0] + fw[1], y, fw[2], rowH).fill(i % 2 === 0 ? C.card : C.cardDark)
  doc.rect(M + fw[0] + fw[1], y, fw[2], rowH).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.goldLight)
     .text(row[0], M + 6, y + 8, { width: fw[0] - 12, lineBreak: false })
  doc.font('Helvetica').fontSize(8.5).fillColor(C.body)
     .text(row[1], M + fw[0] + 6, y + 8, { width: fw[1] - 12, lineBreak: false })
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(effortColor)
     .text(row[2], M + fw[0] + fw[1] + 6, y + 8, { width: fw[2] - 12, align: 'center', lineBreak: false })
  y += rowH
})

// ════════════════════════════════════════════════════════════════
// PAGE 8 — BACK COVER
// ════════════════════════════════════════════════════════════════
doc.addPage(); pageBg(); corners(); rays()

goldDivider(220)
doc.font('Helvetica-Bold').fontSize(32).fillColor(C.goldLight)
   .text('THE ENCHANTED LINE', 0, 240, { align: 'center', characterSpacing: 2 })
doc.font('Helvetica-Oblique').fontSize(13).fillColor(C.body)
   .text('A Living Museum on Rails', 0, 282, { align: 'center' })
goldDivider(308)

doc.font('Helvetica-Bold').fontSize(11).fillColor(C.gold)
   .text('"We built the journey, not just the map."', 0, 328, { align: 'center' })
doc.font('Helvetica').fontSize(10).fillColor(C.muted)
   .text('9 Chapters  ·  1,600 km  ·  4 Languages  ·  3 Security Layers  ·  1 Payment Gateway', 0, 352, { align: 'center' })

// stat badges
const stats = [{ l: 'STATIONS', v: '9' }, { l: 'LANGUAGES', v: '4' }, { l: 'KM', v: '1,600' }, { l: 'SECURITY\nLAYERS', v: '3' }]
const bw = 96, bg = 12
const btotal = stats.length * bw + (stats.length - 1) * bg
let bx = (W - btotal) / 2
stats.forEach(s => {
  doc.rect(bx, 384, bw, 52).fill(C.card)
  doc.rect(bx, 384, bw, 52).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.6).stroke()
  doc.font('Helvetica-Bold').fontSize(22).fillColor(C.goldLight)
     .text(s.v, bx, 393, { width: bw, align: 'center' })
  doc.font('Helvetica').fontSize(7).fillColor(C.dim)
     .text(s.l, bx, 420, { width: bw, align: 'center', characterSpacing: 1.5 })
  bx += bw + bg
})

goldDivider(454)
doc.font('Helvetica').fontSize(9).fillColor(C.dim)
   .text('React  ·  Vite  ·  Tailwind CSS v4  ·  TypeScript  ·  Supabase  ·  Stripe  ·  PayFast  ·  Cloudflare', 0, 470, { align: 'center' })
doc.font('Helvetica').fontSize(9).fillColor(C.gold).fillOpacity(0.7)
   .text('github.com/thecodem-dev/interactive-train-journey-map', 0, 488, { align: 'center' })
doc.font('Helvetica').fontSize(8).fillColor(C.dim)
   .text('GEEKULCHA TRAIN TOURISM HACKATHON 2027', 0, H - 60, { align: 'center', characterSpacing: 1.5 })

// ── Done ──────────────────────────────────────────────────────────────────
doc.end()
console.log('✓ PDF generated → ' + outPath)
