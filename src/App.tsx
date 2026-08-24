/**
 * App.tsx — Interactive Train Journey Map
 *
 * A React single-page application that simulates a heritage train journey
 * from Pretoria to Cape Town across 9 stations. Features:
 *   - Animated train movement along an SVG route map of South Africa
 *   - Per-station heritage stories and "hidden gems"
 *   - Multi-language support (English, isiZulu, Afrikaans, Sesotho)
 *   - Art-deco visual theme with wax-seal passport stamps
 *
 * State flow:
 *   IntroScreen (phase='intro') → JourneyView (phase='journey')
 *   JourneyView manages train position via requestAnimationFrame animation
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Supported UI languages */
type Language = 'en' | 'zu' | 'af' | 'st'

/** App phase — intro splash or the main journey */
type Phase = 'intro' | 'journey'

/** A single stop on the route, with localised names and content */
interface Station {
  id: string               // Unique identifier used as React key and Set member
  name: string             // Default English name
  subtitle: string         // Short tagline displayed beneath the name
  num: string              // Roman numeral chapter number (I–IX)
  x: number                // SVG x coordinate on the map (viewBox 0–870)
  y: number                // SVG y coordinate on the map (viewBox 0–660)
  heritage: string         // Long-form heritage paragraph shown in ChapterPanel
  gems: string[]           // Three "hidden gem" bullet points for the station
  names: Record<Language, string>  // Localised station names
  terrain: string          // Terrain type label (highveld | karoo | winelands | cape)
}

// ─── Static Data ──────────────────────────────────────────────────────────────

/**
 * All nine stations in journey order (Pretoria → Cape Town).
 * Coordinates are hand-tuned to match the simplified South Africa polygon below.
 */
const STATIONS: Station[] = [
  {
    id: 'pretoria', name: 'Pretoria', subtitle: 'Jacaranda City', num: 'I', x: 620, y: 180,
    terrain: 'highveld',
    heritage: "Founded in 1855, Pretoria is South Africa's administrative capital. Each October, over 70,000 jacaranda trees transform the city into a purple dreamscape — a spectacle so beloved it has become the city's defining identity. The Union Buildings, seat of government, survey it all from a ridge above the city.",
    gems: [
      'Melrose House — where the Treaty of Vereeniging ended the Anglo-Boer War',
      'Wonderboom Nature Reserve — a 1,000-year-old wild fig tree, one living being',
      'Pierneef Museum — treasures of South African landscape art'
    ],
    names: { en: 'Pretoria', zu: 'ePitoli', af: 'Pretoria', st: 'Pitori' }
  },
  {
    id: 'johannesburg', name: 'Johannesburg', subtitle: 'City of Gold', num: 'II', x: 596, y: 220,
    terrain: 'highveld',
    heritage: "Born from the 1886 gold rush on the Witwatersrand, Johannesburg rose from a surveyor's tent city to a metropolis of five million in barely a century — the fastest-growing city in recorded history at its founding. eGoli, place of gold, it was named with earned pride.",
    gems: [
      'Gold Reef City — descend 250 metres into a working mine shaft',
      'Constitution Hill — from apartheid prison to democracy\'s citadel',
      'Maboneng Precinct — Africa\'s most vibrant creative quarter'
    ],
    names: { en: 'Johannesburg', zu: 'eGoli', af: 'Johannesburg', st: 'Johanesboko' }
  },
  {
    id: 'klerksdorp', name: 'Klerksdorp', subtitle: 'Ancient Spheres', num: 'III', x: 532, y: 290,
    terrain: 'highveld',
    heritage: "One of South Africa's oldest European settlements, Klerksdorp sits at the edge of the Highveld. Nearby farms have yielded the Klerksdorp spheres — 2.8-billion-year-old grooved metallic objects that predate complex life on Earth. Their origin remains one of geology's most intriguing mysteries.",
    gems: [
      'Faan Meintjes Nature Reserve — black wildebeest and springbok',
      'Klerksdorp Museum — the ancient spheres, close enough to touch',
      'Goedgegun Dam — waterbirds and wind, the sound of the interior'
    ],
    names: { en: 'Klerksdorp', zu: 'Klerksdorp', af: 'Klerksdorp', st: 'Klerksdorp' }
  },
  {
    id: 'kimberley', name: 'Kimberley', subtitle: 'Diamond Capital', num: 'IV', x: 428, y: 358,
    terrain: 'karoo',
    heritage: "The Big Hole is the largest hand-dug excavation on Earth — 97 metres deep and 463 metres wide, carved by 50,000 miners between 1871 and 1914. From this pit came 2,722 kilograms of diamonds that rewrote South Africa's destiny and lured the ambitions of empire.",
    gems: [
      "The Big Hole & Kimberley Mine Museum — mankind's greatest pit, still open",
      'McGregor Museum — the full story of colonial ambition in the Northern Cape',
      "Rudd House — Cecil Rhodes's Kimberley residence, frozen in 1890"
    ],
    names: { en: 'Kimberley', zu: 'eKimberley', af: 'Kimberley', st: 'Kimbele' }
  },
  {
    id: 'de_aar', name: 'De Aar', subtitle: 'Heart of the Rails', num: 'V', x: 382, y: 432,
    terrain: 'karoo',
    heritage: '"The Vein" — De Aar\'s Dutch name describes exactly what it is: the pulsing artery through which South Africa\'s rail network converges. At its steam-age peak, De Aar operated one of the largest locomotive workshops in the Southern Hemisphere — a cathedral of grease, iron, and ambition.',
    gems: [
      'SAR Locomotive Shed — heritage steam engines preserved in situ',
      'The Karoo sky — among the continent\'s darkest night skies, no horizon',
      'Vanderkloof Dam — 60 kilometres of shoreline and absolute silence'
    ],
    names: { en: 'De Aar', zu: 'De Aar', af: 'De Aar', st: 'De Aar' }
  },
  {
    id: 'beaufort_west', name: 'Beaufort West', subtitle: 'Karoo Gateway', num: 'VI', x: 298, y: 496,
    terrain: 'karoo',
    heritage: "The oldest town in the Great Karoo, Beaufort West is the birthplace of Christiaan Barnard, who performed the world's first successful heart transplant in 1967. The Karoo National Park begins at the town's doorstep — a prehistoric landscape of fossils, flat-topped koppies, and geological time made visible.",
    gems: [
      'Karoo National Park — Cape mountain zebra, aardwolf, and caracal',
      'Schreiner House — birthplace of novelist Olive Schreiner',
      'Nuweveld Plateau — Triassic and Jurassic fossils locked in ancient shale'
    ],
    names: { en: 'Beaufort West', zu: 'Beaufort West', af: 'Beaufort-Wes', st: 'Beaufort-Wes' }
  },
  {
    id: 'matjiesfontein', name: 'Matjiesfontein', subtitle: 'Frozen in Time', num: 'VII', x: 210, y: 534,
    terrain: 'karoo',
    heritage: "South Africa's most perfectly preserved Victorian village — a National Monument where time stopped in 1884. Founded by Scottish immigrant James Douglas Logan, every original building stands. A single red London double-decker bus serves as the town taxi. The Lord Milner Hotel has operated unchanged for 140 years.",
    gems: [
      'Lord Milner Hotel — colonial grandeur, utterly unchanged since 1884',
      "Logan's Cottage Museum — the full Victorian story told in miniature",
      'The station platform under Karoo stars — the greatest free theatre in Africa'
    ],
    names: { en: 'Matjiesfontein', zu: 'Matjiesfontein', af: 'Matjiesfontein', st: 'Matjiesfontein' }
  },
  {
    id: 'worcester', name: 'Worcester', subtitle: 'Valley of Vineyards', num: 'VIII', x: 152, y: 554,
    terrain: 'winelands',
    heritage: "Worcester presides over the Breede River Valley, cradled by the Hex River Mountains whose peaks carry snow each winter. South Africa's largest wine grape producing valley, the region blends pastoral grandeur with a living Cape Colony tradition that stretches back to the earliest settlers.",
    gems: [
      'Hex River Valley — snow-capped peaks above the table grape farms',
      'Kleinplasie Open Air Museum — brandy distilling and rusk-baking, live',
      "Bain's Kloof Pass — one of the finest mountain passes in Africa"
    ],
    names: { en: 'Worcester', zu: 'Worcester', af: 'Worcester', st: 'Worcester' }
  },
  {
    id: 'cape_town', name: 'Cape Town', subtitle: 'Mother City', num: 'IX', x: 104, y: 566,
    terrain: 'cape',
    heritage: "Founded by the Dutch East India Company in 1652, Cape Town is Africa's oldest colonial city. Table Mountain — one of the Seven Natural Wonders of the World — watches over a city of extraordinary diversity and resilience. Your journey ends here. The story of the Cape is only beginning.",
    gems: [
      'Bo-Kaap — painted houses and 400 years of Cape Malay heritage',
      'Boulders Beach, Simon\'s Town — African penguins at arm\'s reach',
      "Signal Hill at sunset — the whole bay ablaze, every evening, free"
    ],
    names: { en: 'Cape Town', zu: 'iKapa', af: 'Kaapstad', st: 'Motse wa Kapa' }
  },
]

