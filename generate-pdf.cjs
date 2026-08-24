/**
 * generate-pdf.js
 * Generates the Go-To-Market Strategy PDF for The Enchanted Line
 * using PDFKit — no browser or native binaries required.
 *
 * Run: node generate-pdf.js
 * Output: GTM-Strategy-Enchanted-Line.pdf
 */

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
  bg:       '#06101c',
  card:     '#0c1e35',
  gold:     '#c9a45a',
  goldLight:'#e8c97a',
  body:     '#ede3cc',
  muted:    '#8fa4bc',
  dim:      '#4a6080',
  accent:   '#1a3050',
  wax:      '#7a2e1a',
}

// Helper: hex to RGB array
function hex(h) {
  const r = parseInt(h.slice(1,3),16)
  const g = parseInt(h.slice(3,5),16)
  const b = parseInt(h.slice(5,7),16)
  return [r,g,b]
}

// ── Document setup ──────────────────────────────────────────────────────────
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: 'The Enchanted Line — Go-To-Market Strategy',
    Author: 'thecodem-dev',
    Subject: 'Geekulcha Train Tourism Hackathon 2027',
  },
})

const outPath = path.join(__dirname, 'GTM-Strategy-Enchanted-Line.pdf')
doc.pipe(fs.createWriteStream(outPath))

const W = 595.28   // A4 width  (pt)
const H = 841.89   // A4 height (pt)
const M = 48       // page margin

// ── Reusable drawing helpers ─────────────────────────────────────────────────

function pageBg() {
  doc.rect(0, 0, W, H).fill(C.bg)
  // double border
  doc.rect(12, 12, W-24, H-24).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0).stroke()
  doc.rect(18, 18, W-36, H-36).lineWidth(0.3).strokeColor(C.gold).fillOpacity(0).stroke()
}

function cornerOrnaments() {
  const pts = [[18,18],[W-18,18],[18,H-18],[W-18,H-18]]
  pts.forEach(([x,y]) => {
    doc.circle(x, y, 3).fillColor(C.gold).fillOpacity(0.6).fill()
  })
}

function goldDivider(y, xStart = M, xEnd = W - M) {
  const mid = (xStart + xEnd) / 2
  doc.moveTo(xStart, y).lineTo(mid - 10, y).lineWidth(0.7).strokeColor(C.gold).stroke()
  doc.moveTo(mid + 10, y).lineTo(xEnd, y).lineWidth(0.7).strokeColor(C.gold).stroke()
  // centre diamond
  doc.save()
  doc.translate(mid, y).rotate(45)
  doc.rect(-4, -4, 8, 8).fillColor(C.gold).fillOpacity(0.8).fill()
  doc.restore()
}

function sectionHeader(text, y) {
  doc.font('Helvetica-Bold')
     .fontSize(8)
     .fillColor(C.gold)
     .fillOpacity(1)
     .text(text.toUpperCase(), M, y, { characterSpacing: 2 })
  return doc.y + 4
}

function bodyText(text, y, opts = {}) {
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(opts.color || C.body)
     .fillOpacity(1)
     .text(text, M, y, { width: W - M * 2, lineGap: 3, ...opts })
  return doc.y + 4
}

function bullet(text, y, indent = 16) {
  // diamond bullet
  doc.save()
  doc.translate(M + indent - 8, y + 5).rotate(45)
  doc.rect(-3, -3, 6, 6).fillColor(C.gold).fillOpacity(0.7).fill()
  doc.restore()
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(C.body)
     .fillOpacity(1)
     .text(text, M + indent + 2, y, { width: W - M * 2 - indent - 2, lineGap: 3 })
  return doc.y + 3
}

function tag(text, x, y, w = 120) {
  doc.rect(x, y, w, 18).fillColor(C.accent).fillOpacity(1).fill()
  doc.rect(x, y, w, 18).lineWidth(0.6).strokeColor(C.gold).fillOpacity(0).stroke()
  doc.font('Helvetica').fontSize(8).fillColor(C.gold).fillOpacity(1)
     .text(text, x + 4, y + 5, { width: w - 8, align: 'center' })
}

