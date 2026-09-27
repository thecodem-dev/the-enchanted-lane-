/**
 * thema.ts — Thema the rhino's replies.
 *
 * Ported from the team's Gradio prototype (Thema/app.py): the same three
 * guardrails and hand-written answers, now running in the browser — no
 * server, no model, works offline. Station and gem answers are drawn from
 * the app's own data so Thema knows every stop on the line.
 */

import { STATIONS } from '@/data/stations'
import { ATTRACTIONS } from '@/data/attractions'
import { CORRIDOR_GEMS } from '@/data/corridorGems'
import { tagLabel } from '@/lib/gemMatcher'

/* ── 1. Guardrails (from the prototype) ─────────────────────── */

const PII_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email
  /(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}/,              // SA phone number
  /\b\d{13}\b/,                                      // SA ID number
  /\b(?:\d[ -]*?){13,16}\b/,                         // card number
]

const DRUG_KEYWORDS = [
  'drug', 'drugs', 'cocaine', 'heroine', 'meth', 'mandrax', 'weed',
  'cannabis', 'dagga', 'ecstasy', 'pills', 'substance', 'narcotics', 'dealer',
]

/** The prototype's topic words, plus the app's features */
const TOPIC_KEYWORDS = [
  'route', 'train', 'stop', 'station', 'map', 'navigate', 'help', 'how', 'app',
  'gem', 'gems', 'hidden', 'table mountain', 'karoo', 'restaurant', 'food', 'hotel',
  'tour', 'ticket', 'hello', 'hi', 'sawubona', 'dumela', 'molo', 'tsela', 'indlela',
  'museum', 'history', 'heritage', 'weather', 'quiz', 'passport', 'seal', 'stamp',
  'coffee', 'wine', 'stay', 'eat', 'visit', 'see', 'thema', 'rhino', 'journey',
]

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasWord = (text: string, word: string) => new RegExp(`\\b${escapeRe(word)}\\b`).test(text)

const STATION_NAMES = new Set(STATIONS.flatMap(s => Object.values(s.names).map(n => n.toLowerCase())))

/**
 * Each attraction's full name plus its everyday short name:
 * "The Big Hole & Kimberley Mine Museum" → "the big hole". Short names that are
 * just a town ("Klerksdorp Museum" → "klerksdorp") are dropped so the station wins.
 */
