/**
 * JourneySimulation — a living, illustrated map of the Pretoria → Cape Town route.
 *
 * Driven by the same useTrainAnimation state as the rest of the app, so the
 * SVG train, the Google Map marker, and the route progress bar all move together.
 *
 * Architecture:
 *  · Props: stIdx, tProg, isMoving, awoken, completed from useTrainAnimation
 *  · onContinue: triggers the real journey depart
 *  · Local state: only video modal target + speed multiplier display
 *
 * The SVG world:
 *  · South Africa landmass silhouette (simplified polygon)
 *  · Terrain colour zones: Highveld / Karoo / Winelands / Cape
 *  · Night sky with stars
 *  · Full route polyline, travelled portion fills with accent
 *  · Station nodes: dormant → glowing → stamped as journey progresses
 *  · Detailed steam locomotive that rotates to face its direction of travel
 *  · Multi-puff animated steam stack
 *  · Station arrival: expanding pulse rings + name banner
 */

import { useState, useMemo } from 'react'
import { STATIONS } from '@/data/stations'
import type { Language, Station } from '@/types'

import { INK, DISPLAY, TEXT_F, MONO } from '@/styles/tokens'

// ── Local palette overrides ────────────────────────────────────
// JourneySimulation renders a night-sky SVG scene and intentionally uses
// slightly darker/warmer values than the global Blue Train palette.
const VOID    = '#050E18'   // deeper sky than global void
const SURFACE = '#0E2235'   // warmer panel than global surface
const TEXT    = '#E6D9B8'   // slightly warmer ivory than global text
// Note: burnt-orange accent — intentionally distinct from the gold used elsewhere
const ACCENT  = '#C8783A'
const SUPPORT = '#5A8A72'
const DIM     = '#3A5A70'

import { STATION_VIDEOS } from '@/data/videos'

// ── SVG canvas ─────────────────────────────────────────────────
const W = 800
const H = 500

// Station canvas positions — mapped from the stations.ts SVG coords
// (x/y in stations.ts are in an 870×600 space; we scale into W×H with padding)
const PAD_L = 60
const PAD_R = 40
const PAD_T = 40
const PAD_B = 60

function stationXY(s: typeof STATIONS[number]): [number, number] {
  const x = PAD_L + ((s.x - 90) / (860 - 90)) * (W - PAD_L - PAD_R)
  const y = PAD_T + ((s.y - 45) / (580 - 45)) * (H - PAD_T - PAD_B)
  return [Math.round(x), Math.round(y)]
}

const NODES = STATIONS.map(s => {
  const [x, y] = stationXY(s)
  return { id: s.id, name: s.name, num: s.num, subtitle: s.subtitle, x, y }
})

// Route polyline string
const ROUTE_PTS = NODES.map(n => `${n.x},${n.y}`).join(' ')

// Cumulative segment lengths for train interpolation
const SEG_LENS: number[] = [0]
for (let i = 1; i < NODES.length; i++) {
  const dx = (NODES[i]?.x ?? 0) - (NODES[i-1]?.x ?? 0)
  const dy = (NODES[i]?.y ?? 0) - (NODES[i-1]?.y ?? 0)
  SEG_LENS.push(SEG_LENS[i-1]! + Math.sqrt(dx*dx + dy*dy))
}
const ROUTE_LEN = SEG_LENS[SEG_LENS.length - 1]!

// Given global t ∈ [0,1], interpolate SVG position + heading
function interpolate(t: number) {
  const dist = t * ROUTE_LEN
  let seg = 0
  for (let i = 1; i < SEG_LENS.length; i++) {
    if ((SEG_LENS[i] ?? ROUTE_LEN) >= dist) { seg = i - 1; break }
    if (i === SEG_LENS.length - 1) seg = i - 1
  }
  const s0 = SEG_LENS[seg] ?? 0
  const s1 = SEG_LENS[seg + 1] ?? ROUTE_LEN
  const frac = s1 > s0 ? (dist - s0) / (s1 - s0) : 0
  const x0 = NODES[seg]?.x ?? 0,    y0 = NODES[seg]?.y ?? 0
  const x1 = NODES[seg+1]?.x ?? x0, y1 = NODES[seg+1]?.y ?? y0
  return {
    x: x0 + (x1 - x0) * frac,
    y: y0 + (y1 - y0) * frac,
    angle: Math.atan2(y1 - y0, x1 - x0) * (180 / Math.PI),
    seg,
  }
}

// t value exactly at station i
function tAt(i: number) { return (SEG_LENS[i] ?? 0) / ROUTE_LEN }