function tableRow(cols, y, widths, isHeader = false) {
  let x = M
  cols.forEach((col, i) => {
    const w = widths[i]
    doc.rect(x, y, w, 22)
       .fillColor(isHeader ? C.accent : '#0a1828')
       .fillOpacity(1).fill()
    doc.rect(x, y, w, 22)
       .lineWidth(0.5).strokeColor(C.gold).fillOpacity(0.3).stroke()
    doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(isHeader ? 8 : 9)
       .fillColor(isHeader ? C.gold : C.body)
       .fillOpacity(1)
       .text(col, x + 6, y + 7, { width: w - 12, lineBreak: false })
    x += w
  })
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ════════════════════════════════════════════════════════════════════════════
pageBg()
cornerOrnaments()

// Radiating lines (decorative)
doc.save()
doc.opacity(0.05)
for (let i = 0; i < 24; i++) {
  const angle = (i / 24) * Math.PI * 2
  doc.moveTo(W/2, H/2)
     .lineTo(W/2 + Math.cos(angle)*600, H/2 + Math.sin(angle)*600)
     .lineWidth(1).strokeColor(C.gold).stroke()
}
doc.restore()

// Operator tag
doc.font('Helvetica').fontSize(9).fillColor(C.muted).fillOpacity(1)
   .text('SOUTH AFRICAN RAILWAYS  ·  EST. 1910', 0, 190, { align: 'center', characterSpacing: 2 })

// Main title
doc.font('Helvetica-Bold').fontSize(42).fillColor(C.goldLight).fillOpacity(1)
   .text('THE ENCHANTED LINE', 0, 216, { align: 'center', characterSpacing: 3 })

doc.font('Helvetica-Oblique').fontSize(16).fillColor(C.body).fillOpacity(1)
   .text('A Living Museum on Rails', 0, 268, { align: 'center' })

goldDivider(300)

// Hackathon tag
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.gold).fillOpacity(1)
   .text('GEEKULCHA TRAIN TOURISM HACKATHON 2027', 0, 316, { align: 'center', characterSpacing: 1.5 })

// Route
doc.font('Helvetica').fontSize(12).fillColor(C.gold).fillOpacity(0.9)
   .text('PRETORIA  ──────────────►  CAPE TOWN', 0, 344, { align: 'center', characterSpacing: 1 })

doc.font('Helvetica').fontSize(10).fillColor(C.dim).fillOpacity(1)
   .text('1,600 km  ·  9 Chapters  ·  1 Story', 0, 366, { align: 'center' })

goldDivider(394)

// Document subtitle
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.body).fillOpacity(1)
   .text('GO-TO-MARKET STRATEGY', 0, 410, { align: 'center', characterSpacing: 2 })

doc.font('Helvetica').fontSize(10).fillColor(C.muted).fillOpacity(1)
   .text('Differentiation  ·  Pitch Structure  ·  Partnership Targets  ·  Revenue Model', 0, 432, { align: 'center' })

// Bottom card
doc.rect(M, H - 130, W - M*2, 82).fillColor(C.card).fillOpacity(1).fill()
doc.rect(M, H - 130, W - M*2, 82).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.4).stroke()

doc.font('Helvetica').fontSize(9).fillColor(C.muted).fillOpacity(1)
   .text('Built with React · Vite · Tailwind CSS v4 · TypeScript', 0, H - 114, { align: 'center' })
doc.font('Helvetica').fontSize(9).fillColor(C.dim).fillOpacity(1)
   .text('github.com/thecodem-dev/interactive-train-journey-map', 0, H - 96, { align: 'center' })

goldDivider(H - 70)

doc.font('Helvetica').fontSize(8).fillColor(C.dim).fillOpacity(1)
   .text('CONFIDENTIAL  ·  HACKATHON SUBMISSION 2027', 0, H - 56, { align: 'center', characterSpacing: 1.5 })

