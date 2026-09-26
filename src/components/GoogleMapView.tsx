import { useRef, useState, useEffect } from 'react'
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { STATIONS } from '@/data/stations'
import { useStationWeather, type StationWeather } from '@/hooks/useStationWeather'
import type { Language, Station } from '@/types'

// ── Map palette — pinned to the previous Blue Train values ─────
const V    = '#0A0F1A'
const S    = '#0F1E3A'
const A    = '#C9A84C'
const T    = '#F0E8D0'
const D    = '#2A4A6A'
const MONO = "'DM Mono', 'Courier New', monospace"

// South African bounds in GeoJSON [lng, lat] format. These are used only for
// the initial view; the user can still pan and zoom freely afterward.
const ROUTE_BOUNDS: [[number, number], [number, number]] = [
  [16.0, -35.0],
  [33.0, -22.0],
]

function mapPosition(lng: number, lat: number) {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(`Invalid map coordinate: ${lng}, ${lat}`)
  }
  return { lng, lat }
}

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

function weatherIcon(code: number) {
  if (code === 0) return '☀'
  if (code <= 3) return '☁'
  if (code <= 48) return '≋'
  if (code <= 67) return '☂'
  return '⚡'
}

function createStationMarker(
  station: Station,
  isAwoken: boolean,
  isDone: boolean,
  isCurrent: boolean,
  weather?: StationWeather
) {
  const element = document.createElement('div')
  element.style.cssText = 'position:relative;width:1px;height:1px;display:block;pointer-events:none'

  const pin = document.createElement('button')
  pin.type = 'button'
  pin.title = `${station.names.en} — click to watch`

  const label = document.createElement('span')
  label.textContent = station.num
  label.style.transform = 'rotate(45deg)'
  pin.appendChild(label)

  pin.style.cssText = [
    'position:absolute',
    'top:-38px',
    'left:-16px',
    'z-index:2',
    'padding:0',
    'width:32px',
    'height:38px',
    'cursor:pointer',
    'font-family:' + MONO,
    'font-size:' + (station.num.length > 2 ? '8px' : '10px'),
    'font-weight:700',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'color:' + (isDone || isAwoken ? V : A),
    'background:' + (isDone ? A : isAwoken ? '#D4A84C' : S),
    'border:2px solid ' + (isDone ? '#DDB84E' : isAwoken ? A : D),
    'border-radius:50% 50% 50% 0',
    'transform:rotate(-45deg)' + (isCurrent ? ' scale(1.25)' : ''),
    'box-shadow:0 3px 12px rgba(0,0,0,0.5)',
    'transition:transform .18s ease',
  ].join(';')

  element.appendChild(pin)

  if (weather) {
    const badge = document.createElement('div')
    badge.textContent = `${weatherIcon(weather.weatherCode)} ${Math.round(weather.maximumTemperature)}° / ${Math.round(weather.temperature)}°  ·  ${weather.precipitation.toFixed(1)}mm  ·  ${Math.round(weather.windSpeed)}km/h`
    badge.title = `${station.name}: max ${Math.round(weather.maximumTemperature)}°C, rainfall ${weather.precipitation.toFixed(1)}mm, wind ${Math.round(weather.windSpeed)} km/h`
    badge.style.cssText = 'position:absolute;top:4px;left:-56px;width:112px;box-sizing:border-box;padding:3px 4px;border:1px solid rgba(201,168,76,.55);border-radius:3px;background:rgba(10,15,26,.92);color:#F0E8D0;font:700 8px ' + MONO + ';letter-spacing:.02em;text-align:center;white-space:nowrap;pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,.4)'
    element.appendChild(badge)
  }

  pin.style.pointerEvents = 'auto'
  element.addEventListener('mouseenter', () => { pin.style.transform = 'rotate(-45deg) scale(1.25)' })
  element.addEventListener('mouseleave', () => { pin.style.transform = `rotate(-45deg)${isCurrent ? ' scale(1.25)' : ''}` })

  return element
}

