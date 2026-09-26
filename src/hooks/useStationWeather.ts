import { useEffect, useState } from 'react'
import { STATIONS } from '@/data/stations'

export interface StationWeather {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  rain: number
  precipitation: number
  maximumTemperature: number
  weatherCode: number
  observedAt: string
}

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const WEATHER_CACHE_KEY = 'enchanted-line:station-weather'

function weatherRequestUrl() {
  const params = new URLSearchParams({
    latitude: STATIONS.map(station => station.lat).join(','),
    longitude: STATIONS.map(station => station.lng).join(','),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,rain,precipitation',
    daily: 'temperature_2m_max,precipitation_sum',
    timezone: 'auto',
    forecast_days: '1',
  })
  return `${WEATHER_URL}?${params.toString()}`
}

export function weatherDescription(code: number) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Misty'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  return 'Storm'
}

interface WeatherLocation {
  current?: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    rain: number
    precipitation: number
  }
  daily?: {
    temperature_2m_max: number[]
    precipitation_sum: number[]
  }
}

export function useStationWeather() {
  const [weather, setWeather] = useState<Record<string, StationWeather>>(() => {
    try {
      const cached = window.localStorage.getItem(WEATHER_CACHE_KEY)
      return cached ? JSON.parse(cached) as Record<string, StationWeather> : {}
    } catch {
      return {}
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeather() {
      try {
        const response = await fetch(weatherRequestUrl(), { signal: controller.signal })
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`)
        const payload = await response.json() as WeatherLocation | WeatherLocation[]
        const locations = Array.isArray(payload) ? payload : [payload]
        const nextWeather: Record<string, StationWeather> = {}

        STATIONS.forEach((station, index) => {
          const location = locations[index]
          const reading = location?.current
          if (!reading) return
          nextWeather[station.id] = {
            temperature: reading.temperature_2m,
            apparentTemperature: reading.apparent_temperature,
            humidity: reading.relative_humidity_2m,
            windSpeed: reading.wind_speed_10m,
            windDirection: reading.wind_direction_10m,
            rain: reading.rain,
            precipitation: reading.precipitation,
            maximumTemperature: location.daily?.temperature_2m_max[0] ?? reading.temperature_2m,
            weatherCode: reading.weather_code,
            observedAt: reading.time,
          }
        })

        setWeather(nextWeather)
        try {
          window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(nextWeather))
        } catch {
          // Weather remains available in memory when storage is unavailable.
        }
        setError(null)
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Weather unavailable')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadWeather()
    const refreshTimer = window.setInterval(loadWeather, 15 * 60 * 1000)
    return () => {
      controller.abort()
      window.clearInterval(refreshTimer)
    }
  }, [])

  return { weather, isLoading, error }
}