// ════════════════════════════════════════════════════════════════════════════
// PAGE 2 — CORE POSITIONING + WHAT MAKES YOU STAND OUT
// ════════════════════════════════════════════════════════════════════════════
doc.addPage()
pageBg()
cornerOrnaments()

// Page header
doc.font('Helvetica-Bold').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('THE ENCHANTED LINE  ·  GO-TO-MARKET STRATEGY', M, 26, { characterSpacing: 1.5 })
doc.font('Helvetica').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('02', W - M - 20, 26)
goldDivider(40)

let y = 58

// Section: Core Positioning
y = sectionHeader('Core Positioning', y)

doc.rect(M, y, W - M*2, 52).fillColor(C.card).fillOpacity(1).fill()
doc.rect(M, y, W - M*2, 52).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.5).stroke()
// left gold bar
doc.rect(M, y, 4, 52).fillColor(C.gold).fillOpacity(0.8).fill()

doc.font('Helvetica-Oblique').fontSize(13).fillColor(C.goldLight).fillOpacity(1)
   .text('"The only entry that doesn\'t just show the route —', M + 16, y + 10, { width: W - M*2 - 24 })
doc.font('Helvetica-Oblique').fontSize(13).fillColor(C.goldLight).fillOpacity(1)
   .text('it makes you feel it."', M + 16, y + 28, { width: W - M*2 - 24 })

y += 66

doc.font('Helvetica').fontSize(10).fillColor(C.body).fillOpacity(1)
   .text('Most hackathon entries will build a map with pins. You have built a narrative journey — an animated, multilingual, art-deco experience that treats the rail route as a story, not a database. That is the wedge.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 16

goldDivider(y)
y += 18

// Section: What makes you stand out
y = sectionHeader('What Makes You Stand Out', y)
y += 4

const standouts = [
  {
    num: '01',
    title: 'The Experience Gap',
    body: 'Everyone else will use Google Maps with marker popups. You have a custom SVG map, a moving locomotive, wax-seal passport stamps, and four South African languages built in from day one. The judges will have seen 20 maps before yours. Yours will feel like a product.',
  },
  {
    num: '02',
    title: 'Localisation as a First-Class Feature',
    body: 'The hackathon brief specifically says "localise the train journey." Most teams will add an English-only toggle at best. You already ship English, isiZulu, Afrikaans, and Sesotho. This directly answers the brief — lead with it.',
  },
  {
    num: '03',
    title: 'The Passport Mechanic',
    body: 'The wax-seal stamp collected at each station is a gamification hook nobody else will have. It creates emotional investment and a reason to complete the journey. Frame it explicitly: "We didn\'t build a map. We built a passport."',
  },
  {
    num: '04',
    title: 'Domestic Tourism Answer',
    body: 'The brief asks to promote domestic tourism. Your hidden gems feature — 3 locally curated places per station — is a direct answer. Pitch it as a tool a tourist board could use tomorrow, not a prototype needing six more months.',
  },
]

standouts.forEach(item => {
  if (y > H - 130) { doc.addPage(); pageBg(); cornerOrnaments(); y = 58 }

  doc.rect(M, y, W - M*2, 80).fillColor(C.card).fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, 80).lineWidth(0.6).strokeColor(C.gold).fillOpacity(0.3).stroke()

  // number badge
  doc.rect(M, y, 32, 80).fillColor(C.accent).fillOpacity(1).fill()
  doc.font('Helvetica-Bold').fontSize(16).fillColor(C.gold).fillOpacity(0.7)
     .text(item.num, M, y + 28, { width: 32, align: 'center' })

  doc.font('Helvetica-Bold').fontSize(11).fillColor(C.goldLight).fillOpacity(1)
     .text(item.title, M + 42, y + 10, { width: W - M*2 - 52 })
  doc.font('Helvetica').fontSize(9.5).fillColor(C.body).fillOpacity(1)
     .text(item.body, M + 42, y + 28, { width: W - M*2 - 52, lineGap: 2 })
  y += 90
})

