/**
 * preferences.ts — passenger settings, saved on this device.
 *
 * A tiny external store: any component reads the current values with
 * usePreferences() and changes them with setPreference(); every reader
 * re-renders on change. Values persist in localStorage, falling back to
 * memory when storage is blocked.
 */

import { useSyncExternalStore } from 'react'
import type { Language } from '@/types'

export type TrainSpeed = 'leisurely' | 'standard' | 'express'
export type TemperatureUnit = 'c' | 'f'
export type DelayThreshold = 5 | 15 | 30

export interface Preferences {
  language: Language
  trainSpeed: TrainSpeed
  showMapWeather: boolean
  temperatureUnit: TemperatureUnit
  reduceMotion: boolean
  chapterAlerts: boolean
  autoplayVideos: boolean
  /** Delay updates and the running-late banner */
  notifyDelays: boolean
  /** "Arriving soon" updates */
  notifyArriving: boolean
  /** Only flag delays at least this many minutes */
  delayThreshold: DelayThreshold
  /** Also show updates as system notifications when the app is in the background */
  systemNotifications: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  trainSpeed: 'standard',
  showMapWeather: true,
  temperatureUnit: 'c',
  reduceMotion: false,
  chapterAlerts: true,
  autoplayVideos: true,
  notifyDelays: true,
  notifyArriving: true,
  delayThreshold: 15,
  systemNotifications: false,
}

const STORAGE_KEY = 'enchanted-line:preferences'

function load(): Preferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) }
  } catch {
    // storage blocked or malformed — use defaults
  }
  return DEFAULT_PREFERENCES
}

let current: Preferences = load()
const listeners = new Set<() => void>()

function commit(next: Preferences) {
  current = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable — the change lasts until the tab closes
  }
  listeners.forEach(l => l())
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  if (current[key] !== value) commit({ ...current, [key]: value })
}

export function resetPreferences() {
  commit(DEFAULT_PREFERENCES)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, () => current)
}

/** "18°C" / "64°F" — `withUnit: false` gives just "18°" */
export function formatTemperature(celsius: number, unit: TemperatureUnit, withUnit = true): string {
  const value = Math.round(unit === 'f' ? celsius * 9 / 5 + 32 : celsius)
  return `${value}°${withUnit ? unit.toUpperCase() : ''}`
}