// ── Terrain colour zones ──────────────────────────────────────
// Defined as SVG polygon regions overlaid on the landmass
const TERRAIN_ZONES = [
  { label: 'Highveld', colour: '#1a2d1a', pts: '480,30 680,30 720,120 650,200 580,230 520,220 470,180 460,80' },
  { label: 'Great Karoo', colour: '#1e1a0e', pts: '220,200 480,150 520,220 520,360 440,420 300,430 200,390 180,300' },
  { label: 'Little Karoo', colour: '#1a1808', pts: '100,340 200,310 240,400 200,440 120,440 80,400' },
  { label: 'Winelands',   colour: '#0e1e14', pts: '50,380 120,340 180,420 160,460 80,460' },
  { label: 'Cape',        colour: '#0a1a10', pts: '40,420 100,400 120,470 80,490 40,480' },
]

// ── SA landmass outline (simplified) ─────────────────────────
const LAND_POLY = '90,40 200,36 400,34 600,36 720,38 780,130 780,250 760,330 730,390 700,440 660,475 610,492 540,498 460,498 380,494 300,490 240,490 190,492 150,490 120,482 90,460 60,420 36,370 20,300 10,220 30,150 60,90 90,40'

// Label offsets to keep text clear of the route
const LABEL_OFFSETS: Record<string, [number, number, 'start' | 'end']> = {
  pretoria:       [ 12, -13, 'start'],
  johannesburg:   [ 12, -13, 'start'],
  klerksdorp:     [ 12, -12, 'start'],
  kimberley:      [-12, -13, 'end'  ],
  de_aar:         [-12, -11, 'end'  ],
  beaufort_west:  [-12,  17, 'end'  ],
  matjiesfontein: [-12,  17, 'end'  ],
  worcester:      [-12,  17, 'end'  ],
  cape_town:      [-12,  17, 'end'  ],
}

// ── Deterministic stars ───────────────────────────────────────
const STARS = Array.from({ length: 120 }, (_, i) => ({
  x: ((i * 137.508 + 7) % 790) + 5,
  y: ((i * 89.3   + 13) % 490) + 5,
  r: i % 5 === 0 ? 1.2 : i % 3 === 0 ? 0.9 : 0.6,
  op: 0.15 + (i % 7) * 0.05,
}))

