import { useRef, useState, useEffect } from 'react'
import { APIProvider, AdvancedMarker, Map, Polyline } from '@vis.gl/react-google-maps'
import { STATIONS } from '@/data/stations'
import type { Language, Station } from '@/types'

// ── Map palette — pinned to the previous Blue Train values ─────
// The map markers are intentionally left out of the Antique Brass
// palette pass for now, so they don't follow '@/styles/tokens'.
const V    = '#0A0F1A'
const S    = '#0F1E3A'
const A    = '#C9A84C'
const T    = '#F0E8D0'
const D    = '#2A4A6A'
const MONO = "'DM Mono', 'Courier New', monospace"

interface GoogleMapViewProps {
  stIdx: number
  tProg: number
  awoken: Set<string>
  completed: Set<string>
  lang: Language
  /** Called when an awoken (visited) station is clicked — opens the chapter panel */
  onStationClick: (s: Station) => void
  /** Called when ANY station is clicked — opens the video modal.
   *  If not provided, falls back to onStationClick for awoken stations. */
  onVideoClick?: (s: Station) => void
}

// Custom pin element — a styled HTML element rendered inside AdvancedMarker
function StationPin({
  station, isAwoken, isDone, isCurrent, onClick,
}: {
  station: Station
  isAwoken: boolean
  isDone: boolean
  isCurrent: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const bg = isDone
    ? A
    : isAwoken
      ? '#D4A84C'
      : S

  const borderColor = isDone
    ? '#DDB84E'
    : isAwoken
      ? A
      : D

  const textColor = isDone || isAwoken ? V : A

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${station.names.en} — click to watch`}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transform: hovered || isCurrent ? 'scale(1.25) translateY(-4px)' : 'scale(1)',
        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        filter: isCurrent ? `drop-shadow(0 0 8px ${A})` : hovered ? `drop-shadow(0 0 5px rgba(201,168,76,0.6))` : 'none',
      }}
    >
      {/* Pin body */}
      <div style={{
        width: 32, height: 38,
        background: bg,
        border: `2px solid ${borderColor}`,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 3px 12px rgba(0,0,0,0.5)`,
      }}>
        {/* Inner content — rotated back */}
        <div style={{
          transform: 'rotate(45deg)',
          fontFamily: MONO,
          fontSize: station.num.length > 2 ? 8 : 10,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {station.num}
        </div>
      </div>

      {/* Play icon on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: -28, left: '50%',
          transform: 'translateX(-50%)',
          background: S,
          border: `1px solid rgba(201,168,76,0.4)`,
          borderRadius: 4,
          padding: '3px 8px',
          display: 'flex', alignItems: 'center', gap: 5,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}>
          <svg width="8" height="9" viewBox="0 0 8 9">
            <polygon points="0,0 8,4.5 0,9" fill={A} />
          </svg>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.08em', color: T }}>
            {station.names.en}
          </span>
        </div>
      )}
    </div>
  )
}

export function GoogleMapView({
  stIdx,
  tProg,
  awoken,
  completed,
  lang,
  onStationClick,
  onVideoClick,
}: GoogleMapViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      setSize({ w: Math.floor(entry.contentRect.width), h: Math.floor(entry.contentRect.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const current = STATIONS[stIdx]
  const next = STATIONS[Math.min(stIdx + 1, STATIONS.length - 1)]
  if (!current || !next) return null

  const trainPosition = {
    lat: current.lat + (next.lat - current.lat) * tProg,
    lng: current.lng + (next.lng - current.lng) * tProg,
  }

  const route = STATIONS.map(s => ({ lat: s.lat, lng: s.lng }))
  const travelledRoute = [
    ...STATIONS.slice(0, stIdx + 1).map(s => ({ lat: s.lat, lng: s.lng })),
    ...(stIdx < STATIONS.length - 1 ? [trainPosition] : []),
  ]

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
      {size && size.w > 0 && size.h > 0 && (
        <APIProvider apiKey={import.meta.env['VITE_GOOGLE_MAPS_API_KEY'] ?? ''}>
          <Map
            defaultCenter={{ lat: -30.5, lng: 24.5 }}
            defaultZoom={6}
            mapId="DEMO_MAP_ID"
            mapTypeId="terrain"
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: size.w, height: size.h, display: 'block' }}
          >
            {/* Full route — dim */}
            <Polyline
              path={route}
              strokeColor={A}
              strokeOpacity={0.22}
              strokeWeight={3}
            />
            {/* Travelled route — bright */}
            <Polyline
              path={travelledRoute}
              strokeColor={A}
              strokeOpacity={0.92}
              strokeWeight={5}
            />

            {/* Station markers — ALL clickable */}
            {STATIONS.map(station => {
              const isAwoken  = awoken.has(station.id)
              const isDone    = completed.has(station.id)
              const isCurrent = station.id === STATIONS[stIdx]?.id

              const handleClick = () => {
                // Always fire the video modal if the callback is provided
                if (onVideoClick) {
                  onVideoClick(station)
                } else if (isAwoken) {
                  onStationClick(station)
                }
              }

              return (
                <AdvancedMarker
                  key={station.id}
                  position={{ lat: station.lat, lng: station.lng }}
                  title={station.names[lang]}
                  clickable
                  onClick={handleClick}
                >
                  <StationPin
                    station={station}
                    isAwoken={isAwoken}
                    isDone={isDone}
                    isCurrent={isCurrent}
                    onClick={handleClick}
                  />
                </AdvancedMarker>
              )
            })}

            {/* Train marker */}
            <AdvancedMarker position={trainPosition} title="The Enchanted Line">
              <div style={{
                width: 28, height: 28,
                background: '#7a2e1a',
                border: `2px solid ${T}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 12px rgba(122,46,26,0.8), 0 2px 8px rgba(0,0,0,0.6)`,
                animation: 'glowPulse 1.5s ease-in-out infinite',
              }}>
                {/* Tiny train icon */}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <rect x="0" y="2" width="12" height="5" rx="1.5" fill={T} opacity="0.9" />
                  <rect x="2" y="0" width="7" height="4" rx="1" fill={T} opacity="0.75" />
                  <circle cx="2.5" cy="8" r="1.5" fill={T} opacity="0.9" />
                  <circle cx="8.5" cy="8" r="1.5" fill={T} opacity="0.9" />
                </svg>
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>
      )}
    </div>
  )
}
