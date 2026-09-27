import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, Flag, TrainFront, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useIsMobile } from '@/hooks/useIsMobile'
import { markRead } from '@/lib/notificationsStore'
import { formatTrainTime, lateness, nextStop, timetable, type JourneyUpdate } from '@/lib/schedule'
import { V, S, T, A, D, R, DISPLAY, MONO, SANS } from '@/styles/tokens'

const GOOD = '#4E6B45' // the palette's olive — "on time" and "back on track"

const TONE: Record<JourneyUpdate['tone'], string> = { delay: R, good: GOOD, info: A }

const KIND_ICON: Record<JourneyUpdate['kind'], LucideIcon> = {
  boarded: TrainFront, arrival: Flag, delay: AlertTriangle, recovery: CheckCircle2, soon: Clock, complete: Flag,
}

interface NotificationsPanelProps {
  stIdx: number
  isComplete: boolean
  updates: JourneyUpdate[]
  /** Update ids already read before this visit */
  read: string[]
}

function StatusChip({ delay }: { delay: number }) {
  const late = delay > 0
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 12, padding: '4px 10px',
      background: late ? 'rgba(136,82,61,0.12)' : 'rgba(78,107,69,0.12)', color: late ? R : GOOD,
      fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: late ? R : GOOD }} />
      {lateness(delay)}
    </span>
  )
}

/**
 * NotificationsPanel — the next arrival, every update from the line so far,
 * and the full timetable with live estimates. Driven by the demo feed in
 * @/lib/schedule until the rail partner's live feed is connected.
 */
export function NotificationsPanel({ stIdx, isComplete, updates, read }: NotificationsPanelProps) {
  const isMobile = useIsMobile()
  const stops = timetable(stIdx)
  const next = nextStop(stIdx)
  const terminus = stops[stops.length - 1]!

  // Highlight what was new when the page opened, then mark everything read
  const [newOnOpen] = useState(() => new Set(updates.filter(u => !read.includes(u.id)).map(u => u.id)))
  useEffect(() => { markRead(updates.map(u => u.id)) }, [updates])

  return (
    <div style={{ fontFamily: SANS, background: V, minHeight: '100%' }}>
      <PageHeader
        eyebrow="Journey alerts"
        title="Updates from the line"
        subtitle="Your train’s timetable, and anything that changes along the way."
        aside={
          <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 4 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, color: T, lineHeight: 1 }}>{newOnOpen.size}</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, color: D, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>New</div>
          </div>
        }
      />

      <div style={{
        padding: isMobile ? '20px 16px 32px' : '28px 36px 56px',
        display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 340px',
        gap: isMobile ? 16 : 32, alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* ── Next arrival ── */}
          <section aria-label="Next arrival" style={{ background: S, borderRadius: 6, padding: isMobile ? '18px 16px' : '22px 24px' }}>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: R, marginBottom: 6 }}>
              {isComplete ? 'Journey complete' : 'Next stop'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 34 : 42, fontWeight: 400, color: T, margin: 0, lineHeight: 1 }}>
                {isComplete ? terminus.name : next?.name}
              </h3>
              <StatusChip delay={isComplete ? terminus.delay : (next?.delay ?? 0)} />
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', justifyContent: 'start', gap: '4px 32px', margin: '16px 0 0' }}>
              {(() => {
                const stop = isComplete ? terminus : next
                if (!stop) return null
                return (
                  <>
                    <dt style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: D }}>Scheduled</dt>
                    <dt style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: D }}>{isComplete ? 'Arrived' : 'Expected'}</dt>
                    <dd style={{ margin: 0, fontFamily: DISPLAY, fontSize: 28, color: stop.delay > 0 ? D : T, lineHeight: 1, textDecoration: stop.delay > 0 ? 'line-through' : 'none' }}>
                      {formatTrainTime(stop.scheduled, false)}
                    </dd>
                    <dd style={{ margin: 0, fontFamily: DISPLAY, fontSize: 28, color: T, lineHeight: 1 }}>
                      {formatTrainTime(stop.scheduled + stop.delay, false)}
                    </dd>
                  </>
                )
              })()}
            </dl>
          </section>

          {/* ── Updates ── */}
          <section aria-label="Updates">
            <h3 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: T, margin: '0 0 12px', lineHeight: 1 }}>Updates</h3>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {updates.map(u => {
                const Icon = KIND_ICON[u.kind]
                const isNew = newOnOpen.has(u.id)
                return (
                  <li key={u.id} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start', borderRadius: 6,
                    padding: isMobile ? '14px 14px' : '16px 18px',
                    background: isNew ? S : 'transparent',
                    border: `1px solid ${isNew ? 'transparent' : 'rgba(145,112,67,0.25)'}`,
                    animation: 'gemDrop 0.28s ease-out both',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: V, border: `1px solid ${TONE[u.tone]}`, color: TONE[u.tone],
                    }}>
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: T }}>
                          {isNew && <span aria-label="New" style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: R, marginRight: 8, verticalAlign: 'middle' }} />}
                          {u.title}
                        </span>
                        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: D, whiteSpace: 'nowrap' }}>
                          {formatTrainTime(u.at)}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: D, margin: '4px 0 0', lineHeight: 1.55 }}>{u.body}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        {/* ── Timetable ── */}
        <aside aria-label="Timetable" style={{ background: S, borderRadius: 6, padding: '20px 20px 16px', position: isMobile ? 'static' : 'sticky', top: 24 }}>
          <h3 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: T, margin: '0 0 4px', lineHeight: 1 }}>Timetable</h3>
          <p style={{ fontSize: 12, color: D, margin: '0 0 12px' }}>Pretoria to Cape Town · scheduled and expected</p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {stops.map((stop, i) => {
              const here = stop.status === 'here'
              const done = stop.status === 'departed' || (here && isComplete)
              return (
                <li key={stop.stationId} style={{
                  display: 'grid', gridTemplateColumns: '14px minmax(0, 1fr) auto', gap: 12, alignItems: 'center',
                  padding: '9px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(145,112,67,0.18)',
                }}>
                  <span aria-hidden="true" style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: done ? R : here ? A : V, border: `2px solid ${done ? R : A}`,
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: here ? 600 : 400, color: T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stop.name}</div>
                    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: here ? R : D, marginTop: 2 }}>
                      {i === 0 ? (stIdx > 0 || here ? 'Departed' : 'Departs') : done ? 'Arrived' : here ? 'You are here' : 'Due'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, color: stop.delay > 0 && i > 0 ? D : T, textDecoration: stop.delay > 0 && i > 0 ? 'line-through' : 'none' }}>
                      {formatTrainTime(stop.scheduled, false)}
                    </div>
                    {stop.delay > 0 && i > 0 && (
                      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, color: R }}>{formatTrainTime(stop.scheduled + stop.delay, false)}</div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
          <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: D, margin: '14px 0 0', lineHeight: 1.6 }}>
            Demo timetable · live times from the rail partner at launch
          </p>
        </aside>
      </div>
    </div>
  )
}