// ── Train SVG (detailed steam locomotive) ────────────────────
function TrainSprite({ x, y, angle, puffPhase, atStation }: {
  x: number; y: number; angle: number; puffPhase: number; atStation: boolean
}) {
  // Flip horizontally when moving right-to-left (angle between 90 and 270)
  const flip = Math.abs(angle) > 90 ? -1 : 1

  // Steam puff positions relative to stack (which is at the front of the loco)
  const puffs = [0, 1, 2].map(i => {
    const phase = (puffPhase + i * 0.33) % 1
    return {
      opacity: Math.max(0, (1 - phase) * 0.45),
      radius:  3 + phase * 9,
      dy:     -phase * 20,
      dx:      (Math.random() - 0.5) * 4 * phase,
    }
  })

  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${angle.toFixed(1)})`}>
      {/* Steam puffs — appear above the stack */}
      {!atStation && puffs.map((p, i) => (
        <ellipse
          key={i}
          cx={flip * 18 + p.dx}
          cy={-14 + p.dy}
          rx={p.radius * 0.85}
          ry={p.radius}
          fill={TEXT}
          opacity={p.opacity}
        />
      ))}

      {/* Headlamp beam */}
      <ellipse
        cx={flip * 30} cy={0}
        rx={22} ry={6}
        fill="rgba(230,217,184,0.07)"
        transform={`rotate(0)`}
      />

      {/* Main body group — all relative to train centre (0,0) */}
      <g transform={`scale(${flip}, 1)`}>
        {/* Tender (rear car — coal/water) */}
        <rect x="-32" y="-5" width="14" height="11" rx="1" fill="#091828" stroke={ACCENT} strokeWidth="0.8" />
        <rect x="-30" y="-3" width="10" height="3" rx="0.5" fill="#0d2035" opacity="0.8" />
        {/* Coupling rod */}
        <line x1="-18" y1="3" x2="-32" y2="3" stroke={ACCENT} strokeWidth="0.8" opacity="0.5" />

        {/* Boiler body */}
        <rect x="-18" y="-7" width="36" height="13" rx="3" fill={SURFACE} stroke={ACCENT} strokeWidth="1" />

        {/* Boiler dome */}
        <ellipse cx="4" cy="-8" rx="5" ry="4" fill={SURFACE} stroke={ACCENT} strokeWidth="0.8" />

        {/* Sand dome */}
        <ellipse cx="-4" cy="-8" rx="3.5" ry="3" fill={SURFACE} stroke={ACCENT} strokeWidth="0.8" />

        {/* Cab */}
        <rect x="-20" y="-9" width="10" height="15" rx="1.5" fill={SURFACE} stroke={ACCENT} strokeWidth="1" />
        {/* Cab roof overhang */}
        <rect x="-22" y="-10" width="14" height="3" rx="1" fill={SURFACE} stroke={ACCENT} strokeWidth="0.7" />
        {/* Cab window */}
        <rect x="-19" y="-7" width="5" height="5" rx="0.8" fill={TEXT} opacity="0.55" />
        {/* Window glow at night */}
        <rect x="-19" y="-7" width="5" height="5" rx="0.8" fill="rgba(255,200,80,0.15)" />

        {/* Smoke stack */}
        <rect x="14" y="-15" width="5" height="9" rx="1" fill={SURFACE} stroke={ACCENT} strokeWidth="0.8" />
        {/* Stack flare */}
        <rect x="13" y="-16" width="7" height="3" rx="1" fill={SURFACE} stroke={ACCENT} strokeWidth="0.7" />

        {/* Running plate / footplate */}
        <rect x="-20" y="4" width="38" height="2" rx="0.5" fill={SURFACE} stroke={`rgba(200,120,58,0.5)`} strokeWidth="0.5" />

        {/* Pilot / cowcatcher */}
        <polygon points="18,6 26,8 26,4" fill={SURFACE} stroke={ACCENT} strokeWidth="0.8" />

        {/* Headlamp */}
        <circle cx="21" cy="0" r="3" fill={ACCENT} opacity="0.9" />
        <circle cx="21" cy="0" r="1.5" fill={TEXT} opacity="0.8" />

        {/* Driving wheels (large) */}
        <circle cx="-10" cy="8" r="6" fill={VOID} stroke={ACCENT} strokeWidth="1.2" />
        <circle cx="2"   cy="8" r="6" fill={VOID} stroke={ACCENT} strokeWidth="1.2" />
        {/* Driving wheel spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a}
            x1={-10 + Math.cos(a * Math.PI/180) * 2}
            y1={ 8 + Math.sin(a * Math.PI/180) * 2}
            x2={-10 + Math.cos(a * Math.PI/180) * 5.5}
            y2={ 8 + Math.sin(a * Math.PI/180) * 5.5}
            stroke={ACCENT} strokeWidth="0.7" opacity="0.6"
          />
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a}
            x1={2 + Math.cos(a * Math.PI/180) * 2}
            y1={8 + Math.sin(a * Math.PI/180) * 2}
            x2={2 + Math.cos(a * Math.PI/180) * 5.5}
            y2={8 + Math.sin(a * Math.PI/180) * 5.5}
            stroke={ACCENT} strokeWidth="0.7" opacity="0.6"
          />
        ))}
        {/* Axle hub caps */}
        <circle cx="-10" cy="8" r="1.5" fill={ACCENT} opacity="0.7" />
        <circle cx="2"   cy="8" r="1.5" fill={ACCENT} opacity="0.7" />

        {/* Pony wheels (small, front) */}
        <circle cx="13" cy="9" r="4" fill={VOID} stroke={ACCENT} strokeWidth="1" />
        <circle cx="13" cy="9" r="1"  fill={ACCENT} opacity="0.6" />

        {/* Trailing wheels (small, rear) */}
        <circle cx="-22" cy="9" r="3.5" fill={VOID} stroke={ACCENT} strokeWidth="1" />
        <circle cx="-22" cy="9" r="1"   fill={ACCENT} opacity="0.6" />

        {/* Connecting rod */}
        <line x1="-10" y1="5" x2="2" y2="5" stroke={ACCENT} strokeWidth="1" opacity="0.7" />
        <line x1="2"   y1="5" x2="13" y2="7" stroke={ACCENT} strokeWidth="0.8" opacity="0.5" />
      </g>
    </g>
  )
}

// ── Station node SVG ─────────────────────────────────────────
function StationNode({ node, isVisited, isCurrent, isComplete, onClick }: {
  node: typeof NODES[number]
  isVisited: boolean
  isCurrent: boolean
  isComplete: boolean
  onClick: () => void
}) {
  const r = 7

  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      {/* Hit area */}
      <circle cx={node.x} cy={node.y} r="18" fill="transparent" />

      {/* Arrival pulse rings */}
      {isCurrent && (
        <>
          <circle cx={node.x} cy={node.y} r={r + 4} fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.4">
            <animate attributeName="r"       from={r+4} to={r+22} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.45"  to="0"    dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx={node.x} cy={node.y} r={r + 2} fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.3">
            <animate attributeName="r"       from={r+2} to={r+16} dur="1.4s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3"   to="0"   dur="1.4s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Platform base */}
      <rect
        x={node.x - 12} y={node.y + r - 1}
        width="24" height="4" rx="1"
        fill={isVisited ? `rgba(200,120,58,0.25)` : `rgba(58,90,112,0.2)`}
      />

      {/* Station building */}
      {isVisited && (
        <>
          {/* Building body */}
          <rect x={node.x - 8} y={node.y - r - 8} width="16" height="10" rx="1"
            fill={SURFACE} stroke={isComplete ? ACCENT : `rgba(200,120,58,0.5)`} strokeWidth="0.8" />
          {/* Roof */}
          <polygon
            points={`${node.x-10},${node.y-r-8} ${node.x},${node.y-r-16} ${node.x+10},${node.y-r-8}`}
            fill={isComplete ? ACCENT : `rgba(200,120,58,0.35)`}
          />
          {/* Windows */}
          <rect x={node.x - 5} y={node.y - r - 6} width="3" height="3" rx="0.5" fill={TEXT} opacity="0.45" />
          <rect x={node.x + 2} y={node.y - r - 6} width="3" height="3" rx="0.5" fill={TEXT} opacity="0.45" />
          {/* Door */}
          <rect x={node.x - 2} y={node.y - r - 3} width="4" height="5" rx="0.5"
            fill={TEXT} opacity="0.25" />
        </>
      )}

      {/* Main node circle */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={isCurrent ? ACCENT : isVisited ? `rgba(200,120,58,0.5)` : `rgba(14,34,53,0.9)`}
        stroke={isVisited ? ACCENT : `rgba(58,90,112,0.6)`}
        strokeWidth="1.5"
        filter={isCurrent ? 'url(#glow)' : undefined}
      />

      {/* Roman numeral */}
      <text
        x={node.x} y={node.y + 3.5}
        textAnchor="middle" fontFamily={MONO}
        fontSize={node.num.length > 2 ? '5' : '6'}
        fill={isCurrent ? INK : isVisited ? INK : DIM}
        fontWeight="500"
      >
        {node.num}
      </text>
    </g>
  )
}

// ── Props interface ───────────────────────────────────────────
interface JourneySimulationProps {
  lang: Language
  stIdx: number
  tProg: number
  awoken: Set<string>
  completed: Set<string>
  isMoving: boolean
  onContinue: () => void
  onStationClick: (s: Station) => void
}

// ── Main component ────────────────────────────────────────────
export function JourneySimulation({
  stIdx,
  tProg,
  awoken,
  completed,
  isMoving,
  onContinue,
  onStationClick,
}: JourneySimulationProps) {
  const [videoTarget, setVideoTarget] = useState<string | null>(null)
  const [puffPhase, setPuffPhase] = useState(0)

  // Compute the global t from stIdx + tProg
  // t = 0 at Pretoria, 1 at Cape Town
  const globalT = useMemo(() => {
    if (stIdx >= NODES.length - 1) return 1
    const t0 = tAt(stIdx)
    const t1 = tAt(stIdx + 1)
    return t0 + (t1 - t0) * tProg
  }, [stIdx, tProg])

  // Animate puff phase when moving
  const puffRef = { current: puffPhase }
  puffRef.current = puffPhase
  if (isMoving) {
    // This is intentionally read on each render; puffPhase updates lazily
    // via a useEffect with rAF would be cleaner but adds complexity —
    // instead we derive it from globalT which already updates every frame
    const phase = (globalT * 80) % 1
    if (Math.abs(phase - puffPhase) > 0.01) setPuffPhase(phase)
  }

  const pos = interpolate(globalT)

  // Nearest station to current t (for pause detection)
  const nearestIdx = useMemo(() => {
    let best = 0, bestD = Infinity
    for (let i = 0; i < NODES.length; i++) {
      const d = Math.abs(globalT - tAt(i))
      if (d < bestD) { bestD = d; best = i }
    }
    return best
  }, [globalT])

  const isAtStation = !isMoving && tProg === 0
  const isComplete  = stIdx >= STATIONS.length - 1 && !isMoving

  // Visited line endpoints — from station 0 up to current train position
  const visitedPts = useMemo(() => {
    const pts = NODES.slice(0, stIdx + 1).map(n => `${n.x},${n.y}`)
    if (stIdx < NODES.length - 1) pts.push(`${pos.x.toFixed(1)},${pos.y.toFixed(1)}`)
    return pts.join(' ')
  }, [stIdx, pos.x, pos.y])

  const currentStation = STATIONS[stIdx]
  const isLastStation  = stIdx >= STATIONS.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: VOID, fontFamily: TEXT_F, position: 'relative' }}>

      {/* ═══ HUD overlay (transparent over the map) ═══════════ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 18px' }}>
        {/* Left: current chapter info */}
        <div style={{ background: 'rgba(5,14,24,0.82)', backdropFilter: 'blur(8px)', border: `1px solid rgba(200,120,58,0.2)`, borderRadius: 6, padding: '10px 14px', maxWidth: 220 }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.18em', color: `rgba(200,120,58,0.5)`, textTransform: 'uppercase', marginBottom: 4 }}>
            {isMoving ? 'En Route' : isComplete ? 'Journey Complete' : 'At Station'}
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: TEXT, lineHeight: 1.15, marginBottom: 2 }}>
            {currentStation?.names?.en ?? ''}
          </div>
          <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 12, color: DIM }}>
            {currentStation?.subtitle ?? ''}
          </div>
          {isMoving && STATIONS[stIdx + 1] && (
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', color: `rgba(90,138,114,0.8)`, textTransform: 'uppercase', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: SUPPORT, animation: 'glowPulse 1.2s ease-in-out infinite' }} />
              Next: {STATIONS[stIdx + 1]?.names?.en}
            </div>
          )}
        </div>

        {/* Right: chapter counter */}
        <div style={{ background: 'rgba(5,14,24,0.82)', backdropFilter: 'blur(8px)', border: `1px solid rgba(200,120,58,0.2)`, borderRadius: 6, padding: '10px 16px', textAlign: 'center', pointerEvents: 'auto' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: TEXT, lineHeight: 1 }}>
            {currentStation?.num ?? 'I'}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 8, color: `rgba(200,120,58,0.45)`, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
            of IX
          </div>
        </div>
      </div>

      {/* ═══ SVG World ══════════════════════════════════════════ */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Sky gradient */}
            <radialGradient id="skyGrad" cx="60%" cy="20%" r="70%">
              <stop offset="0%"   stopColor="#0d2a45" />
              <stop offset="50%"  stopColor="#071830" />
              <stop offset="100%" stopColor={VOID}    />
            </radialGradient>

            {/* Land gradient — slightly warmer than void */}
            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0d1f0e" />
              <stop offset="100%" stopColor="#080f0a" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Strong glow for train headlamp */}
            <filter id="headlamp" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Track rail texture — repeating dash pattern used for both rails */}
            <pattern id="railPat" x="0" y="0" width="12" height="4" patternUnits="userSpaceOnUse">
              <rect width="8" height="4" fill={`rgba(58,90,112,0.5)`} />
            </pattern>

            {/* Vignette */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(2,6,14,0.7)" />
            </radialGradient>
          </defs>

          {/* ── Sky ── */}
          <rect width={W} height={H} fill="url(#skyGrad)" />

          {/* ── Stars ── */}
          <g opacity="0.9">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={TEXT} opacity={s.op} />
            ))}
          </g>

          {/* Milky way band */}
          <ellipse cx="500" cy="120" rx="280" ry="55" fill="rgba(230,217,184,0.018)" transform="rotate(-20 500 120)" />

          {/* ── Land silhouette ── */}
          <polygon points={LAND_POLY} fill="url(#landGrad)" stroke={`rgba(58,90,112,0.3)`} strokeWidth="1" />

          {/* ── Terrain colour zones ── */}
          {TERRAIN_ZONES.map(z => (
            <polygon key={z.label} points={z.pts} fill={z.colour} opacity="0.75" />
          ))}

          {/* ── Terrain labels ── */}
          {[
            { x: 580, y: 130, text: 'HIGHVELD' },
            { x: 380, y: 300, text: 'GREAT KAROO' },
            { x: 130, y: 410, text: 'WINELANDS' },
            { x: 65,  y: 458, text: 'CAPE' },
          ].map(l => (
            <text key={l.text} x={l.x} y={l.y}
              fontFamily={MONO} fontSize="7.5" letterSpacing="0.22em"
              fill={`rgba(230,217,184,0.12)`} textAnchor="middle"
            >
              {l.text}
            </text>
          ))}

          {/* ── Ocean hatch (west coast) ── */}
          <g opacity="0.07">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i}
                x1={0} y1={80 + i * 32}
                x2={80} y2={80 + i * 32}
                stroke={TEXT} strokeWidth="0.5" strokeDasharray="3 5"
              />
            ))}
          </g>

          {/* ── Railways: double rail lines ── */}
          {/* Rail bed (wide, dark) */}
          <polyline
            points={ROUTE_PTS}
            fill="none"
            stroke={`rgba(20,40,60,0.8)`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left rail */}
          <polyline
            points={ROUTE_PTS}
            fill="none"
            stroke={`rgba(58,90,112,0.25)`}
            strokeWidth="1.5"
            strokeDasharray="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right rail */}
          <polyline
            points={ROUTE_PTS}
            fill="none"
            stroke={`rgba(58,90,112,0.25)`}
            strokeWidth="1.5"
            strokeDasharray="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: 'translate(2px, 2px)' }}
          />
          {/* Sleeper pattern (dashed) */}
          <polyline
            points={ROUTE_PTS}
            fill="none"
            stroke={`rgba(30,60,90,0.4)`}
            strokeWidth="5"
            strokeDasharray="3 8"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />

          {/* ── Travelled route — accent glow ── */}
          {globalT > 0 && (
            <>
              {/* Glow underneath */}
              <polyline
                points={visitedPts}
                fill="none"
                stroke={ACCENT}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.15"
              />
              {/* Bright centre line */}
              <polyline
                points={visitedPts}
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            </>
          )}

          {/* ── Station nodes ── */}
          {NODES.map((node, i) => (
            <StationNode
              key={node.id}
              node={node}
              isVisited={awoken.has(node.id)}
              isCurrent={i === nearestIdx && isAtStation}
              isComplete={completed.has(node.id)}
              onClick={() => {
                const s = STATIONS[i]
                if (s) {
                  if (awoken.has(node.id)) onStationClick(s)
                  else setVideoTarget(node.id)
                }
              }}
            />
          ))}

          {/* ── Station labels ── */}
          {NODES.map((node, _i) => {
            const [ox, oy, anchor] = LABEL_OFFSETS[node.id] ?? [12, -13, 'start' as const]
            const isVisited = awoken.has(node.id)
            return (
              <g key={`lbl-${node.id}`} style={{ pointerEvents: 'none' }}>
                <text
                  x={node.x + ox} y={node.y + oy}
                  fontFamily={DISPLAY} fontSize="10.5" fontWeight="700"
                  fill={isVisited ? TEXT : `rgba(230,217,184,0.25)`}
                  textAnchor={anchor}
                >
                  {node.name}
                </text>
                <text
                  x={node.x + ox} y={node.y + oy + 11}
                  fontFamily={MONO} fontSize="7" letterSpacing="0.1em"
                  fill={isVisited ? `rgba(200,120,58,0.5)` : `rgba(58,90,112,0.25)`}
                  textAnchor={anchor}
                >
                  {node.subtitle.toUpperCase()}
                </text>
              </g>
            )
          })}

          {/* ── Train headlamp beam ── */}
          {globalT > 0 && isMoving && (
            <ellipse
              cx={pos.x + Math.cos(pos.angle * Math.PI/180) * 30}
              cy={pos.y + Math.sin(pos.angle * Math.PI/180) * 30}
              rx="28" ry="10"
              fill="rgba(230,217,184,0.04)"
              transform={`rotate(${pos.angle} ${pos.x} ${pos.y})`}
            />
          )}

          {/* ── Train sprite ── */}
          {globalT > 0 && (
            <g filter="url(#glow)">
              <TrainSprite
                x={pos.x} y={pos.y}
                angle={pos.angle}
                puffPhase={puffPhase}
                atStation={isAtStation}
              />
            </g>
          )}

          {/* ── Arrival banner (at station, not moving) ── */}
          {isAtStation && !isComplete && currentStation && (
            <g>
              <rect
                x={W/2 - 120} y={H - 52}
                width="240" height="38"
                rx="4"
                fill={SURFACE}
                stroke={`rgba(200,120,58,0.4)`}
                strokeWidth="1"
              />
              <text
                x={W/2} y={H - 29}
                fontFamily={MONO} fontSize="8" letterSpacing="0.2em"
                fill={`rgba(200,120,58,0.55)`} textAnchor="middle"
              >
                CHAPTER {currentStation.num} — ARRIVED
              </text>
              <text
                x={W/2} y={H - 18}
                fontFamily={DISPLAY} fontSize="13" fontWeight="700"
                fill={TEXT} textAnchor="middle"
              >
                {currentStation.names.en}
              </text>
            </g>
          )}

          {/* ── Journey complete overlay ── */}
          {isComplete && (
            <g>
              <rect x={W/2-150} y={H/2-30} width="300" height="60" rx="5" fill={SURFACE} stroke={ACCENT} strokeWidth="1.2" />
              <text x={W/2} y={H/2-8}  fontFamily={DISPLAY} fontSize="16" fontWeight="700" fill={TEXT} textAnchor="middle">Journey Complete</text>
              <text x={W/2} y={H/2+12} fontFamily={MONO} fontSize="8" letterSpacing="0.16em" fill={`rgba(200,120,58,0.55)`} textAnchor="middle">
                1,600 KM · 9 CHAPTERS · ONE STORY
              </text>
            </g>
          )}

          {/* ── Vignette ── */}
          <rect width={W} height={H} fill="url(#vignette)" style={{ pointerEvents: 'none' }} />

          {/* ── Compass rose (bottom-right) ── */}
          <g transform={`translate(${W - 46}, ${H - 46})`} opacity="0.35">
            {[0, 90, 180, 270].map(deg => (
              <g key={deg} transform={`rotate(${deg})`}>
                <polygon points="0,-14 2.5,-6 -2.5,-6" fill={deg === 0 ? ACCENT : DIM} />
              </g>
            ))}
            {[45, 135, 225, 315].map(deg => (
              <g key={deg} transform={`rotate(${deg})`}>
                <polygon points="0,-9 1.5,-4 -1.5,-4" fill={DIM} opacity="0.5" />
              </g>
            ))}
            <circle cx="0" cy="0" r="2.5" fill={VOID} stroke={ACCENT} strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1" fill={ACCENT} />
            <text x="0" y="-17" fontFamily={MONO} fontSize="6" fill={ACCENT} textAnchor="middle" letterSpacing="0.1em">N</text>
          </g>

          {/* ── Scale bar (bottom-left) ── */}
          <g transform="translate(20, 465)" opacity="0.4">
            <line x1="0" y1="0" x2="60" y2="0" stroke={DIM} strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="5" stroke={DIM} strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="5" stroke={DIM} strokeWidth="1" />
            <text x="30" y="14" fontFamily={MONO} fontSize="7" fill={DIM} textAnchor="middle" letterSpacing="0.08em">≈ 400 KM</text>
          </g>
        </svg>

        {/* ═══ Controls overlay ══════════════════════════════════ */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, alignItems: 'center', zIndex: 20 }}>
          {/* Depart / En route button */}
          {!isComplete && (
            <button
              onClick={onContinue}
              disabled={isMoving}
              style={{
                background: isMoving ? `rgba(14,34,53,0.7)` : ACCENT,
                border: `1px solid ${isMoving ? `rgba(200,120,58,0.2)` : ACCENT}`,
                borderRadius: 5, padding: '9px 22px', cursor: isMoving ? 'default' : 'pointer',
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: isMoving ? DIM : INK, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 8,
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isMoving) e.currentTarget.style.background = '#da8d50' }}
              onMouseLeave={e => { if (!isMoving) e.currentTarget.style.background = ACCENT }}
            >
              {isMoving ? (
                <>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: SUPPORT, animation: 'glowPulse 1s ease-in-out infinite' }} />
                  En Route…
                </>
              ) : isLastStation ? (
                'Journey Complete'
              ) : (
                <>
                  <svg width="10" height="12" viewBox="0 0 10 12">
                    <polygon points="0,0 10,6 0,12" fill={INK} />
                  </svg>
                  Depart for {STATIONS[stIdx + 1]?.names?.en ?? 'Cape Town'} →
                </>
              )}
            </button>
          )}
        </div>

        {/* ═══ Station strip (bottom) ════════════════════════════ */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: `rgba(5,14,24,0.9)`, backdropFilter: 'blur(8px)', borderTop: `1px solid rgba(58,90,112,0.2)`, padding: '7px 14px', display: 'flex', gap: 3, alignItems: 'center', overflowX: 'auto', zIndex: 10 }}>
          {NODES.map((node, i) => {
            const visited = awoken.has(node.id)
            const current = i === nearestIdx && !isMoving
            return (
              <button
                key={node.id}
                onClick={() => {
                  const s = STATIONS[i]
                  if (s && visited) onStationClick(s)
                  else setVideoTarget(node.id)
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: current ? `rgba(200,120,58,0.12)` : 'transparent', border: `1px solid ${current ? `rgba(200,120,58,0.4)` : 'transparent'}`, borderRadius: 4, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!current) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!current) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 1, background: visited ? ACCENT : `rgba(58,90,112,0.35)`, display: 'inline-block', transform: 'rotate(45deg)', flexShrink: 0 }} />
                <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.07em', color: visited ? TEXT : `rgba(58,90,112,0.5)`, whiteSpace: 'nowrap' }}>
                  {node.num} {node.name}
                </span>
                <svg width="7" height="8" viewBox="0 0 7 8" style={{ opacity: visited ? 0.55 : 0.25 }}>
                  <polygon points="0,0 7,4 0,8" fill={visited ? ACCENT : DIM} />
                </svg>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ Video Modal ════════════════════════════════════════ */}
      {videoTarget && (() => {
        const vid = STATION_VIDEOS[videoTarget]
        const si  = NODES.findIndex(n => n.id === videoTarget)
        const st  = STATIONS[si]
        if (!st) return null
        return (
          <div
            onClick={() => setVideoTarget(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(2,5,12,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 780, background: SURFACE, borderRadius: 8, overflow: 'hidden', border: `1px solid rgba(200,120,58,0.25)`, boxShadow: `0 32px 100px rgba(0,0,0,0.8)`, animation: 'introFadeUp 0.22s ease-out both' }}
            >
              {/* Header */}
              <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: `rgba(200,120,58,0.5)`, textTransform: 'uppercase', marginBottom: 4 }}>
                    Chapter {st.num} · {st.terrain}
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: TEXT, lineHeight: 1.15 }}>
                    {vid ? vid.title : st.name}
                  </div>
                  <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 14, color: DIM, marginTop: 2 }}>
                    {st.subtitle}
                  </div>
                </div>
                <button onClick={() => setVideoTarget(null)} aria-label="Close" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', color: DIM, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
              </div>

              {/* Embed */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', background: VOID }}>
                {vid ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${vid.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: DISPLAY, fontSize: 18, color: DIM, marginBottom: 8 }}>Video not yet assigned</div>
                      <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 14, color: `rgba(58,90,112,0.6)` }}>
                        Add a YouTube ID to STATION_VIDEOS['{videoTarget}'] in src/data/videos.ts
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '14px 22px 16px', display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.14em', color: `rgba(200,120,58,0.45)`, textTransform: 'uppercase', marginBottom: 5 }}>About this stop</div>
                  <p style={{ fontFamily: TEXT_F, fontSize: 13, color: `rgba(230,217,184,0.7)`, margin: 0, lineHeight: 1.6 }}>
                    {st.heritage.slice(0, 200)}…
                  </p>
                </div>
                <div style={{ width: 150, flexShrink: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.14em', color: `rgba(200,120,58,0.45)`, textTransform: 'uppercase', marginBottom: 5 }}>Gems nearby</div>
                  {st.gems.slice(0, 2).map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                      <span style={{ color: SUPPORT, flexShrink: 0, fontSize: 9, marginTop: 2 }}>◆</span>
                      <span style={{ fontFamily: TEXT_F, fontSize: 12, color: DIM, lineHeight: 1.4 }}>{g.split(' — ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav */}
              <div style={{ padding: '0 22px 16px', display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                <button disabled={si === 0} onClick={() => setVideoTarget(NODES[si-1]?.id ?? null)}
                  style={{ background: 'transparent', border: `1px solid rgba(58,90,112,0.25)`, borderRadius: 5, padding: '7px 14px', cursor: si === 0 ? 'default' : 'pointer', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: DIM, opacity: si === 0 ? 0.35 : 1 }}>
                  ← Prev stop
                </button>
                <button onClick={() => setVideoTarget(null)}
                  style={{ background: 'transparent', border: `1px solid rgba(200,120,58,0.25)`, borderRadius: 5, padding: '7px 14px', cursor: 'pointer', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>
                  Back to map
                </button>
                <button disabled={si === NODES.length - 1} onClick={() => setVideoTarget(NODES[si+1]?.id ?? null)}
                  style={{ background: 'transparent', border: `1px solid rgba(58,90,112,0.25)`, borderRadius: 5, padding: '7px 14px', cursor: si === NODES.length - 1 ? 'default' : 'pointer', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: DIM, opacity: si === NODES.length - 1 ? 0.35 : 1 }}>
                  Next stop →
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