/** Language picker options — code, English label, and localised "Continue" word */
const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'Continue' },
  { code: 'zu', label: 'isiZulu', native: 'Qhubeka' },
  { code: 'af', label: 'Afrikaans', native: 'Voortgaan' },
  { code: 'st', label: 'Sesotho', native: 'Tswela pele' },
]

/** Conductor greeting shown at the bottom of the intro screen per language */
const CONDUCTOR_GREETING: Record<Language, string> = {
  en: 'Good evening, passengers. Your conductor speaks English.',
  zu: 'Sawubona, izidluli. Umlayeli wenu ukhuluma isiZulu.',
  af: 'Goeie aand, passasiers. U geleier praat Afrikaans.',
  st: 'Dumelang, baeti. Motsamaisi wa hao o bua Sesotho.',
}

// ─── SVG Map Constants ────────────────────────────────────────────────────────

/**
 * Simplified art-deco polygon outlining South Africa's border.
 * Used both as the filled landmass and as a clip path for terrain overlays.
 * Coordinates are in the SVG viewBox space (0 0 870 660).
 */
const SA_POLY_POINTS =
  '90,50 500,45 800,48 858,162 858,285 838,358 818,425 776,472 726,510 682,542 636,560 586,570 528,576 472,578 414,574 388,577 328,558 278,546 230,540 188,548 148,552 118,562 96,548 75,508 55,428 38,340 18,295 42,210 90,50'

/**
 * Polygon point strings for terrain tint overlays clipped to SA_POLY_POINTS.
 * These are purely decorative colour washes to hint at biome regions.
 */
const TERRAIN_AREAS = {
  karoo: '382,432 428,358 350,350 280,390 250,450 298,496 382,432',
  highveld: '532,290 596,220 620,180 660,185 680,250 640,310 560,320 532,290',
}

// ─── Root Component ───────────────────────────────────────────────────────────

/**
 * App — top-level component.
 *
 * Manages:
 *  - phase: which screen is shown (intro or journey)
 *  - lang: the active UI language
 *  - stIdx: index of the current station the train is AT (or just left)
 *  - tProg: 0→1 interpolation progress between stIdx and stIdx+1
 *  - awoken: Set of station IDs the user has unlocked (visited or passed)
 *  - completed: Set of station IDs the train has fully departed from
 *  - activeStation: the station whose ChapterPanel is currently open
 *  - isMoving: true while the rAF animation loop is running
 *  - newlyAwoken: station ID that just got unlocked (triggers flash banner)
 */
