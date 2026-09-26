import type { Station } from '@/types'
import { useStationWeather, weatherDescription, weatherIcon } from '@/hooks/useStationWeather'
import { formatTemperature, usePreferences } from '@/lib/preferences'
import { A, D, MONO, T } from '@/styles/tokens'

interface StationWeatherProps {
  station: Station
}

export function StationWeather({ station }: StationWeatherProps) {
  const { weather, isLoading, error } = useStationWeather()
  const { temperatureUnit } = usePreferences()
  const reading = weather[station.id]

  if (isLoading) {
    return <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: D, letterSpacing: '0.06em' }}>Weather…</span>
  }

  if (error || !reading) {
    return <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: D, letterSpacing: '0.06em' }}>Weather unavailable</span>
  }

  return (
    <span
      title={`Live weather for ${station.name} · Open-Meteo`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: MONO, fontWeight: 500, fontSize: 10, color: T,
        letterSpacing: '0.06em', whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ color: A, fontSize: 12 }}>{weatherIcon(reading.weatherCode)}</span>
      <span>{formatTemperature(reading.temperature, temperatureUnit)} · {weatherDescription(reading.weatherCode)}</span>
      <span style={{ color: D }}>feels {formatTemperature(reading.apparentTemperature, temperatureUnit, false)}</span>
    </span>
  )
}