// ════════════════════════════════════════════════════════════════════════════
// PAGE 3 — PITCH STRUCTURE
// ════════════════════════════════════════════════════════════════════════════
doc.addPage()
pageBg()
cornerOrnaments()

doc.font('Helvetica-Bold').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('THE ENCHANTED LINE  ·  GO-TO-MARKET STRATEGY', M, 26, { characterSpacing: 1.5 })
doc.font('Helvetica').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('03', W - M - 20, 26)
goldDivider(40)

y = 58
y = sectionHeader('Pitch Structure — 3-Minute Demo', y)
y += 4

doc.font('Helvetica').fontSize(10).fillColor(C.muted).fillOpacity(1)
   .text('Structure your live demo around this exact sequence. Each beat is designed to land a specific emotional response with the judges.', M, y, { width: W - M*2, lineGap: 3 })
y = doc.y + 14

const pitchBeats = [
  { time: '0:00 – 0:20', title: 'Open with the problem', detail: '"South Africa has 9 UNESCO-worthy rail corridors. Nobody under 35 knows what\'s along them." One stat, one truth, one sentence. No slides needed.' },
  { time: '0:20 – 0:45', title: 'The intro screen lands', detail: 'Show the language picker and ticket card dropping in. Choose isiZulu live. Say: "We asked ourselves — who is this for? It\'s for everyone." Let the conductor greeting update. Pause.' },
  { time: '0:45 – 1:15', title: 'Board the train — the money moment', detail: 'Click "Board the Train." Let the locomotive move across the map. Say nothing for 5 full seconds. Let the room watch it move. This is your gasps moment.' },
  { time: '1:15 – 1:50', title: 'Open one chapter', detail: 'Click Pretoria. Show the heritage paragraph, hidden gems, wax seal. Say: "We didn\'t build a map. We built a passport. Every station you depart stamps your journey."' },
  { time: '1:50 – 2:20', title: 'Show the scale', detail: 'Continue to the next two stations. Show the route line fill behind the train. Show the RouteProgress bar stamps accumulating. "Nine chapters. One living story."' },
  { time: '2:20 – 2:50', title: 'The architecture close', detail: 'One slide: the four-tier diagram. "Today it\'s a React SPA. The backend is designed — Supabase, PostGIS, user progress, realtime. This is a product, not a prototype."' },
  { time: '2:50 – 3:00', title: 'The ask', detail: '"We are asking for the platform and the partnership to put this on every PRASA ticket. Thank you."' },
]

pitchBeats.forEach((beat, i) => {
  if (y > H - 100) { doc.addPage(); pageBg(); cornerOrnaments(); y = 58 }

  const rowH = 58
  // alternating row bg
  doc.rect(M, y, W - M*2, rowH)
     .fillColor(i % 2 === 0 ? C.card : '#081525').fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, rowH)
     .lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()

  // time badge
  doc.rect(M, y, 72, rowH).fillColor(C.accent).fillOpacity(1).fill()
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.gold).fillOpacity(1)
     .text(beat.time, M + 2, y + (rowH/2) - 8, { width: 68, align: 'center' })

  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.goldLight).fillOpacity(1)
     .text(beat.title, M + 82, y + 8, { width: W - M*2 - 90 })
  doc.font('Helvetica').fontSize(9).fillColor(C.body).fillOpacity(1)
     .text(beat.detail, M + 82, y + 24, { width: W - M*2 - 90, lineGap: 2 })
  y += rowH + 4
})

// Judging criteria
y += 10
if (y > H - 160) { doc.addPage(); pageBg(); cornerOrnaments(); y = 58 }

goldDivider(y)
y += 16
y = sectionHeader('Judging Criteria You Will Score On', y)
y += 4