export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [lang, setLang] = useState<Language>('en')

  // Current station index and animation progress (0–1) to the next station
  const [stIdx, setStIdx] = useState(0)
  const [tProg, setTProg] = useState(0)

  // Sets tracking which chapters have been revealed and which are fully done
  const [awoken, setAwoken] = useState<Set<string>>(new Set(['pretoria']))
  const [activeStation, setActiveStation] = useState<Station | null>(STATIONS[0])
  const [isMoving, setIsMoving] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  // ID of the station that was just unlocked — triggers the "Chapter Unlocked" flash
  const [newlyAwoken, setNewlyAwoken] = useState<string | null>(null)

  // Ref keeps stIdx readable inside the rAF callback without recreating the loop
  const stIdxRef = useRef(stIdx)
  useEffect(() => { stIdxRef.current = stIdx }, [stIdx])

  /**
   * Compute the train's current SVG position by linearly interpolating
   * between the current station and the next one using tProg.
   * Memoised so it only recalculates when stIdx or tProg change.
   */
  const trainPos = useMemo(() => {
    const a = STATIONS[stIdx]
    const b = STATIONS[Math.min(stIdx + 1, STATIONS.length - 1)]
    return { x: a.x + (b.x - a.x) * tProg, y: a.y + (b.y - a.y) * tProg }
  }, [stIdx, tProg])

  /**
   * Animation loop — runs while isMoving is true.
   * Increments tProg each frame; when it reaches 1 the train has arrived:
   *   - isMoving is cleared
   *   - stIdx advances
   *   - the new station is added to awoken and activeStation is updated
   *   - newlyAwoken triggers the banner, then clears after 1.5 s
   */
  useEffect(() => {
    if (!isMoving) return
    const speed = 0.0028  // Fraction of the segment completed per frame (~60 fps → ~6 s per segment)
    let raf: number
    const tick = () => {
      setTProg(prev => {
        const next = prev + speed
        if (next >= 1) {
          setIsMoving(false)
          const nextIdx = stIdxRef.current + 1
          if (nextIdx < STATIONS.length) {
            setStIdx(nextIdx)
            setTProg(0)
            setCompleted(c => new Set([...c, STATIONS[stIdxRef.current].id]))
            setAwoken(a => new Set([...a, STATIONS[nextIdx].id]))
            setActiveStation(STATIONS[nextIdx])
            setNewlyAwoken(STATIONS[nextIdx].id)
            setTimeout(() => setNewlyAwoken(null), 1500)
          }
          return 0
        }
        raf = requestAnimationFrame(tick)
        return next
      })
    }
    raf = requestAnimationFrame(tick)
    // Cleanup: cancel any pending rAF if the effect re-runs before animation ends
    return () => cancelAnimationFrame(raf)
  }, [isMoving])

  /**
   * Triggered by the "Depart" / "Continue Journey" buttons.
   * Clears the active chapter panel and starts the animation loop.
   */
  const handleContinue = useCallback(() => {
    if (stIdx >= STATIONS.length - 1) return  // Already at the final station
    setActiveStation(null)
    setIsMoving(true)
  }, [stIdx])

  // ── Render ──────────────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <IntroScreen
        lang={lang}
        setLang={setLang}
        onBegin={() => { setPhase('journey') }}
      />
    )
  }

  return (
    <JourneyView
      lang={lang}
      stIdx={stIdx}
      tProg={tProg}
      trainPos={trainPos}
      awoken={awoken}
      completed={completed}
      activeStation={activeStation}
      newlyAwoken={newlyAwoken}
      isMoving={isMoving}
      onStationClick={(s) => { if (awoken.has(s.id)) setActiveStation(s) }}
      onCloseChapter={() => setActiveStation(null)}
      onContinue={handleContinue}
    />
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

/**
 * IntroScreen — the landing "ticket" splash shown before the journey begins.
 *
 * Renders:
 *  - Decorative starfield and art-deco radiating lines (purely CSS/SVG)
 *  - A styled ticket card with the route summary
 *  - A 2×2 language picker grid
 *  - A "Board the Train" CTA button that transitions to JourneyView
 */
function IntroScreen({
  lang,
  setLang,
  onBegin,
}: {
  lang: Language
  setLang: (l: Language) => void
  onBegin: () => void
}) {
  return (
    <div
      style={{ background: '#06101c', fontFamily: "'Libre Franklin', sans-serif" }}
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Starfield — 80 gold dots scattered using a golden-ratio offset pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
        {Array.from({ length: 80 }, (_, i) => (
          <circle
            key={i}
            cx={`${(i * 137.508) % 100}%`}
            cy={`${(i * 89.3) % 100}%`}
            r={i % 3 === 0 ? 1.2 : 0.7}
            fill="#c9a45a"
            opacity={0.3 + (i % 5) * 0.12}
          />
        ))}
      </svg>

      {/* Art-deco radiating lines emanating from the center of the screen */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }}>
        <defs>
          <radialGradient id="rayFade" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="#c9a45a" stopOpacity="1" />
            <stop offset="100%" stopColor="#c9a45a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const cx = 50, cy = 50
          const ex = cx + Math.cos(angle) * 80
          const ey = cy + Math.sin(angle) * 80
          return (
            <line
              key={i}
              x1={`${cx}%`} y1={`${cy}%`}
              x2={`${ex}%`} y2={`${ey}%`}
              stroke="#c9a45a" strokeWidth="1"
            />
          )
        })}
      </svg>

      {/* Main card — fades up on mount via CSS keyframe */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8"
        style={{ animation: 'introFadeUp 1s ease-out both', maxWidth: 560 }}
      >
        {/* Horizontal art-deco ornament above the ticket */}
        <ArtDecoOrnament />

        {/* Ticket card */}
        <div
          style={{
            animation: 'ticketDrop 0.9s ease-out 0.3s both',
            background: 'linear-gradient(135deg, #0e1e35 0%, #112540 100%)',
            border: '1px solid #c9a45a',
            borderRadius: 2,
            padding: '28px 40px 24px',
            marginBottom: 36,
            position: 'relative',
            boxShadow: '0 0 40px rgba(201,164,90,0.15), 0 8px 32px rgba(0,0,0,0.6)',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* Four corner ornaments — tl / tr / bl / br */}
          {['tl', 'tr', 'bl', 'br'].map(pos => (
            <CornerOrnament key={pos} position={pos as 'tl' | 'tr' | 'bl' | 'br'} />
          ))}

          {/* Subtle inner double-border effect */}
          <div style={{
            position: 'absolute', inset: 6,
            border: '1px solid rgba(201,164,90,0.3)',
            borderRadius: 1,
            pointerEvents: 'none',
          }} />

          {/* Operator tag */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.25em',
            color: '#8fa4bc',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            South African Railways · Est. 1910
          </div>

          {/* Main title */}
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 700,
            color: '#e8c97a',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            The Enchanted Line
          </div>

          {/* Subtitle */}
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            fontStyle: 'italic',
            color: '#ede3cc',
            marginBottom: 20,
            letterSpacing: '0.06em',
          }}>
            A Living Museum on Rails
          </div>

          {/* Route indicator with dashed arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: '#c9a45a', letterSpacing: '0.1em' }}>
              PRETORIA
            </span>
            <svg width="80" height="12" viewBox="0 0 80 12">
              <line x1="0" y1="6" x2="72" y2="6" stroke="#c9a45a" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points="72,3 80,6 72,9" fill="#c9a45a" />
            </svg>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: '#c9a45a', letterSpacing: '0.1em' }}>
              CAPE TOWN
            </span>
          </div>

          {/* Journey stats */}
          <div style={{ fontFamily: "'DM Mono'", fontSize: 10, color: '#7a5e2a', letterSpacing: '0.08em' }}>
            1,600 km · 9 Chapters · 1 Story
          </div>
        </div>

        {/* Language picker — 2×2 grid of toggle buttons */}
        <div style={{
          animation: 'introFadeUp 0.8s ease-out 0.7s both',
          marginBottom: 32,
          width: '100%',
          maxWidth: 480,
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: '#8fa4bc',
            marginBottom: 14,
            letterSpacing: '0.06em',
          }}>
            Which tongue shall the conductor speak?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  background: lang === l.code
                    ? 'linear-gradient(135deg, #1a3050, #1e3d60)'
                    : 'transparent',
                  border: `1px solid ${lang === l.code ? '#c9a45a' : 'rgba(201,164,90,0.3)'}`,
                  borderRadius: 2,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: lang === l.code ? '#e8c97a' : '#ede3cc',
                  letterSpacing: '0.04em',
                }}>
                  {l.label}
                </span>
                {/* Active indicator diamond */}
                {lang === l.code && (
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <rect x="0" y="0" width="8" height="8" fill="#c9a45a" transform="rotate(45 4 4)" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA — transitions to JourneyView */}
        <button
          onClick={onBegin}
          style={{
            animation: 'introFadeUp 0.8s ease-out 0.9s both',
            background: 'linear-gradient(135deg, #c9a45a 0%, #e8c97a 50%, #c9a45a 100%)',
            backgroundSize: '200% 100%',
            border: 'none',
            borderRadius: 2,
            padding: '14px 48px',
            cursor: 'pointer',
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            letterSpacing: '0.2em',
            fontWeight: 500,
            textTransform: 'uppercase',
            color: '#06101c',
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(201,164,90,0.3)',
          }}
          onMouseEnter={e => {
            const t = e.currentTarget
            t.style.boxShadow = '0 6px 30px rgba(201,164,90,0.5)'
            t.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const t = e.currentTarget
            t.style.boxShadow = '0 4px 20px rgba(201,164,90,0.3)'
            t.style.transform = 'translateY(0)'
          }}
        >
          Board the Train
        </button>

        {/* Localised conductor greeting */}
        <div style={{
          animation: 'introFadeUp 0.8s ease-out 1.1s both',
          fontFamily: "'DM Mono'",
          fontSize: 10,
          color: '#4a6080',
          marginTop: 20,
          letterSpacing: '0.12em',
        }}>
          {CONDUCTOR_GREETING[lang]}
        </div>
      </div>
    </div>
  )
}