const ATTRACTION_NAMES = ATTRACTIONS.map(a => {
  const full = a.name.toLowerCase()
  const core = full.split(/ [—(&]| museum| and /)[0]!.trim()
  return { attraction: a, names: core.length > 6 && !STATION_NAMES.has(core) ? [full, core] : [full] }
})

/** Every place name Thema recognises — stations (in all four languages), attractions, corridor gems and their towns */
const PLACE_WORDS = [
  ...STATION_NAMES,
  ...ATTRACTION_NAMES.flatMap(x => x.names),
  ...CORRIDOR_GEMS.flatMap(g => [g.name.toLowerCase(), g.city.toLowerCase()]),
]

function guardrail(input: string): string | null {
  const text = input.toLowerCase().trim()

  if (PII_PATTERNS.some(p => p.test(input))) {
    return 'For your privacy, please don’t share personal details like emails, phone numbers or ID numbers.'
  }
  if (DRUG_KEYWORDS.some(k => hasWord(text, k))) {
    return 'I can’t answer questions about drugs or illegal substances. Let’s talk about the train route!'
  }
  const onTopic = TOPIC_KEYWORDS.some(k => hasWord(text, k)) || PLACE_WORDS.some(p => text.includes(p))
  if (!onTopic) {
    return [
      'I focus on the **Pretoria to Cape Town line** and the places along it.',
      '',
      'Try asking me about:',
      '• A stop, like **Kimberley** or **Matjiesfontein**',
      '• A hidden gem, like the **Big Hole**',
      '• Where to eat, drink or stay along the way',
    ].join('\n')
  }
  return null
}

/* ── 2. Answers ──────────────────────────────────────────────── */

/** The prototype's hand-written lines, kept word for word */
const SIGNATURE_LINES: Record<string, string> = {
  cape_town: 'Table Mountain in Cape Town is iconic! Take the cable car or hike Skeleton Gorge. / *Lethabo! Table Mountain e Cape Town e ntle le ho feta!*',
  matjiesfontein: 'Matjiesfontein is a historic Victorian outpost in the Great Karoo. Check out the Lord Milner Hotel! / *Indawo enhle kakhulu eKaroo.*',
  kimberley: 'Kimberley is famous for the Big Hole and local diamonds! Be sure to visit the Mine Museum. / *Umlando ocebile kakhulu.*',
}

const firstSentences = (text: string, n: number) => (text.match(/[^.!?]+[.!?]+/g) ?? [text]).slice(0, n).join(' ').trim()
const rand = (spend: number) => `R${spend}`

function helpReply() {
  return [
    'Dumela! I’m Thema, the line’s resident rhino. Ask me about:',
    '',
    `1. **Stops:** ${STATIONS.map(s => s.name).join(', ')}.`,
    '2. **Hidden gems:** museums, heritage sites and local makers along the way.',
    '3. **Food, drink & stays:** coffee, wine, Karoo lamb, a bed for the night.',
    '',
    'You can greet me in English, isiZulu or Sesotho too.',
  ].join('\n')
}

function stationReply(text: string): string | null {
  const station = STATIONS.find(s =>
    Object.values(s.names).some(n => text.includes(n.toLowerCase())) ||
    (s.id === 'cape_town' && text.includes('table mountain')),
  )
  if (!station) return null

  const gems = ATTRACTIONS.filter(a => a.stationId === station.id).map(a => a.name)
  const lines = [
    SIGNATURE_LINES[station.id] ?? `**${station.name}** — ${station.subtitle}. ${firstSentences(station.heritage, 2)}`,
  ]
  if (gems.length) lines.push('', `**Hidden gems here:** ${gems.join(' · ')}.`, 'You’ll find them all on the Hidden Gems page.')
  return lines.join('\n')
}

function attractionReply(text: string): string | null {
  const a = ATTRACTION_NAMES.find(x => x.names.some(n => text.includes(n)))?.attraction
  if (!a) return null
  const station = STATIONS.find(s => s.id === a.stationId)
  return [
    `**${a.name}**${station ? ` · ${station.name}` : ''}`,
    `*${a.tagline}*`,
    '',
    firstSentences(a.description, 2),
    '',
    `${a.priceZAR === 0 ? 'Free entry' : `Entry ${rand(a.priceZAR)} p.p.`} · ${a.duration} · ${a.openingHours}`,
  ].join('\n')
}

function corridorGemReply(text: string): string | null {
  const g = CORRIDOR_GEMS.find(x => text.includes(x.name.toLowerCase()))
  if (!g) return null
  return [
    `**${g.name}** · ${g.city}, ${g.province}`,
    `${g.category} — around ${rand(g.avgSpend)} a person (${g.priceBand}).`,
    `Good for: ${g.tags.map(tagLabel).join(', ')}.`,
    g.backupPower ? 'Backup power is ready, so load-shedding won’t spoil the visit.' : 'Heads up: no guaranteed backup power during load-shedding.',
  ].join('\n')
}

/** Topic answers that point at the Gem Matcher's local makers */
function pickGems(tags: string[], n = 3) {
  return CORRIDOR_GEMS
    .filter(g => g.tags.some(t => tags.includes(t)))
    .sort((a, b) => b.intlRating - a.intlRating)
    .slice(0, n)
    .map(g => `• **${g.name}**, ${g.city}`)
}

function topicReply(text: string): string | null {
  if (/\b(food|eat|restaurant|lunch|dinner|hungry)\b/.test(text)) {
    return ['Hungry? A few local favourites along the corridor:', '', ...pickGems(['traditional_food', 'karoo_lamb', 'seafood', 'cape_malay', 'local_food']), '', 'The **Gem Matcher** on the Hidden Gems page finds more by budget and taste.'].join('\n')
  }
  if (/\b(coffee|bakery|breakfast)\b/.test(text)) {
    return ['For coffee and something baked:', '', ...pickGems(['coffee', 'bakery', 'sourdough', 'pastries'])].join('\n')
  }
  if (/\b(wine|gin|beer|drink)\b/.test(text)) {
    return ['Raise a glass at:', '', ...pickGems(['wine', 'gin', 'craft_beer', 'tasting'])].join('\n')
  }
  if (/\b(hotel|stay|overnight|sleep)\b/.test(text)) {
    return ['For a night off the train:', '', ...pickGems(['boutique_stay', 'overnight']), '', 'And in Matjiesfontein, the **Lord Milner Hotel** is a Victorian classic.'].join('\n')
  }
  if (/\bweather\b/.test(text)) {
    return 'Live weather for every stop is on the journey map, and the current station’s forecast sits in the top bar.'
  }
  if (/\b(quiz)\b/.test(text)) {
    return 'The journey quiz unlocks questions as the train reaches each station — knowledge earned on the way! Find it in the menu.'
  }
  if (/\b(passport|seal|stamp)\b/.test(text)) {
    return 'Each time the train leaves a station, a wax seal is pressed into your passport. Collect all nine on the way to Cape Town.'
  }
  return null
}

const GREETING = 'Sawubona! Ask me anything about train stops, restaurants, or hidden gems along the Pretoria to Cape Town route!'

/** Thema's reply to one message */
export function themaReply(input: string): string {
  const blocked = guardrail(input)
  if (blocked) return blocked

  const text = input.toLowerCase()
  if (['how to use', 'how do i use', 'use this app', 'what can you do', 'navigate', 'help', 'tsela', 'indlela'].some(k => text.includes(k))) return helpReply()

  return corridorGemReply(text)
    ?? attractionReply(text)
    ?? stationReply(text)
    ?? topicReply(text)
    ?? GREETING
}

export const THEMA_WELCOME = 'Dumela! I’m **Thema**, the line’s resident rhino. Ask me about any stop, a hidden gem, or where to eat along the way.'

export const THEMA_SUGGESTIONS = [
  'What’s special about Kimberley?',
  'Where can I eat along the way?',
  'Tell me about Matjiesfontein',
  'How do I use this app?',
]
