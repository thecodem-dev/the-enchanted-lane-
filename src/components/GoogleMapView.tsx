import { useRef, useState, useEffect } from 'react'
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { STATIONS } from '@/data/stations'
import { useStationWeather, weatherIcon, type StationWeather } from '@/hooks/useStationWeather'
import type { Language, Station } from '@/types'

import { formatTemperature, usePreferences, type TemperatureUnit } from '@/lib/preferences'
import { V, T, A, D, R, MONO } from '@/styles/tokens'

// South African bounds in GeoJSON [lng, lat] format. These are used only for
// the initial view; the user can still pan and zoom freely afterward.
const ROUTE_BOUNDS: [[number, number], [number, number]] = [
  [16.0, -35.0],
  [33.0, -22.0],
]

// Tight box around the stations themselves — used on narrow screens
const STATION_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...STATIONS.map(s => s.lng)), Math.min(...STATIONS.map(s => s.lat))],
  [Math.max(...STATIONS.map(s => s.lng)), Math.max(...STATIONS.map(s => s.lat))],
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

function createStationMarker(
  station: Station,
  isAwoken: boolean,
  isDone: boolean,
  isCurrent: boolean,
  unit: TemperatureUnit,
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
    'font-weight:600',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    // Stamped = rust, reached = brass, ahead = cream outlined in brass
    'color:' + (isDone || isAwoken ? V : D),
    'background:' + (isDone ? R : isAwoken ? A : V),
    'border:2px solid ' + (isDone || isAwoken ? V : A),
    'border-radius:50% 50% 50% 0',
    'transform:rotate(-45deg)' + (isCurrent ? ' scale(1.25)' : ''),
    'box-shadow:0 3px 10px rgba(62,35,24,0.3)' + (isCurrent ? ',0 0 0 3px rgba(136,82,61,0.35)' : ''),
    'transition:transform .18s ease',
  ].join(';')

  element.appendChild(pin)

  if (weather) {
    const badge = document.createElement('div')
    // Compact label (icon + temperature) so neighbouring stations don't collide;
    // the full reading is in the tooltip.
    badge.textContent = `${weatherIcon(weather.weatherCode)} ${formatTemperature(weather.temperature, unit, false)}`
    badge.title = `${station.name}: ${formatTemperature(weather.temperature, unit)} now, max ${formatTemperature(weather.maximumTemperature, unit)}, rainfall ${weather.precipitation.toFixed(1)}mm, wind ${Math.round(weather.windSpeed)} km/h`
    badge.style.cssText = 'position:absolute;top:-30px;left:14px;box-sizing:border-box;padding:2px 6px;border:1px solid rgba(145,112,67,.45);border-radius:10px;background:rgba(250,244,224,.95);color:' + T + ';font:600 9px ' + MONO + ';letter-spacing:.02em;white-space:nowrap;pointer-events:auto;box-shadow:0 1px 4px rgba(62,35,24,.18)'
    element.appendChild(badge)
  }

  pin.style.pointerEvents = 'auto'
  element.addEventListener('mouseenter', () => { pin.style.transform = 'rotate(-45deg) scale(1.25)' })
  element.addEventListener('mouseleave', () => { pin.style.transform = `rotate(-45deg)${isCurrent ? ' scale(1.25)' : ''}` })

  return element
}

function createTrainMarker() {
  const element = document.createElement('div')
  element.setAttribute('aria-label', 'The Enchanted Lane train')
  element.innerHTML = `<svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x="0" y="2" width="12" height="5" rx="1.5" fill="${V}"/><rect x="2" y="0" width="7" height="4" rx="1" fill="${V}" opacity=".75"/><circle cx="2.5" cy="8" r="1.5" fill="${V}"/><circle cx="8.5" cy="8" r="1.5" fill="${V}"/></svg>`
  element.style.cssText = `width:28px;height:28px;background:${T};border:2px solid ${V};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px rgba(136,82,61,.35),0 2px 8px rgba(62,35,24,.35)`
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
  const { showMapWeather, temperatureUnit } = usePreferences()

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

    // Small maps — narrow phones, or phones held sideways — get a tighter frame and a
    // collapsed (ⓘ) credit so the route fills the screen
    const narrow = wrapperRef.current.clientWidth < 640 || wrapperRef.current.clientHeight < 420

    const map = new maplibregl.Map({
      container: wrapperRef.current,
      attributionControl: { compact: narrow },
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [24.5, -30.5],
      zoom: 4.5,
      minZoom: 2,
      maxZoom: 14,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

    map.on('load', () => {
      setMapReady(true)
      if (narrow) {
        // MapLibre opens the compact credit expanded (and re-opens it on first render) — collapse it
        // once the map has settled so it doesn't sit under the Depart and Thema buttons
        const collapse = () => wrapperRef.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
        collapse()
        map.once('idle', collapse)
      }
      try {
        map.fitBounds(narrow ? STATION_BOUNDS : ROUTE_BOUNDS, {
          // extra room on the right for the weather tags beside each pin
          padding: narrow ? { top: 40, bottom: 32, left: 32, right: 72 } : 80,
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
        paint: { 'line-color': A, 'line-opacity': 0.55, 'line-width': 3, 'line-dasharray': [2, 2] },
      })
      map.addSource('travelled-route', { type: 'geojson', data: routeData(travelledRoute) })
      map.addLayer({
        id: 'travelled-route-line',
        type: 'line',
        source: 'travelled-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': R, 'line-opacity': 0.95, 'line-width': 5 },
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
          temperatureUnit,
          showMapWeather ? weatherData : undefined,
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
  }, [mapReady, stIdx, awoken, completed, lang, current.id, weather, showMapWeather, temperatureUnit])

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
      {!mapReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: D, background: V, fontFamily: MONO, fontWeight: 500, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Loading map…
        </div>
      )}
    </div>
  )
}