// ─── Journey View ────────────────────────────────────────────────────────────

/**
 * JourneyView — the main screen shown once the user boards the train.
 *
 * Layout:
 *  ┌─────────────────────────────────────────┐
 *  │  Top bar (title + progress)             │  52 px
 *  ├───────────────────────┬─────────────────┤
 *  │  MapSVG               │  ChapterPanel   │  flex-1
 *  │  (interactive map)    │  (optional)     │
 *  ├───────────────────────┴─────────────────┤
 *  │  RouteProgress bar                      │  72 px
 *  └─────────────────────────────────────────┘
 *
 * The ChapterPanel slides in from the right when a station is active.
 * The "Depart" button is shown at the bottom of the map when stationary.
 */
function JourneyView({
  lang, stIdx, tProg, trainPos, awoken, completed,
  activeStation, newlyAwoken, isMoving,
  onStationClick, onCloseChapter, onContinue,
}: {
  lang: Language
  stIdx: number
  tProg: number
  trainPos: { x: number; y: number }
  awoken: Set<string>
  completed: Set<string>
  activeStation: Station | null
  newlyAwoken: string | null
  isMoving: boolean
  onStationClick: (s: Station) => void
  onCloseChapter: () => void
  onContinue: () => void
}) {
  // True once the train has arrived at the last station and stopped
  const isComplete = stIdx >= STATIONS.length - 1 && !isMoving

  return (
    <div
      style={{ background: '#06101c', fontFamily: "'Libre Franklin', sans-serif" }}
      className="w-full h-screen flex flex-col overflow-hidden"
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        height: 52,
        borderBottom: '1px solid rgba(201,164,90,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 24,
        paddingRight: 24,
        flexShrink: 0,
        background: 'rgba(6,16,28,0.95)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Brand mark — small locomotive icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect x="1" y="7" width="16" height="6" rx="2" fill="none" stroke="#c9a45a" strokeWidth="1.2" />
            <rect x="4" y="3" width="10" height="5" rx="1" fill="none" stroke="#c9a45a" strokeWidth="1.2" />
            <circle cx="4.5" cy="14" r="1.5" fill="#c9a45a" />
            <circle cx="13.5" cy="14" r="1.5" fill="#c9a45a" />
            <line x1="1" y1="9.5" x2="0" y2="9.5" stroke="#c9a45a" strokeWidth="1.5" />
            <rect x="7" y="5" width="2" height="3" fill="#c9a45a" opacity="0.5" />
            <rect x="10" y="5" width="2" height="3" fill="#c9a45a" opacity="0.5" />
          </svg>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
            color: '#e8c97a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            The Enchanted Line
          </span>
        </div>

        {/* Chapter counter + thin progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#8fa4bc',
            letterSpacing: '0.12em',
          }}>
            Chapter {STATIONS[stIdx]?.num ?? 'I'} of IX
          </span>
          {/* Track progress: (stIdx + tProg) / totalStations as a percentage */}
          <div style={{ width: 80, height: 3, background: 'rgba(201,164,90,0.2)', borderRadius: 2 }}>
            <div style={{
              width: `${((stIdx + tProg) / (STATIONS.length - 1)) * 100}%`,
              height: '100%',
              background: '#c9a45a',
              borderRadius: 2,
              transition: 'width 0.1s linear',
            }} />
          </div>
        </div>
      </div>

      {/* ── Main content area ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Map area — fills all available horizontal space left of ChapterPanel */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapSVG
            stIdx={stIdx}
            trainPos={trainPos}
            awoken={awoken}
            completed={completed}
            newlyAwoken={newlyAwoken}
            lang={lang}
            onStationClick={onStationClick}
          />

          {/* "Chapter Unlocked" banner — fades in/out via CSS animation */}
          {newlyAwoken && (
            <div style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'awakenStation 0.8s ease-out forwards',
              background: 'linear-gradient(135deg, rgba(14,30,53,0.95), rgba(17,37,64,0.95))',
              border: '1px solid #c9a45a',
              borderRadius: 2,
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              zIndex: 50,
              pointerEvents: 'none',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="0" y="0" width="10" height="10" fill="#c9a45a" transform="rotate(45 5 5)" />
              </svg>
              <span style={{
                fontFamily: "'DM Mono'",
                fontSize: 11,
                letterSpacing: '0.15em',
                color: '#e8c97a',
                textTransform: 'uppercase',
              }}>
                Chapter Unlocked
              </span>
            </div>
          )}

          {/* "Depart" button — only shown when stationary and journey not finished */}
          {!isMoving && activeStation && !isComplete && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <button
                onClick={onContinue}
                style={{
                  background: 'linear-gradient(135deg, #c9a45a, #e8c97a)',
                  border: 'none',
                  borderRadius: 2,
                  padding: '10px 32px',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono'",
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#06101c',
                  fontWeight: 500,
                  boxShadow: '0 4px 16px rgba(201,164,90,0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,164,90,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,164,90,0.3)' }}
              >
                Depart for {STATIONS[stIdx + 1]?.names[lang] ?? ''}
              </button>
            </div>
          )}

          {/* Journey complete message */}
          {isComplete && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 20, textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 16,
                color: '#e8c97a',
                letterSpacing: '0.06em',
              }}>
                Journey Complete — Welcome to iKapa
              </div>
            </div>
          )}
        </div>

        {/* Chapter panel — slides in from the right when a station is active */}
        {activeStation && (
          <ChapterPanel
            station={activeStation}
            lang={lang}
            completed={completed}
            isComplete={isComplete}
            onClose={onCloseChapter}
            onContinue={onContinue}
            stIdx={stIdx}
          />
        )}
      </div>

      {/* ── Bottom route progress bar ─────────────────────────────────────────── */}
      <RouteProgress
        awoken={awoken}
        completed={completed}
        stations={STATIONS}
        lang={lang}
        stIdx={stIdx}
        tProg={tProg}
        onStationClick={(s) => { if (awoken.has(s.id)) onStationClick(s) }}
      />
    </div>
  )
}

