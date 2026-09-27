import { useEffect, useMemo, useRef } from 'react'
import rhinoUrl from '@/assets/thema-rhino.png'
import { usePreferences } from '@/lib/preferences'
import { useReadUpdates } from '@/lib/notificationsStore'
import { journeyUpdates, timetable, type JourneyUpdate } from '@/lib/schedule'

/**
 * The journey updates this passenger should see — filtered by their
 * Settings › Notifications choices — and how many are unread.
 */
export function useJourneyUpdates(stIdx: number, isMoving: boolean, tProg: number) {
  const prefs = usePreferences()
  const read = useReadUpdates()

  const updates = useMemo(() => {
    const stops = timetable(stIdx)
    return journeyUpdates(stIdx, isMoving, tProg).filter(u => {
      if (u.kind === 'soon') return prefs.notifyArriving
      if (u.kind === 'delay' || u.kind === 'recovery') {
        if (!prefs.notifyDelays) return false
        // Small delays below the passenger's threshold stay quiet
        const delay = stops[Number(u.id.split('-')[1])]?.delay ?? 0
        return u.kind === 'recovery' || delay >= prefs.delayThreshold
      }
      return true
    })
  }, [stIdx, isMoving, tProg, prefs.notifyArriving, prefs.notifyDelays, prefs.delayThreshold])

  const unread = updates.filter(u => !read.includes(u.id)).length
  return { updates, unread, read }
}

/**
 * Shows new updates as system notifications while the app is in the
 * background — only when the passenger turned it on and the browser allowed it.
 * Updates that already existed when the page loaded are never re-announced.
 */
export function useSystemNotifications(updates: JourneyUpdate[]) {
  const { systemNotifications } = usePreferences()
  const seen = useRef<Set<string> | null>(null)

  useEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(updates.map(u => u.id))
      return
    }
    const fresh = updates.filter(u => !seen.current!.has(u.id))
    fresh.forEach(u => seen.current!.add(u.id))

    if (!systemNotifications || !fresh.length || !('Notification' in window)) return
    if (Notification.permission !== 'granted' || !document.hidden) return

    fresh.forEach(u => {
      const options = { body: u.body, icon: rhinoUrl, tag: u.id }
      const fallback = () => { new Notification(u.title, options) }
      // Service-worker notifications work on Android; fall back to the page API elsewhere
      if (!('serviceWorker' in navigator)) return fallback()
      navigator.serviceWorker.getRegistration()
        .then(reg => (reg ? reg.showNotification(u.title, options) : fallback()))
        .catch(fallback)
    })
  }, [updates, systemNotifications])
}