const criteria = [
  ['Creativity / Innovation', 'Art-deco design language, passport mechanic, animated locomotive — nothing else in the room looks like this'],
  ['Technical Execution', 'TypeScript, rAF animation loop, custom SVG map, multilingual state, modular component architecture'],
  ['Relevance to Brief', 'Localisation (4 languages), domestic tourism (hidden gems), full route (9 stations), cultural heritage stories'],
  ['Scalability', 'Four-tier architecture doc shows Supabase backend, PostGIS, user accounts, realtime — a clear production path'],
]

const cw = [140, W - M*2 - 140]
tableRow(['CRITERION', 'HOW YOU SCORE'], y, cw, true)
y += 22
criteria.forEach(row => {
  const rowDoc = new PDFDocument({ size: 'A4' }) // dummy to measure
  // estimate row height
  doc.rect(M, y, W - M*2, 30).fillColor('#0a1828').fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, 30).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.gold).fillOpacity(1)
     .text(row[0], M + 6, y + 8, { width: cw[0] - 12 })
  doc.font('Helvetica').fontSize(9).fillColor(C.body).fillOpacity(1)
     .text(row[1], M + cw[0] + 6, y + 8, { width: cw[1] - 12, lineBreak: false })
  y += 32
})

// ════════════════════════════════════════════════════════════════════════════
// PAGE 4 — POST-HACKATHON STRATEGY
// ════════════════════════════════════════════════════════════════════════════
doc.addPage()
pageBg()
cornerOrnaments()

doc.font('Helvetica-Bold').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('THE ENCHANTED LINE  ·  GO-TO-MARKET STRATEGY', M, 26, { characterSpacing: 1.5 })
doc.font('Helvetica').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('04', W - M - 20, 26)
goldDivider(40)

y = 58
y = sectionHeader('Phase 1 → Phase 3 Roadmap', y)
y += 4

const phases = [
  {
    phase: 'PHASE 1',
    title: 'Hackathon Win',
    period: '2027',
    color: C.gold,
    items: [
      'Execute the 3-minute pitch structure above',
      'Lead with the language picker — it directly answers the brief',
      'Let the train movement silence the room at 45 seconds',
      'Close with the architecture slide to signal product thinking',
    ]
  },
  {
    phase: 'PHASE 2',
    title: 'Post-Hackathon Product',
    period: '2027 – 2028',
    color: C.goldLight,
    items: [
      'Approach South African Tourism (SAT) — they fund exactly this',
      'Pitch PRASA for distribution — URL on every digital ticket',
      'Partner with Shosholoza Meyl / Blue Train for premium positioning',
      'Engage provincial tourism boards (WC, Gauteng, Northern Cape)',
    ]
  },
  {
    phase: 'PHASE 3',
    title: 'Platform Scale',
    period: '2028 – 2029',
    color: C.body,
    items: [
      'Launch user accounts with persistent passport and social sharing',
      'Add audio narration in all 4 languages (conductor voice)',
      'Release embed mode — tourism boards drop station cards on their sites',
      'Open the data API — sell enriched POI data to GetYourGuide, Viator',
    ]
  },
]

phases.forEach(p => {
  if (y > H - 160) { doc.addPage(); pageBg(); cornerOrnaments(); y = 58 }

  doc.rect(M, y, W - M*2, 108).fillColor(C.card).fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, 108).lineWidth(0.8).strokeColor(p.color).fillOpacity(0.4).stroke()
  doc.rect(M, y, 6, 108).fillColor(p.color).fillOpacity(0.9).fill()

  doc.font('Helvetica-Bold').fontSize(8).fillColor(p.color).fillOpacity(1)
     .text(p.phase, M + 16, y + 10, { characterSpacing: 2 })
  doc.font('Helvetica-Bold').fontSize(13).fillColor(C.goldLight).fillOpacity(1)
     .text(p.title, M + 16, y + 22)
  doc.font('Helvetica').fontSize(9).fillColor(C.dim).fillOpacity(1)
     .text(p.period, W - M - 60, y + 24)

  let iy = y + 44
  p.items.forEach(item => {
    doc.save()
    doc.translate(M + 22, iy + 4).rotate(45)
    doc.rect(-3,-3,6,6).fillColor(C.gold).fillOpacity(0.6).fill()
    doc.restore()
    doc.font('Helvetica').fontSize(9.5).fillColor(C.body).fillOpacity(1)
       .text(item, M + 32, iy, { width: W - M*2 - 42, lineGap: 2 })
    iy += 14
  })
  y += 118
})