// ─── Map SVG ─────────────────────────────────────────────────────────────────

/**
 * MapSVG — the interactive SVG map of South Africa.
 *
 * Renders (back to front):
 *  1. Ocean background with dot pattern
 *  2. Art-deco corner rays
 *  3. Decorative frame borders
 *  4. SA land polygon + hatch texture + terrain tints
 *  5. Compass rose and scale bar
 *  6. Dashed ghost route lines between every station pair
 *  7. Solid "visited" route lines drawn up to the train's current position
 *  8. Radial glow circles around unlocked stations
 *  9. Diamond station markers (clickable when unlocked)
 * 10. Train glow aura + TrainSprite
 */
function MapSVG({
  stIdx, trainPos, awoken, completed, newlyAwoken, lang, onStationClick,
}: {
  stIdx: number
  trainPos: { x: number; y: number }
  awoken: Set<string>
  completed: Set<string>
  newlyAwoken: string | null
  lang: Language
  onStationClick: (s: Station) => void
}) {
  return (
    <svg
      viewBox="0 0 870 660"
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Subtle dot grid for the ocean area */}
        <pattern id="oceanDots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="0.7" fill="#c9a45a" opacity="0.12" />
        </pattern>

        {/* 45° hatch lines for the land texture overlay */}
        <pattern id="landHatch" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="8" y2="0" stroke="#1a3050" strokeWidth="0.8" />
        </pattern>

        {/* Radial glow used for unlocked (awoken) station markers */}
        <radialGradient id="stationGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c97a" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#c9a45a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c9a45a" stopOpacity="0" />
        </radialGradient>

        {/* Brighter glow for the currently active station */}
        <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c97a" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#c9a45a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9a45a" stopOpacity="0" />
        </radialGradient>

        {/* White-to-gold glow behind the moving train sprite */}
        <radialGradient id="trainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e8c97a" stopOpacity="0" />
        </radialGradient>

        {/* Clip path restricts terrain overlays to inside the SA polygon */}
        <clipPath id="saClip">
          <polygon points={SA_POLY_POINTS} />
        </clipPath>
      </defs>

      {/* Ocean background */}
      <rect width="870" height="660" fill="#060f1a" />
      <rect width="870" height="660" fill="url(#oceanDots)" />

      {/* Art-deco corner rays — very low opacity, purely decorative */}
      {[[0, 0], [870, 0], [0, 660], [870, 660]].map(([cx, cy], i) => (
        <g key={i} opacity="0.04">
          {Array.from({ length: 8 }, (_, j) => {
            const baseAngle = [45, 135, 315, 225][i]
            const angle = ((baseAngle + (j - 3.5) * 8) * Math.PI) / 180
            return (
              <line
                key={j}
                x1={cx} y1={cy}
                x2={cx + Math.cos(angle) * 500}
                y2={cy + Math.sin(angle) * 500}
                stroke="#c9a45a" strokeWidth="1"
              />
            )
          })}
        </g>
      ))}

      {/* Double decorative frame around the entire map */}
      <rect x="12" y="12" width="846" height="636" fill="none" stroke="rgba(201,164,90,0.2)" strokeWidth="1" />
      <rect x="18" y="18" width="834" height="624" fill="none" stroke="rgba(201,164,90,0.08)" strokeWidth="0.5" />

      {/* South Africa land polygon */}
      <polygon
        points={SA_POLY_POINTS}
        fill="#0c1e35"
        stroke="#c9a45a"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Cross-hatch texture overlay on the land */}
      <polygon points={SA_POLY_POINTS} fill="url(#landHatch)" opacity="0.6" />

      {/* Karoo terrain tint — warm amber wash clipped to SA border */}
      <polygon
        points={TERRAIN_AREAS.karoo}
        fill="rgba(180,120,60,0.08)"
        stroke="none"
        clipPath="url(#saClip)"
      />
      {/* Highveld terrain tint — green wash */}
      <polygon
        points={TERRAIN_AREAS.highveld}
        fill="rgba(100,160,80,0.07)"
        stroke="none"
        clipPath="url(#saClip)"
      />

      {/* Compass rose — positioned bottom-right */}
      <CompassRose x={810} y={600} />

      {/* Distance scale bar — 500 km represented at bottom-left */}
      <g>
        <line x1="30" y1="640" x2="130" y2="640" stroke="#c9a45a" strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="636" x2="30" y2="644" stroke="#c9a45a" strokeWidth="1" opacity="0.4" />
        <line x1="130" y1="636" x2="130" y2="644" stroke="#c9a45a" strokeWidth="1" opacity="0.4" />
        <text x="80" y="635" textAnchor="middle" fill="#8fa4bc" fontSize="8" fontFamily="'DM Mono'" opacity="0.7">
          500 km
        </text>
      </g>

      {/* Route segments — each segment between consecutive stations */}
      {STATIONS.map((s, i) => {
        if (i >= STATIONS.length - 1) return null
        const next = STATIONS[i + 1]
        const isVisited = i < stIdx          // Segment fully behind the train
        const isCurrent = i === stIdx        // Segment the train is currently on
        // For the current segment, draw only as far as the train has reached
        const endX = isCurrent ? trainPos.x : (isVisited ? next.x : s.x)
        const endY = isCurrent ? trainPos.y : (isVisited ? next.y : s.y)
        return (
          <g key={s.id}>
            {/* Ghost dashed line showing the full route ahead */}
            <line
              x1={s.x} y1={s.y} x2={next.x} y2={next.y}
              stroke="#c9a45a" strokeWidth="1.5" strokeOpacity="0.15"
              strokeDasharray="4 6"
            />
            {/* Solid gold line for visited / in-progress segments */}
            {(isVisited || isCurrent) && (
              <line
                x1={s.x} y1={s.y} x2={endX} y2={endY}
                stroke="#e8c97a" strokeWidth="2.5"
                strokeLinecap="round"
                opacity={isVisited ? 0.85 : 0.95}
              />
            )}
          </g>
        )
      })}

      {/* Glow aura behind each unlocked station */}
      {STATIONS.map(s => awoken.has(s.id) && (
        <circle
          key={`glow-${s.id}`}
          cx={s.x} cy={s.y} r="28"
          fill="url(#stationGlow)"
          opacity={newlyAwoken === s.id ? 1 : 0.7}
        />
      ))}

      {/* Station marker diamonds */}
      {STATIONS.map((s) => {
        const isAwoken = awoken.has(s.id)
        const isDone = completed.has(s.id)
        const size = isAwoken ? 7 : 5   // Unlocked stations are slightly larger
        return (
          <g
            key={s.id}
            style={{ cursor: isAwoken ? 'pointer' : 'default' }}
            onClick={() => onStationClick(s)}
          >
            {/* Outer ring on unlocked stations */}
            {isAwoken && (
              <circle cx={s.x} cy={s.y} r="12" fill="none" stroke="#c9a45a" strokeWidth="0.8" opacity="0.4" />
            )}
            {/* Rotated square = diamond; filled gold if completed, lighter gold if current, dark if locked */}
            <rect
              x={s.x - size} y={s.y - size}
              width={size * 2} height={size * 2}
              fill={isDone ? '#c9a45a' : isAwoken ? '#e8c97a' : '#1a3050'}
              stroke={isAwoken ? '#e8c97a' : '#c9a45a'}
              strokeWidth={isAwoken ? 1.5 : 1}
              opacity={isAwoken ? 1 : 0.4}
              transform={`rotate(45 ${s.x} ${s.y})`}
              style={{ transition: 'all 0.4s' }}
            />
            {/* Station label — only visible when unlocked; anchored left/right based on position */}
            {isAwoken && (
              <text
                x={s.x + (s.x < 300 ? -16 : 16)}
                y={s.y - (s.y > 500 ? 14 : -14)}
                textAnchor={s.x < 300 ? 'end' : 'start'}
                fill="#ede3cc"
                fontSize="9"
                fontFamily="'DM Mono', monospace"
                letterSpacing="0.06em"
                opacity="0.85"
              >
                {s.names[lang].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* Soft glow aura centred on the train */}
      <circle cx={trainPos.x} cy={trainPos.y} r="20" fill="url(#trainGlow)" opacity="0.6" />

      {/* The locomotive sprite, oriented in the direction of travel */}
      <TrainSprite x={trainPos.x} y={trainPos.y} stIdx={stIdx} />

      {/* Country label */}
      <text
        x="860" y="30"
        textAnchor="end"
        fill="#c9a45a"
        fontSize="9"
        fontFamily="'DM Mono', monospace"
        letterSpacing="0.15em"
        opacity="0.5"
      >
        SOUTH AFRICA
      </text>
    </svg>
  )
}

// ─── Train Sprite ─────────────────────────────────────────────────────────────

/**
 * TrainSprite — a small SVG steam locomotive centred on (x, y).
 *
 * The sprite is horizontally flipped via `scale(-1, 1)` when the train
 * is moving left (i.e. dx < 0), so it always faces the direction of travel.
 * Smoke puffs are driven by a CSS keyframe animation (`trainSmoke`).
 */
function TrainSprite({ x, y, stIdx }: { x: number; y: number; stIdx: number }) {
  // dx determines direction of travel; negative means heading west (left)
  const dx = stIdx < STATIONS.length - 1
    ? STATIONS[stIdx + 1].x - STATIONS[stIdx].x
    : -1
  const facingRight = dx > 0
  const scale = facingRight ? 1 : -1   // Horizontal flip factor

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Three smoke puffs staggered in time */}
      {[0, 1, 2].map(i => (
        <circle
          key={i}
          cx={-scale * (8 + i * 5)}
          cy={-8 - i * 3}
          r={2 + i}
          fill="#e8c97a"
          opacity={0}
          style={{
            animation: `trainSmoke 1.2s ease-out ${i * 0.3}s infinite`,
            transformOrigin: `${-scale * (8 + i * 5)}px ${-8 - i * 3}px`,
          }}
        />
      ))}
      {/* Locomotive body — mirrored via scale transform */}
      <g transform={`scale(${scale}, 1)`}>
        {/* Cab (driver's compartment) */}
        <rect x="-6" y="-7" width="8" height="7" rx="1" fill="#112540" stroke="#c9a45a" strokeWidth="0.8" />
        {/* Cab window */}
        <rect x="-4" y="-5.5" width="3" height="3" rx="0.5" fill="#e8c97a" opacity="0.6" />
        {/* Boiler */}
        <rect x="2" y="-5" width="10" height="5" rx="2" fill="#0e1e35" stroke="#c9a45a" strokeWidth="0.8" />
        {/* Chimney / smokestack */}
        <rect x="9" y="-9" width="2.5" height="4" rx="0.5" fill="#0e1e35" stroke="#c9a45a" strokeWidth="0.7" />
        {/* Drive wheels */}
        <circle cx="-2" cy="2" r="2.5" fill="#06101c" stroke="#c9a45a" strokeWidth="0.8" />
        <circle cx="5" cy="2" r="2.5" fill="#06101c" stroke="#c9a45a" strokeWidth="0.8" />
        {/* Bogie wheel */}
        <circle cx="10" cy="2" r="2" fill="#06101c" stroke="#c9a45a" strokeWidth="0.7" />
        {/* Headlight */}
        <circle cx="12" cy="-3" r="1.2" fill="#e8c97a" opacity="0.9" />
      </g>
    </g>
  )
}

// ─── Chapter Panel ────────────────────────────────────────────────────────────

/**
 * ChapterPanel — the right-hand sidebar that displays station details.
 *
 * Sections:
 *  - Header: chapter number, terrain, localised name, subtitle, ornament divider
 *  - Heritage: long-form historical paragraph
 *  - Hidden Gems: three bullet points with diamond markers
 *  - Wax seal: appears once the station has been departed from
 *  - Footer: "Continue Journey" button, or journey-complete message
 *
 * The panel slides in from the right via the `chapterSlideIn` CSS keyframe.
 */
function ChapterPanel({
  station, lang, completed, isComplete, onClose, onContinue, stIdx,
}: {
  station: Station
  lang: Language
  completed: Set<string>
  isComplete: boolean
  onClose: () => void
  onContinue: () => void
  stIdx: number
}) {
  // A station is "complete" once the train has departed from it
  const isStationComplete = completed.has(station.id)

  return (
    <div
      style={{
        width: 360,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #09141f 0%, #0c1e35 100%)',
        borderLeft: '1px solid rgba(201,164,90,0.25)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'chapterSlideIn 0.4s ease-out both',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      {/* ── Panel header ──────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(201,164,90,0.15)', position: 'relative' }}>
        {/* Close button — dismisses the panel */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#8fa4bc',
            fontSize: 18, lineHeight: 1, padding: 4,
          }}
        >
          ×
        </button>

        {/* Chapter number + terrain type */}
        <div style={{
          fontFamily: "'DM Mono'",
          fontSize: 10, letterSpacing: '0.2em',
          color: '#7a5e2a', textTransform: 'uppercase', marginBottom: 6,
        }}>
          Chapter {station.num} · {station.terrain.toUpperCase()}
        </div>

        {/* Localised station name */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26, fontWeight: 700,
          color: '#e8c97a', lineHeight: 1.1, letterSpacing: '0.02em',
        }}>
          {station.names[lang]}
        </div>

        {/* Subtitle / tagline */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic', fontSize: 13,
          color: '#8fa4bc', marginTop: 3, letterSpacing: '0.04em',
        }}>
          {station.subtitle}
        </div>

        {/* Decorative diamond divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,164,90,0.4))' }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="0" y="0" width="8" height="8" fill="#c9a45a" opacity="0.6" transform="rotate(45 4 4)" />
          </svg>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,164,90,0.4))' }} />
        </div>
      </div>

      {/* ── Heritage section ──────────────────────────────────────────────── */}
      <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(201,164,90,0.1)' }}>
        <div style={{
          fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: '0.2em',
          color: '#c9a45a', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Heritage
        </div>
        <p style={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: 13, lineHeight: 1.75, color: '#ede3cc', margin: 0,
        }}>
          {station.heritage}
        </p>
      </div>

      {/* ── Hidden gems section ───────────────────────────────────────────── */}
      <div style={{ padding: '18px 24px', flex: 1 }}>
        <div style={{
          fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: '0.2em',
          color: '#c9a45a', textTransform: 'uppercase', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* Animated diamond icon beside the section heading */}
          <svg width="8" height="8" viewBox="0 0 8 8" style={{ animation: 'shimmerGem 2s ease-in-out infinite' }}>
            <rect x="0" y="0" width="8" height="8" fill="#c9a45a" transform="rotate(45 4 4)" />
          </svg>
          Hidden Gems
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {station.gems.map((gem, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {/* Small diamond bullet */}
              <svg width="6" height="6" viewBox="0 0 6 6" style={{ marginTop: 4, flexShrink: 0 }}>
                <rect x="0" y="0" width="6" height="6" fill="#c9a45a" opacity="0.6" transform="rotate(45 3 3)" />
              </svg>
              <span style={{
                fontFamily: "'Libre Franklin'",
                fontSize: 12, lineHeight: 1.6, color: '#8fa4bc',
              }}>
                {gem}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wax seal — stamped after departing this station ───────────────── */}
      {isStationComplete && (
        <div style={{
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderTop: '1px solid rgba(201,164,90,0.1)',
        }}>
          <WaxSeal num={station.num} />
          <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: '#7a5e2a', letterSpacing: '0.1em' }}>
            Chapter {station.num} stamped in your passport
          </span>
        </div>
      )}

      {/* ── Footer: continue button or completion message ─────────────────── */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(201,164,90,0.15)' }}>
        {isComplete ? (
          // Shown when the train has reached Cape Town
          <div style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic', fontSize: 14,
            color: '#e8c97a', lineHeight: 1.6,
          }}>
            You have completed the journey.<br />
            <span style={{ fontSize: 12, color: '#8fa4bc' }}>
              1,600 km · 9 Chapters · One living story
            </span>
          </div>
        ) : (
          // Only render if the open station is the current stop (not a past revisit)
          stIdx === STATIONS.findIndex(s => s.id === station.id) && (
            <button
              onClick={onContinue}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(201,164,90,0.5)',
                borderRadius: 2, padding: '10px',
                cursor: 'pointer',
                fontFamily: "'DM Mono'", fontSize: 11,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#c9a45a', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,164,90,0.1)'
                e.currentTarget.style.borderColor = '#c9a45a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(201,164,90,0.5)'
              }}
            >
              Continue Journey →
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Route Progress Bar ───────────────────────────────────────────────────────

/**
 * RouteProgress — the horizontal station timeline at the bottom of the screen.
 *
 * Shows all nine stations as diamond icons connected by coloured track lines.
 * Completed segments fill with gold; the current segment fills proportionally
 * using a CSS gradient keyed off `tProg`. Clicking an unlocked station opens
 * its ChapterPanel.
 */
function RouteProgress({
  awoken, completed, stations, lang, stIdx, tProg, onStationClick,
}: {
  awoken: Set<string>
  completed: Set<string>
  stations: Station[]
  lang: Language
  stIdx: number
  tProg: number
  onStationClick: (s: Station) => void
}) {
  return (
    <div style={{
      height: 72,
      borderTop: '1px solid rgba(201,164,90,0.2)',
      background: 'rgba(6,16,28,0.95)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 24,
      paddingRight: 24,
      gap: 0,
      flexShrink: 0,
      overflowX: 'auto',   // Allows horizontal scroll on very small screens
    }}>
      {stations.map((s, i) => {
        const isAwoken = awoken.has(s.id)
        const isDone = completed.has(s.id)
        const isCurrent = i === stIdx

        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* Station icon + short name label */}
            <div
              onClick={() => onStationClick(s)}
              title={s.names[lang]}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
                cursor: isAwoken ? 'pointer' : 'default',
              }}
            >
              <div style={{ position: 'relative', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Wax seal replaces the diamond once the station is completed */}
                {isDone ? (
                  <WaxSeal num={s.num} size={20} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <rect
                      x="0" y="0" width="14" height="14"
                      fill={isCurrent ? '#e8c97a' : isAwoken ? '#c9a45a' : '#1a3050'}
                      stroke={isAwoken ? '#c9a45a' : 'rgba(201,164,90,0.3)'}
                      strokeWidth="1"
                      opacity={isAwoken ? 1 : 0.4}
                      transform="rotate(45 7 7)"
                    />
                  </svg>
                )}
              </div>
              {/* First word of the localised name only (keeps bar compact) */}
              <span style={{
                fontFamily: "'DM Mono'", fontSize: 8, letterSpacing: '0.08em',
                color: isAwoken ? '#c9a45a' : '#4a6080',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                opacity: isAwoken ? 1 : 0.5,
              }}>
                {s.names[lang].split(' ')[0]}
              </span>
            </div>

            {/* Track connector between this station and the next */}
            {i < stations.length - 1 && (
              <div style={{
                width: 40, height: 2, margin: '0 2px', marginBottom: 14,
                // Completed segments: solid gold
                // Current segment: fills left-to-right proportional to tProg
                // Future segments: very faint
                background: i < stIdx
                  ? '#c9a45a'
                  : i === stIdx
                  ? `linear-gradient(to right, #c9a45a ${tProg * 100}%, rgba(201,164,90,0.15) ${tProg * 100}%)`
                  : 'rgba(201,164,90,0.15)',
                transition: 'background 0.1s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Wax Seal ─────────────────────────────────────────────────────────────────

/**
 * WaxSeal — a decorative circular stamp showing the station's Roman numeral.
 *
 * Used in two places:
 *  - ChapterPanel footer (size 28, default)
 *  - RouteProgress bar (size 20, compact)
 *
 * Animates in via the `stampIn` CSS keyframe when first rendered.
 */
function WaxSeal({ num, size = 28 }: { num: string; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 28 28"
      style={{ animation: 'stampIn 0.5s ease-out both' }}
    >
      {/* Dark red wax background */}
      <circle cx="14" cy="14" r="13" fill="#7a2e1a" opacity="0.9" />
      {/* Inner ring */}
      <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,200,100,0.3)" strokeWidth="0.8" />
      {/* 12 scallop bumps around the edge */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = 14 + Math.cos(angle) * 12
        const y = 14 + Math.sin(angle) * 12
        return <circle key={i} cx={x} cy={y} r="1.5" fill="#8b3820" />
      })}
      {/* Chapter numeral — smaller font for longer strings (e.g. "VIII") */}
      <text
        x="14" y="18"
        textAnchor="middle"
        fill="#e8c97a"
        fontSize={num.length > 3 ? 7 : 9}
        fontFamily="'Playfair Display', serif"
        fontStyle="italic"
      >
        {num}
      </text>
    </svg>
  )
}

// ─── Art Deco Ornament ────────────────────────────────────────────────────────

/**
 * ArtDecoOrnament — horizontal decorative divider used above the intro ticket.
 * Consists of a centre diamond, two horizontal rules, and four smaller
 * open-diamond accents at regular intervals.
 */
function ArtDecoOrnament() {
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" style={{ marginBottom: 12 }}>
      {/* Centre filled diamond */}
      <rect x="56" y="10" width="8" height="8" fill="#c9a45a" transform="rotate(45 60 14)" />
      {/* Horizontal rules either side */}
      <line x1="0" y1="14" x2="48" y2="14" stroke="#c9a45a" strokeWidth="1" opacity="0.5" />
      <line x1="72" y1="14" x2="120" y2="14" stroke="#c9a45a" strokeWidth="1" opacity="0.5" />
      {/* Accent diamonds at x = 20, 36, 84, 100 */}
      {[20, 36, 84, 100].map(x => (
        <rect key={x} x={x - 3} y={11} width={6} height={6} fill="none" stroke="#c9a45a" strokeWidth="0.8" opacity="0.5" transform={`rotate(45 ${x} 14)`} />
      ))}
      {/* Top and bottom trim lines */}
      <line x1="20" y1="4" x2="100" y2="4" stroke="rgba(201,164,90,0.3)" strokeWidth="0.5" />
      <line x1="20" y1="24" x2="100" y2="24" stroke="rgba(201,164,90,0.3)" strokeWidth="0.5" />
    </svg>
  )
}

// ─── Corner Ornament ──────────────────────────────────────────────────────────

/**
 * CornerOrnament — small L-shaped art-deco accent for the ticket card corners.
 * The SVG is drawn for the top-left position and mirrored via scale transforms
 * for the other three corners.
 */
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 18,
    height: 18,
  }
  // Position each ornament in its respective corner of the parent container
  if (position === 'tl') { style.top = 6; style.left = 6 }
  if (position === 'tr') { style.top = 6; style.right = 6 }
  if (position === 'bl') { style.bottom = 6; style.left = 6 }
  if (position === 'br') { style.bottom = 6; style.right = 6 }

  // Mirror horizontally for right corners, vertically for bottom corners
  const [flipX, flipY] = [position.includes('r') ? -1 : 1, position.includes('b') ? -1 : 1]

  return (
    <svg style={style} viewBox="0 0 18 18">
      <g transform={`scale(${flipX},${flipY}) translate(${flipX < 0 ? -18 : 0},${flipY < 0 ? -18 : 0})`}>
        <line x1="0" y1="9" x2="9" y2="0" stroke="#c9a45a" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="14" x2="14" y2="0" stroke="#c9a45a" strokeWidth="0.6" opacity="0.3" />
        <rect x="0" y="0" width="4" height="4" fill="#c9a45a" opacity="0.5" />
      </g>
    </svg>
  )
}

// ─── Compass Rose ─────────────────────────────────────────────────────────────

/**
 * CompassRose — traditional eight-point compass rendered in SVG.
 * Cardinal points (N/S/E/W) use larger arrows; intercardinals use smaller ones.
 * Positioned at the bottom-right of the map via a `translate` transform.
 */
function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} opacity="0.5">
      {/* Cardinal direction arrows */}
      {[0, 90, 180, 270].map(deg => (
        <g key={deg} transform={`rotate(${deg})`}>
          <polygon points="0,-18 3,-8 -3,-8" fill="#c9a45a" opacity="0.8" />
          <polygon points="0,-8 2,-2 -2,-2" fill="#8fa4bc" opacity="0.5" />
        </g>
      ))}
      {/* Intercardinal (diagonal) arrows — smaller */}
      {[45, 135, 225, 315].map(deg => (
        <g key={deg} transform={`rotate(${deg})`}>
          <polygon points="0,-12 2,-5 -2,-5" fill="#c9a45a" opacity="0.4" />
        </g>
      ))}
      {/* Centre pivot */}
      <circle cx="0" cy="0" r="3" fill="#06101c" stroke="#c9a45a" strokeWidth="1" />
      <circle cx="0" cy="0" r="1" fill="#c9a45a" />
      {/* North label */}
      <text x="0" y="-22" textAnchor="middle" fill="#c9a45a" fontSize="7" fontFamily="'DM Mono'" letterSpacing="0.1em">N</text>
    </g>
  )
}
