/**
 * schedule.ts — the train's timetable and journey updates.
 *
 * ⚠ DEMO FEED. The timetable and delays below are illustrative, not an
 * operator's real schedule. Updates are derived from the passenger's journey
 * progress, so they appear as the train moves. At launch this module is
 * replaced by the rail partner's live feed (see the notifications plan):
 * keep the `StopTime` / `JourneyUpdate` shapes and swap the data source.
 */

import { STATIONS } from '@/data/stations'

/** Minutes after midnight on day 1 */
type TrainMinutes = number

export interface StopTime {
  stationId: string
  name: string
  /** Scheduled arrival (departure for the first stop) */
  scheduled: TrainMinutes
  /** Minutes late on arrival — the demo scenario */
  delay: number
  status: 'departed' | 'here' | 'due'
}

export interface JourneyUpdate {
  /** Stable id — used to track read / unread */
  id: string
  kind: 'boarded' | 'arrival' | 'delay' | 'recovery' | 'soon' | 'complete'
  title: string
  body: string
  /** Train time the update belongs to */
  at: TrainMinutes
  /** Rust for delays, olive for good news, brass for the rest */
  tone: 'delay' | 'good' | 'info'
}

const hm = (day: number, h: number, m: number): TrainMinutes => (day - 1) * 1440 + h * 60 + m

/** Demo timetable — scheduled arrival at each station, in journey order */
const TIMETABLE: TrainMinutes[] = [
  hm(1, 8, 30),   // Pretoria (departure)
  hm(1, 9, 50),   // Johannesburg
  hm(1, 13, 5),   // Klerksdorp
  hm(1, 17, 40),  // Kimberley
  hm(1, 21, 55),  // De Aar
  hm(2, 2, 40),   // Beaufort West
  hm(2, 6, 15),   // Matjiesfontein
  hm(2, 8, 50),   // Worcester
  hm(2, 11, 15),  // Cape Town
]

/** Demo scenario — minutes late on arrival at each station */
const DELAYS = [0, 0, 0, 5, 25, 40, 30, 15, 10]

/** Why the delay changed on the way to a station (keyed by that station's index) */
const CAUSES: Record<number, string> = {
  4: 'Freight traffic ahead on the line out of Kimberley.',
  5: 'A speed restriction on the Karoo section.',
  6: 'The train is making up time across the Karoo.',
  7: 'Still making up time through the Hex River Valley.',
  8: 'Almost back on schedule.',
}

/** "Day 1 · 08:30" */
export function formatTrainTime(t: TrainMinutes, withDay = true): string {
  const day = Math.floor(t / 1440) + 1
  const mins = ((t % 1440) + 1440) % 1440
  const time = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
  return withDay ? `Day ${day} · ${time}` : time
}

export const lateness = (delay: number) => (delay <= 0 ? 'On time' : `${delay} min late`)

/** The full timetable, with each stop's status for the current journey */
export function timetable(stIdx: number): StopTime[] {
  return STATIONS.map((s, i) => ({
    stationId: s.id,
    name: s.name,
    scheduled: TIMETABLE[i] ?? 0,
    delay: DELAYS[i] ?? 0,
    status: i < stIdx ? 'departed' : i === stIdx ? 'here' : 'due',
  }))
}

/** The next stop the train is heading for, or null at the terminus */
export function nextStop(stIdx: number): StopTime | null {
  return timetable(stIdx)[stIdx + 1] ?? null
}

/**
 * Every update so far, newest first — derived from where the train is,
 * so they appear as the passenger travels and survive a reload.
 */
export function journeyUpdates(stIdx: number, isMoving: boolean, tProg: number): JourneyUpdate[] {
  const stops = timetable(stIdx)
  const updates: JourneyUpdate[] = []
  const first = stops[0]!

  updates.push({
    id: 'boarded', kind: 'boarded', tone: 'info', at: first.scheduled,
    title: 'Welcome aboard',
    body: `Departing ${first.name} at ${formatTrainTime(first.scheduled, false)}, on time. Next stop: ${stops[1]?.name}.`,
  })

  stops.forEach((stop, i) => {
    if (i === 0) return
    const prev = stops[i - 1]!
    const departedPrev = i - 1 < stIdx || (i - 1 === stIdx && isMoving)

    // A change in lateness, announced as the train leaves the previous station
    if (departedPrev && stop.delay !== prev.delay && CAUSES[i]) {
      const worse = stop.delay > prev.delay
      updates.push({
        id: `delay-${i}`, kind: worse ? 'delay' : 'recovery', tone: worse ? 'delay' : 'good',
        at: prev.scheduled + prev.delay + 5,
        title: worse ? `Delay: now running ${stop.delay} min late` : stop.delay <= 15 ? 'Back on track' : `Now running ${stop.delay} min late`,
        body: `${CAUSES[i]} Expected in ${stop.name} at ${formatTrainTime(stop.scheduled + stop.delay, false)} (scheduled ${formatTrainTime(stop.scheduled, false)}).`,
      })
    }

    // Arriving soon — only while on the way there
    if (i === stIdx + 1 && isMoving && tProg >= 0.6) {
      updates.push({
        id: `soon-${i}`, kind: 'soon', tone: 'info', at: stop.scheduled + stop.delay - 15,
        title: `Arriving in ${stop.name} soon`,
        body: `About 15 minutes to go. ${lateness(stop.delay)}.`,
      })
    }

    // Arrival
    if (i <= stIdx) {
      const isLast = i === stops.length - 1
      updates.push({
        id: isLast ? 'complete' : `arrival-${i}`, kind: isLast ? 'complete' : 'arrival',
        tone: stop.delay >= 15 ? 'delay' : stop.delay > 0 ? 'info' : 'good',
        at: stop.scheduled + stop.delay,
        title: isLast ? `Journey complete — welcome to ${stop.name}` : `Arrived in ${stop.name}`,
        body: `Scheduled ${formatTrainTime(stop.scheduled, false)} · arrived ${formatTrainTime(stop.scheduled + stop.delay, false)} — ${lateness(stop.delay).toLowerCase()}.`,
      })
    }
  })

  return updates.sort((a, b) => b.at - a.at)
}

/**
 * Minutes late the train is running right now: towards the next stop while
 * moving, or how late it arrived while standing at a station — never a delay
 * that hasn't been announced yet.
 */
export function currentDelay(stIdx: number, isMoving: boolean): number {
  return isMoving ? (nextStop(stIdx)?.delay ?? 0) : (timetable(stIdx)[stIdx]?.delay ?? 0)
}
