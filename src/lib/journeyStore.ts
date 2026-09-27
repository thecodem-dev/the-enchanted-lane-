/**
 * journeyStore.ts — saves the passenger's journey on this device as they
 * travel, so a reload picks up where they left off: current station,
 * reached stations, passport seals, and whether they've boarded.
 *
 * This is the one place journey progress is read and written — when Supabase
 * is connected, sync these to the passenger's account here.
 */

export interface SavedJourney {
  /** Index of the station the train is at */
  stIdx: number
  awoken: string[]
  completed: string[]
  /** Passed the intro screen at least once */
  boarded: boolean
}

const STORAGE_KEY = 'enchanted-line:journey'

export function loadJourney(): SavedJourney | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const j = JSON.parse(raw) as Partial<SavedJourney>
    if (typeof j.stIdx !== 'number' || !Array.isArray(j.awoken) || !Array.isArray(j.completed)) return null
    return { stIdx: j.stIdx, awoken: j.awoken, completed: j.completed, boarded: j.boarded === true }
  } catch {
    return null // storage blocked or malformed — start fresh
  }
}

export function saveJourney(patch: Partial<SavedJourney>) {
  const current = loadJourney() ?? { stIdx: 0, awoken: [], completed: [], boarded: false }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }))
  } catch {
    // storage unavailable — progress lasts until the tab closes
  }
}

export function clearJourney() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing stored
  }
}

/** A passenger who has boarded before goes straight back to the map on reload */
export function hasBoarded(): boolean {
  return loadJourney()?.boarded === true
}
