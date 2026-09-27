/**
 * tripStore.ts — hidden gems the passenger has saved to their trip, with the
 * visit date, guests and notes they chose. Saved on this device; nothing is
 * booked or paid. When Supabase is connected, sync the trip here.
 */

import { useSyncExternalStore } from 'react'

export interface TripItem {
  /** yyyy-mm-dd */
  date: string
  guests: number
  notes: string
  savedAt: number
}

/** attraction id → trip details */
export type Trip = Record<string, TripItem>

const STORAGE_KEY = 'enchanted-line:trip'

function load(): Trip {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Trip
  } catch {
    return {}
  }
}

let trip: Trip = load()
const listeners = new Set<() => void>()

function commit(next: Trip) {
  trip = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable — the trip lasts until the tab closes
  }
  listeners.forEach(l => l())
}

export function saveToTrip(attractionId: string, item: Omit<TripItem, 'savedAt'>) {
  commit({ ...trip, [attractionId]: { ...item, savedAt: trip[attractionId]?.savedAt ?? Date.now() } })
}

export function removeFromTrip(attractionId: string) {
  const { [attractionId]: _removed, ...rest } = trip
  commit(rest)
}

/** Empty the trip — used on sign-out so the next passenger starts clean */
export function clearTrip() {
  commit({})
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useTrip(): Trip {
  return useSyncExternalStore(subscribe, () => trip)
}

/** "2026-10-10" → "10 Oct 2026" */
export function formatTripDate(date: string): string {
  const d = new Date(`${date}T00:00:00`)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