// ════════════════════════════════════════════════════════════════════════════
// PAGE 5 — REVENUE MODEL + FEATURE ROADMAP
// ════════════════════════════════════════════════════════════════════════════
doc.addPage()
pageBg()
cornerOrnaments()

doc.font('Helvetica-Bold').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('THE ENCHANTED LINE  ·  GO-TO-MARKET STRATEGY', M, 26, { characterSpacing: 1.5 })
doc.font('Helvetica').fontSize(7).fillColor(C.dim).fillOpacity(1)
   .text('05', W - M - 20, 26)
goldDivider(40)

y = 58
y = sectionHeader('Revenue Model', y)
y += 4

const revenue = [
  { stream: 'B2G Licensing', how: 'License the platform to SAT or PRASA as a white-label digital product' },
  { stream: 'Sponsored Stations', how: 'Each station\'s hidden gems section co-branded with provincial tourism boards' },
  { stream: 'School / Education', how: 'Classroom version sold to the DBE — geography, heritage, and language in one tool' },
  { stream: 'API / Data Layer', how: 'Sell enriched POI and cultural data to travel platforms (GetYourGuide, Viator, etc.)' },
]

const rw = [140, W - M*2 - 140]
tableRow(['REVENUE STREAM', 'HOW IT WORKS'], y, rw, true)
y += 22
revenue.forEach((r, i) => {
  doc.rect(M, y, W - M*2, 26).fillColor(i % 2 === 0 ? C.card : '#081525').fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, 26).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.gold).fillOpacity(1)
     .text(r.stream, M + 6, y + 8, { width: rw[0] - 12 })
  doc.font('Helvetica').fontSize(9.5).fillColor(C.body).fillOpacity(1)
     .text(r.how, M + rw[0] + 6, y + 8, { width: rw[1] - 12 })
  y += 26
})

y += 20
goldDivider(y)
y += 18
y = sectionHeader('Feature Roadmap — What Separates You Further', y)
y += 4

const features = [
  { feature: 'Audio Narration', why: 'Conductor\'s voice reads heritage in all 4 languages. Immersive, accessible, unique.', effort: 'Medium' },
  { feature: 'Live Weather Widget', why: 'Current weather at the active station via OpenWeatherMap. Costs nothing, feels magical.', effort: 'Low' },
  { feature: 'User Accounts + Passport', why: 'Log in, stamps persist. Share completed passport as an image on social media.', effort: 'Medium' },
  { feature: 'Per-Station Quiz', why: '3-question heritage quiz unlocked after each chapter. Adds educational value.', effort: 'Low' },
  { feature: 'Offline PWA Mode', why: 'Cache all 9 stations on first load. Works on the train with no signal — the most on-brand feature possible.', effort: 'Low' },
  { feature: 'Embed / Widget Mode', why: 'iframe a single station card. Tourism boards drop it on their own websites.', effort: 'Medium' },
  { feature: 'Google Maps Integration', why: 'Replace the hand-drawn SVG with live satellite / terrain. Richer geography context.', effort: 'Medium' },
]

