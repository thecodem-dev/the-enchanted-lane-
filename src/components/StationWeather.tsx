import type { Station } from '@/types'
import { useStationWeather, weatherDescription } from '@/hooks/useStationWeather'
import { D, MONO, T } from '@/styles/tokens'

interface StationWeatherProps {
  station: Station
}

export function StationWeather({ station }: StationWeatherProps) {
  const { weather, isLoading, error } = useStationWeather()
  const reading = weather[station.id]

  if (isLoading) {
    return <span style={{ fontFamily: MONO, fontSize: 9, color: D }}>WEATHER · …</span>
  }

  if (error || !reading) {
    return <span style={{ fontFamily: MONO, fontSize: 9, color: D }}>WEATHER · UNAVAILABLE</span>
  }

  return (
    <span
      title={`Live weather for ${station.name} · Open-Meteo`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: MONO, fontSize: 9, color: T,
        letterSpacing: '0.06em', whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">{reading.weatherCode <= 3 ? 'CLEAR' : reading.weatherCode >= 51 ? 'RAIN' : 'CLOUD'}</span>
      <span>{Math.round(reading.temperature)}°C · {weatherDescription(reading.weatherCode)}</span>
      <span style={{ color: D }}>Feels {Math.round(reading.apparentTemperature)}°</span>
      <span style={{ color: D }}>Open-Meteo</span>
    </span>
  )
}
