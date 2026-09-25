import { STATIONS } from '@/data/stations'
import { WaxSeal } from '@/components/ui/WaxSeal'
import type { Language, Station } from '@/types'

import { V, T, A, D, SANS, MONO, DISPLAY } from '@/styles/tokens'

interface StationContentProps {
  station: Station
  lang: Language
  isMoving: boolean
  isComplete: boolean
  stIdx: number
  completed: Set<string>
  onContinue: () => void
}

export function StationContent({
  station,
  lang,
  isMoving,
  isComplete,
  stIdx,
  completed,
  onContinue,
}: StationContentProps) {
  const isStationDone = completed.has(station.id)

  return (
    <div style={{ fontFamily: SANS, color: T }}>

      {/* ── Hero header ── */}
      <div style={{ padding: '40px 48px 32px', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: MONO,
          fontSize: 11, letterSpacing: '0.14em',
          color: A, textTransform: 'uppercase', marginBottom: 12,
        }}>
          Chapter {station.num} &mdash; {station.terrain.charAt(0).toUpperCase() + station.terrain.slice(1)}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: 44, fontWeight: 700,
          color: T, lineHeight: 1.05,
          margin: '0 0 8px', letterSpacing: '-0.01em',
        }}>
          {station.names[lang]}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: DISPLAY,
          fontStyle: 'italic', fontSize: 18,
          color: D, margin: '0 0 16px', lineHeight: 1.4,
        }}>
          {station.subtitle}
        </p>

        {/* Coordinates */}
        <div style={{
          fontFamily: MONO,
          fontSize: 11, color: `rgba(42,74,106,0.6)`, letterSpacing: '0.06em',
        }}>
          {Math.abs(station.lat).toFixed(4)}°{station.lat < 0 ? 'S' : 'N'},{' '}
          {Math.abs(station.lng).toFixed(4)}°{station.lng > 0 ? 'E' : 'W'}
        </div>

        {/* En-route status */}
        {isMoving && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 16, padding: '6px 12px',
            background: `rgba(201,168,76,0.07)`,
            border: `1px solid rgba(201,168,76,0.18)`, borderRadius: 2,
          }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6,
              borderRadius: '50%', background: A,
              animation: 'glowPulse 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: MONO, fontSize: 11,
              letterSpacing: '0.1em', color: A, textTransform: 'uppercase',
            }}>
              En route to {STATIONS[stIdx + 1]?.names[lang] ?? ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '32px 48px' }}>

        {/* Heritage */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: MONO, fontSize: 11,
            letterSpacing: '0.14em', color: A,
            textTransform: 'uppercase', margin: '0 0 14px', fontWeight: 400,
          }}>
            Heritage
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.85,
            color: `rgba(230,217,184,0.82)`, margin: 0, maxWidth: '72ch',
          }}>
            {station.heritage}
          </p>
        </section>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 40 }} />

        {/* Hidden gems */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: MONO, fontSize: 11,
            letterSpacing: '0.14em', color: A,
            textTransform: 'uppercase', margin: '0 0 18px', fontWeight: 400,
          }}>
            Hidden Gems
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {station.gems.map((gem, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: MONO, fontSize: 11,
                  color: A, opacity: 0.45, flexShrink: 0,
                  userSelect: 'none', minWidth: 18,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.65, color: D }}>
                  {gem}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Wax seal — after departure */}
        {isStationDone && (
          <>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 28 }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px',
              background: 'rgba(122,46,26,0.08)',
              border: '1px solid rgba(122,46,26,0.22)',
              borderRadius: 3, marginBottom: 8,
            }}>
              <WaxSeal num={station.num} size={32} />
              <div>
                <div style={{
                  fontFamily: MONO, fontSize: 10,
                  color: `rgba(201,168,76,0.55)`, letterSpacing: '0.12em',
                  textTransform: 'uppercase', marginBottom: 3,
                }}>
                  Passport Stamped
                </div>
                <div style={{
                  fontFamily: DISPLAY,
                  fontStyle: 'italic', fontSize: 14, color: A,
                }}>
                  Chapter {station.num} — {station.names[lang]}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '0 48px 48px' }}>
        {isComplete ? (
          <div style={{
            textAlign: 'center', padding: '28px',
            border: `1px solid rgba(201,168,76,0.15)`, borderRadius: 4,
          }}>
            <div style={{
              fontFamily: DISPLAY,
              fontStyle: 'italic', fontSize: 22, color: T, marginBottom: 8,
            }}>
              Journey Complete
            </div>
            <div style={{
              fontFamily: MONO, fontSize: 11,
              color: D, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              1,600 km &middot; 9 Chapters &middot; One living story
            </div>
          </div>
        ) : (
          <button
            onClick={onContinue}
            disabled={isMoving}
            style={{
              width: '100%',
              background: isMoving ? 'transparent' : A,
              border: `1px solid ${isMoving ? `rgba(201,168,76,0.2)` : A}`,
              borderRadius: 3, padding: '14px 24px',
              cursor: isMoving ? 'default' : 'pointer',
              fontFamily: MONO, fontSize: 12,
              letterSpacing: '0.12em', fontWeight: 500,
              textTransform: 'uppercase',
              color: isMoving ? D : V,
              transition: 'background 0.2s, color 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, minHeight: 48,
            }}
            onMouseEnter={e => { if (!isMoving) e.currentTarget.style.background = '#DDB84E' }}
            onMouseLeave={e => { if (!isMoving) e.currentTarget.style.background = A }}
          >
            {isMoving
              ? 'En Route…'
              : `Depart for ${STATIONS[stIdx + 1]?.names[lang] ?? 'Cape Town'} →`
            }
          </button>
        )}
      </div>
    </div>
  )
}
