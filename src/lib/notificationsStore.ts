/**
 * notificationsStore.ts — which journey updates the passenger has read.
 * Saved on this device; cleared with the journey on sign-out or restart.
 */

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'enchanted-line:read-updates'

function load(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

let read: string[] = load()
const listeners = new Set<() => void>()

function commit(next: string[]) {
  read = next
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage blocked */ }
  listeners.forEach(l => l())
}

export function markRead(ids: string[]) {
  const missing = ids.filter(id => !read.includes(id))
  if (missing.length) commit([...read, ...missing])
}

export function clearReadUpdates() {
  commit([])
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useReadUpdates(): string[] {
  return useSyncExternalStore(subscribe, () => read)
}
