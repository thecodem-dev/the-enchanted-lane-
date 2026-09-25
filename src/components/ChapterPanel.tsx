import { STATIONS } from '@/data/stations'
import { WaxSeal } from '@/components/ui/WaxSeal'
import type { Language, Station } from '@/types'

import { T, A, D, SANS, MONO, DISPLAY } from '@/styles/tokens'

interface ChapterPanelProps {
  station: Station
  lang: Language
  completed: Set<string>
  isComplete: boolean
  stIdx: number
  isMobile: boolean
  onClose: () => void
  onContinue: () => void
}

export function ChapterPanel({
  station,
  lang,
  completed,
  isComplete,
  stIdx,
  isMobile,
  onClose,
  onContinue,
}: ChapterPanelProps) {
  const isStationComplete = completed.has(station.id)

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxHeight: '70dvh', zIndex: 100,
        borderTop: `1px solid rgba(201,168,76,0.3)`,
        borderLeft: 'none',
        borderRadius: '12px 12px 0 0',
        animation: 'mobileSheetUp 0.35s ease-out both',
      }
    : {
        width: 360, flexShrink: 0,
        borderLeft: `1px solid rgba(201,168,76,0.2)`,
        animation: 'chapterSlideIn 0.4s ease-out both',
      }

  return (
    <div style={{
      background: `linear-gradient(180deg, #162444 0%, #0F1E3A 100%)`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', position: 'relative',
      ...panelStyle,
    }}>
      {/* Mobile drag handle */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: `rgba(201,168,76,0.35)` }} />
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        padding: isMobile ? '12px 20px 14px' : '20px 24px 16px',
        borderBottom: `1px solid rgba(201,168,76,0.12)`,
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          aria-label="Close chapter panel"
          style={{
            position: 'absolute', top: isMobile ? 10 : 16, right: 16,
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: D,
            fontSize: 22, lineHeight: 1, padding: 4,
            minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        <div style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em',
          color: `rgba(201,168,76,0.55)`, textTransform: 'uppercase', marginBottom: 4,
        }}>
          Chapter {station.num} · {station.terrain.toUpperCase()}
        </div>

        <div style={{
          fontFamily: DISPLAY,
          fontSize: isMobile ? 22 : 26,
          fontWeight: 700, color: T, lineHeight: 1.1, letterSpacing: '0.02em',
        }}>
          {station.names[lang]}
        </div>

        <div style={{
          fontFamily: DISPLAY, fontStyle: 'italic',
          fontSize: 13, color: D, marginTop: 2, letterSpacing: '0.04em',
        }}>
          {station.subtitle}
        </div>

        {/* Art-deco rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, rgba(201,168,76,0.3))` }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="0" y="0" width="8" height="8" fill={A} opacity="0.5" transform="rotate(45 4 4)" />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(201,168,76,0.3))` }} />
        </div>
      </div>

      {/* ── Heritage ── */}
      <div style={{ padding: isMobile ? '14px 20px' : '18px 24px', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
        <div style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em',
          color: A, textTransform: 'uppercase', marginBottom: 8,
        }}>
          Heritage
        </div>
        <p style={{
          fontFamily: SANS,
          fontSize: 13, lineHeight: 1.7,
          color: `rgba(230,217,184,0.8)`, margin: 0,
        }}>
          {station.heritage}
        </p>
      </div>

      {/* ── Hidden Gems ── */}
      <div style={{ padding: isMobile ? '14px 20px' : '18px 24px', flex: 1 }}>
        <div style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em',
          color: A, textTransform: 'uppercase', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" style={{ animation: 'shimmerGem 2s ease-in-out infinite' }}>
            <rect x="0" y="0" width="8" height="8" fill={A} transform="rotate(45 4 4)" />
          </svg>
          Hidden Gems
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {station.gems.map((gem, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <svg width="6" height="6" viewBox="0 0 6 6" style={{ marginTop: 4, flexShrink: 0 }}>
                <rect x="0" y="0" width="6" height="6" fill={A} opacity="0.5" transform="rotate(45 3 3)" />
              </svg>
              <span style={{ fontFamily: SANS, fontSize: 12, lineHeight: 1.6, color: D }}>
                {gem}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wax seal ── */}
      {isStationComplete && (
        <div style={{
          padding: isMobile ? '10px 20px' : '12px 24px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderTop: `1px solid rgba(201,168,76,0.1)`,
        }}>
          <WaxSeal num={station.num} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: `rgba(201,168,76,0.5)`, letterSpacing: '0.1em' }}>
            Chapter {station.num} stamped in your passport
          </span>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: isMobile ? '12px 20px 20px' : '16px 24px',
        borderTop: `1px solid rgba(201,168,76,0.12)`,
        paddingBottom: isMobile ? 'max(20px, env(safe-area-inset-bottom))' : 16,
      }}>
        {isComplete ? (
          <div style={{
            textAlign: 'center', fontFamily: DISPLAY,
            fontStyle: 'italic', fontSize: 14, color: T, lineHeight: 1.6,
          }}>
            You have completed the journey.
            <br />
            <span style={{ fontSize: 12, color: D }}>
              1,600 km · 9 Chapters · One living story
            </span>
          </div>
        ) : (
          stIdx === STATIONS.findIndex(s => s.id === station.id) && (
            <button
              onClick={onContinue}
              style={{
                width: '100%',
                background: 'transparent',
                border: `1px solid rgba(201,168,76,0.45)`,
                borderRadius: 2, padding: '12px',
                cursor: 'pointer',
                fontFamily: MONO, fontSize: 11,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: A, transition: 'all 0.2s', minHeight: 44,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(201,168,76,0.1)`
                e.currentTarget.style.borderColor = A
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'
              }}
            >
              Continue Journey →
            </button>
          )
        )}
      </div>
    </div>
  )
}