function createTrainMarker() {
  const element = document.createElement('div')
  element.setAttribute('aria-label', 'The Enchanted Line')
  element.innerHTML = '<svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x="0" y="2" width="12" height="5" rx="1.5" fill="#F0E8D0"/><rect x="2" y="0" width="7" height="4" rx="1" fill="#F0E8D0" opacity=".75"/><circle cx="2.5" cy="8" r="1.5" fill="#F0E8D0"/><circle cx="8.5" cy="8" r="1.5" fill="#F0E8D0"/></svg>'
  element.style.cssText = 'width:28px;height:28px;background:#7a2e1a;border:2px solid #F0E8D0;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(122,46,26,.8),0 2px 8px rgba(0,0,0,.6)'
  return element
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
  const mapRef = useRef<MapLibreMap | null>(null)
  const stationMarkersRef = useRef<Marker[]>([])
  const trainMarkerRef = useRef<Marker | null>(null)
  const onStationClickRef = useRef(onStationClick)
  const onVideoClickRef = useRef(onVideoClick)
  const [mapReady, setMapReady] = useState(false)
  const { weather } = useStationWeather()

  onStationClickRef.current = onStationClick
  onVideoClickRef.current = onVideoClick

  const current = STATIONS[stIdx] ?? STATIONS[0]!
  const next = STATIONS[Math.min(stIdx + 1, STATIONS.length - 1)] ?? current

  const trainPosition = mapPosition(
    current.lng + (next.lng - current.lng) * tProg,
    current.lat + (next.lat - current.lat) * tProg
  )

  // Initialize Map
  useEffect(() => {
    if (!wrapperRef.current) return

    const map = new maplibregl.Map({
      container: wrapperRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [24.5, -30.5],
      zoom: 4.5,
      minZoom: 2,
      maxZoom: 14,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

    map.on('load', () => {
      setMapReady(true)
      try {
        map.fitBounds(ROUTE_BOUNDS, {
          padding: 80,
          duration: 0,
        })
      } catch {
        map.setCenter([24.5, -30.5])
        map.setZoom(4.5)
      }
    })

    mapRef.current = map

    return () => {
      stationMarkersRef.current.forEach(marker => marker.remove())
      stationMarkersRef.current = []
      trainMarkerRef.current?.remove()
      trainMarkerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Sync Route Lines and Train Marker
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const route = STATIONS.map(s => {
      const pos = mapPosition(s.lng, s.lat)
      return [pos.lng, pos.lat]
    })

    const travelledRoute = [
      ...STATIONS.slice(0, stIdx + 1).map(s => {
        const pos = mapPosition(s.lng, s.lat)
        return [pos.lng, pos.lat]
      }),
      ...(stIdx < STATIONS.length - 1 ? [[trainPosition.lng, trainPosition.lat]] : []),
    ]

    const routeData = (coordinates: number[][]) => ({
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates },
    })

    const fullSource = map.getSource('full-route') as maplibregl.GeoJSONSource | undefined
    const travelledSource = map.getSource('travelled-route') as maplibregl.GeoJSONSource | undefined

    if (!fullSource) {
      map.addSource('full-route', { type: 'geojson', data: routeData(route) })
      map.addLayer({
        id: 'full-route-line',
        type: 'line',
        source: 'full-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': A, 'line-opacity': 0.3, 'line-width': 3, 'line-dasharray': [2, 2] },
      })
      map.addSource('travelled-route', { type: 'geojson', data: routeData(travelledRoute) })
      map.addLayer({
        id: 'travelled-route-line',
        type: 'line',
        source: 'travelled-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': A, 'line-opacity': 0.95, 'line-width': 5 },
      })
    } else {
      fullSource.setData(routeData(route))
      travelledSource?.setData(routeData(travelledRoute))
    }

    if (!trainMarkerRef.current) {
      trainMarkerRef.current = new maplibregl.Marker({ element: createTrainMarker() })
        .setLngLat(trainPosition)
        .addTo(map)
    } else {
      trainMarkerRef.current.setLngLat(trainPosition)
    }
  }, [mapReady, stIdx, tProg, trainPosition.lat, trainPosition.lng])

  // Sync Station Markers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    stationMarkersRef.current.forEach(marker => marker.remove())
    stationMarkersRef.current = STATIONS.map(station => {
      const weatherData = weather[station.id] || weather[station.name]
      const pos = mapPosition(station.lng, station.lat)

      const marker = new maplibregl.Marker({
        element: createStationMarker(
          station,
          awoken.has(station.id),
          completed.has(station.id),
          station.id === current.id,
          weatherData
        ),
        anchor: 'center',
      })
        .setLngLat(pos)
        .addTo(map)

      marker.getElement().addEventListener('click', () => {
        if (onVideoClickRef.current) {
          onVideoClickRef.current(station)
        } else if (awoken.has(station.id)) {
          onStationClickRef.current(station)
        }
      })

      return marker
    })
  }, [mapReady, stIdx, awoken, completed, lang, current.id, weather])

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
      {!mapReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: T, background: '#0A0F1A' }}>
          Loading map...
        </div>
      )}
    </div>
  )
}