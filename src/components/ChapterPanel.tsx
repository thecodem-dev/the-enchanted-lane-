import { STATIONS } from '@/data/stations'
import { WaxSeal } from '@/components/ui/WaxSeal'
import type { Language, Station } from '@/types'

import { V, T, A, D, R, SANS, MONO, DISPLAY } from '@/styles/tokens'

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
        // Sits above the mobile bottom tab bar (56px + safe area) so navigation stays reachable
        position: 'fixed', bottom: 'calc(56px + env(safe-area-inset-bottom))', left: 0, right: 0,
        maxHeight: '62dvh', zIndex: 100,
        boxShadow: '0 -8px 24px rgba(62,35,24,0.14)',
        borderTop: `1px solid rgba(145,112,67,0.39)`,
        borderLeft: 'none',
        borderRadius: '12px 12px 0 0',
        animation: 'mobileSheetUp 0.35s ease-out both',
      }
    : {
        width: 360, flexShrink: 0, height: '100%',
        borderLeft: `1px solid rgba(145,112,67,0.26)`,
        animation: 'chapterSlideIn 0.4s ease-out both',
      }

  return (
    <div style={{
      background: V,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', position: 'relative',
      ...panelStyle,
    }}>
      {/* Mobile drag handle */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: `rgba(145,112,67,0.45)` }} />
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        padding: isMobile ? '12px 20px 14px' : '20px 24px 16px',
        borderBottom: `1px solid rgba(145,112,67,0.16)`,
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
          fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.2em',
          color: R, textTransform: 'uppercase', marginBottom: 4,
        }}>
          Chapter {station.num} · {station.terrain.toUpperCase()}
        </div>

        <div style={{
          fontFamily: DISPLAY,
          fontSize: isMobile ? 30 : 36,
          fontWeight: 400, color: T, lineHeight: 1,
        }}>
          {station.names[lang]}
        </div>

        <div style={{
          fontFamily: SANS, fontStyle: 'italic',
          fontSize: 13, color: D, marginTop: 4, letterSpacing: '0.04em',
        }}>
          {station.subtitle}
        </div>

        {/* Art-deco rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, rgba(145,112,67,0.39))` }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="0" y="0" width="8" height="8" fill={A} opacity="0.5" transform="rotate(45 4 4)" />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(145,112,67,0.39))` }} />
        </div>
      </div>

      {/* ── Heritage ── */}
      <div style={{ padding: isMobile ? '14px 20px' : '18px 24px', borderBottom: `1px solid rgba(62,35,24,0.06)` }}>
        <div style={{
          fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.2em',
          color: R, textTransform: 'uppercase', marginBottom: 8,
        }}>
          Heritage
        </div>
        <p style={{
          fontFamily: SANS,
          fontSize: 13, lineHeight: 1.7,
          color: `rgba(62,35,24,0.8)`, margin: 0,
        }}>
          {station.heritage}
        </p>
      </div>

      {/* ── Hidden Gems ── */}
      <div style={{ padding: isMobile ? '14px 20px' : '18px 24px', flex: 1 }}>
        <div style={{
          fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.2em',
          color: R, textTransform: 'uppercase', marginBottom: 10,
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
          borderTop: `1px solid rgba(145,112,67,0.13)`,
        }}>
          <WaxSeal num={station.num} />
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: R, letterSpacing: '0.1em' }}>
            Chapter {station.num} stamped in your passport
          </span>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: isMobile ? '12px 20px 20px' : '16px 24px',
        borderTop: `1px solid rgba(145,112,67,0.16)`,
        paddingBottom: isMobile ? 'max(20px, env(safe-area-inset-bottom))' : 16,
      }}>
        {isComplete ? (
          <div style={{
            textAlign: 'center', fontFamily: DISPLAY,
            fontSize: 24, fontWeight: 400, color: T, lineHeight: 1.3,
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
                border: `1px solid rgba(145,112,67,0.59)`,
                borderRadius: 2, padding: '12px',
                cursor: 'pointer',
                fontFamily: MONO, fontWeight: 500, fontSize: 11,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: R, transition: 'all 0.2s', minHeight: 44,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(145,112,67,0.13)`
                e.currentTarget.style.borderColor = A
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(145,112,67,0.59)'
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
