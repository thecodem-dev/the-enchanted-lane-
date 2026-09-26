import { STATIONS } from '@/data/stations'
import { PageHeader } from '@/components/ui/PageHeader'
import { WaxSeal } from '@/components/ui/WaxSeal'
import { useIsMobile } from '@/hooks/useIsMobile'
import { V, S, T, A, D, R, DISPLAY, MONO, SANS } from '@/styles/tokens'
import type { Language, Station } from '@/types'

interface PassportPanelProps {
  lang: Language
  stIdx: number
  completed: Set<string>
  /** Open a reached station's chapter */
  onOpenStation: (s: Station) => void
}

/**
 * PassportPanel — one page per station. Departing a station presses its
 * wax seal; the current stop and the stations ahead wait unstamped.
 * Reached stations open their chapter on the map.
 */
export function PassportPanel({ lang, stIdx, completed, onOpenStation }: PassportPanelProps) {
  const isMobile = useIsMobile()
  return (
    <div style={{ fontFamily: SANS, background: V, minHeight: '100%' }}>
      <PageHeader
        eyebrow="Passport"
        title="Your passport"
        subtitle="A wax seal for every station you leave behind."
        aside={
          <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 4 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, color: T, lineHeight: 1 }}>{completed.size}</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, color: D, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
              of {STATIONS.length} seals
            </div>
          </div>
        }
      />

      <ol style={{
        listStyle: 'none', margin: 0, padding: isMobile ? '20px 16px 32px' : '28px 36px 56px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12,
      }}>
        {STATIONS.map((s, i) => {
          const isDone = completed.has(s.id)
          const isHere = i === stIdx && !isDone
          const status = isDone ? 'Stamped' : isHere ? 'You are here' : 'Ahead'
          const reached = isDone || isHere

          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!reached}
                onClick={() => onOpenStation(s)}
                aria-label={reached ? `${s.names[lang]}, ${status}. Open chapter` : `${s.names[lang]}, ${status}`}
                style={{
                  width: '100%', height: '100%', textAlign: 'left', font: 'inherit',
                  background: isDone ? S : 'transparent',
                  border: `1px ${isDone ? 'solid' : 'dashed'} ${isHere ? A : 'rgba(145,112,67,0.35)'}`,
                  borderRadius: 6, padding: '20px 18px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  opacity: reached ? 1 : 0.6,
                  cursor: reached ? 'pointer' : 'default',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { if (reached) e.currentTarget.style.borderColor = R }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isHere ? A : 'rgba(145,112,67,0.35)' }}
              >
                {isDone ? (
                  <WaxSeal num={s.num} size={56} />
                ) : (
                  <div aria-hidden="true" style={{
                    width: 56, height: 56, flexShrink: 0, borderRadius: '50%',
                    border: `1.5px dashed ${isHere ? A : 'rgba(145,112,67,0.45)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: DISPLAY, fontSize: 20, color: isHere ? A : D,
                  }}>
                    {s.num}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: isDone ? R : D, marginBottom: 4 }}>
                    {status}
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 24, color: T, lineHeight: 1.05 }}>{s.names[lang]}</div>
                  <div style={{ fontSize: 13, fontStyle: 'italic', color: D, marginTop: 3 }}>{s.subtitle}</div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