const fw = [130, W - M*2 - 190, 60]
tableRow(['FEATURE', 'WHY IT MATTERS', 'EFFORT'], y, fw, true)
y += 22
features.forEach((f, i) => {
  const effortColor = f.effort === 'Low' ? '#4a9e6a' : '#c9a45a'
  const rowH = 28
  doc.rect(M, y, W - M*2, rowH).fillColor(i % 2 === 0 ? C.card : '#081525').fillOpacity(1).fill()
  doc.rect(M, y, W - M*2, rowH).lineWidth(0.4).strokeColor(C.gold).fillOpacity(0.2).stroke()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.goldLight).fillOpacity(1)
     .text(f.feature, M + 6, y + 9, { width: fw[0] - 12 })
  doc.font('Helvetica').fontSize(8.5).fillColor(C.body).fillOpacity(1)
     .text(f.why, M + fw[0] + 6, y + 9, { width: fw[1] - 12 })
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(effortColor).fillOpacity(1)
     .text(f.effort, M + fw[0] + fw[1] + 6, y + 9, { width: fw[2] - 12, align: 'center' })
  y += rowH
})

// ════════════════════════════════════════════════════════════════════════════
// PAGE 6 — BACK COVER
// ════════════════════════════════════════════════════════════════════════════
doc.addPage()
pageBg()
cornerOrnaments()

// Radiating lines again
doc.save()
doc.opacity(0.05)
for (let i = 0; i < 24; i++) {
  const angle = (i / 24) * Math.PI * 2
  doc.moveTo(W/2, H/2)
     .lineTo(W/2 + Math.cos(angle)*600, H/2 + Math.sin(angle)*600)
     .lineWidth(1).strokeColor(C.gold).stroke()
}
doc.restore()

goldDivider(220)

doc.font('Helvetica-Bold').fontSize(32).fillColor(C.goldLight).fillOpacity(1)
   .text('THE ENCHANTED LINE', 0, 240, { align: 'center', characterSpacing: 2 })
doc.font('Helvetica-Oblique').fontSize(13).fillColor(C.body).fillOpacity(1)
   .text('A Living Museum on Rails', 0, 282, { align: 'center' })

goldDivider(310)

doc.font('Helvetica-Bold').fontSize(11).fillColor(C.gold).fillOpacity(1)
   .text('"We built the journey, not just the map."', 0, 332, { align: 'center' })

doc.font('Helvetica').fontSize(10).fillColor(C.muted).fillOpacity(1)
   .text('9 Chapters  ·  1,600 km  ·  4 Languages  ·  One Living Story', 0, 360, { align: 'center' })

// Three stat badges
const badges = [
  { label: 'STATIONS', value: '9' },
  { label: 'LANGUAGES', value: '4' },
  { label: 'KM COVERED', value: '1,600' },
]
const bw = 110, bx0 = (W - badges.length * bw - (badges.length - 1) * 16) / 2
badges.forEach((b, i) => {
  const bx = bx0 + i * (bw + 16)
  doc.rect(bx, 390, bw, 50).fillColor(C.card).fillOpacity(1).fill()
  doc.rect(bx, 390, bw, 50).lineWidth(0.8).strokeColor(C.gold).fillOpacity(0.6).stroke()
  doc.font('Helvetica-Bold').fontSize(22).fillColor(C.goldLight).fillOpacity(1)
     .text(b.value, bx, 399, { width: bw, align: 'center' })
  doc.font('Helvetica').fontSize(7).fillColor(C.dim).fillOpacity(1)
     .text(b.label, bx, 424, { width: bw, align: 'center', characterSpacing: 1.5 })
})

goldDivider(462)

doc.font('Helvetica').fontSize(9).fillColor(C.dim).fillOpacity(1)
   .text('Built with React  ·  Vite  ·  Tailwind CSS v4  ·  TypeScript', 0, 478, { align: 'center' })
doc.font('Helvetica').fontSize(9).fillColor(C.gold).fillOpacity(0.7)
   .text('github.com/thecodem-dev/interactive-train-journey-map', 0, 496, { align: 'center' })

doc.font('Helvetica').fontSize(8).fillColor(C.dim).fillOpacity(1)
   .text('GEEKULCHA TRAIN TOURISM HACKATHON 2027', 0, H - 60, { align: 'center', characterSpacing: 1.5 })

// ── Finalise ──────────────────────────────────────────────────────────────
doc.end()
console.log('PDF generated → ' + outPath)
