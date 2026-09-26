import { LANGUAGES, CONDUCTOR_GREETING } from '@/data/stations'
import { Logo } from '@/components/ui/Logo'
import { CornerOrnament } from '@/components/ui/CornerOrnament'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Language } from '@/types'

import { V, S, T, A, D, R, SANS, MONO, DISPLAY } from '@/styles/tokens'

interface IntroScreenProps {
  lang: Language
  setLang: (l: Language) => void
  onBegin: () => void
}

export function IntroScreen({ lang, setLang, onBegin }: IntroScreenProps) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{ background: V, fontFamily: SANS }}
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Starfield */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35 }}>
        {Array.from({ length: 80 }, (_, i) => (
          <circle
            key={i}
            cx={`${(i * 137.508) % 100}%`}
            cy={`${(i * 89.3) % 100}%`}
            r={i % 3 === 0 ? 1.2 : 0.7}
            fill={A}
            opacity={0.25 + (i % 5) * 0.1}
          />
        ))}
      </svg>

      {/* Radiating lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.05 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * Math.PI * 2
          return (
            <line
              key={i}
              x1="50%" y1="50%"
              x2={`${50 + Math.cos(angle) * 80}%`}
              y2={`${50 + Math.sin(angle) * 80}%`}
              stroke={A} strokeWidth="1"
            />
          )
        })}
      </svg>

      {/* Scrollable content wrapper */}
      <div
        className="relative z-10 flex flex-col items-center text-center w-full"
        style={{
          padding: isMobile ? '24px 16px 32px' : '32px 24px',
          maxWidth: 560,
          margin: '0 auto',
          animation: 'introFadeUp 1s ease-out both',
          overflowY: 'auto',
          maxHeight: '100dvh',
        }}
      >
        <Logo className="mb-5 h-24 w-24 ring-1 ring-brass/50 shadow-[0_8px_24px_rgba(62,35,24,0.18)]" />

        {/* Ticket */}
        <div
          style={{
            animation: 'ticketDrop 0.9s ease-out 0.3s both',
            background: `linear-gradient(160deg, ${V} 0%, ${V} 45%, rgba(215,203,181,0.55) 100%)`,
            border: `1px solid ${A}`,
            borderRadius: 3,
            padding: isMobile ? '24px 22px 20px' : '32px 44px 28px',
            marginBottom: isMobile ? 24 : 36,
            position: 'relative',
            boxShadow: `0 1px 0 rgba(145,112,67,0.25), 0 18px 48px rgba(62,35,24,0.14), 0 4px 12px rgba(62,35,24,0.08)`,
            width: '100%',
          }}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
            <CornerOrnament key={pos} position={pos} />
          ))}
          <div style={{
            position: 'absolute', inset: 7,
            border: `1px solid rgba(145,112,67,0.39)`, borderRadius: 2, pointerEvents: 'none',
          }} />
          {/* Inner gold shimmer line */}
          <div style={{
            position: 'absolute', inset: 12,
            border: `1px solid rgba(145,112,67,0.13)`, borderRadius: 1, pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: MONO, fontWeight: 500, fontSize: isMobile ? 9 : 10,
            letterSpacing: '0.2em', color: D,
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            South African Railways · Est. 1910
          </div>

          <div style={{
            fontFamily: DISPLAY,
            fontSize: isMobile ? 36 : 48,
            fontWeight: 400, color: T,
            lineHeight: 1, marginBottom: 6,
          }}>
            The Enchanted Line
          </div>

          <div style={{
            fontFamily: SANS, fontSize: isMobile ? 12 : 13,
            fontStyle: 'italic', color: `rgba(62,35,24,0.75)`,
            marginBottom: isMobile ? 14 : 20, letterSpacing: '0.06em',
          }}>
            A Living Museum on Rails
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, color: R, letterSpacing: '0.1em' }}>
                PRETORIA
              </span>
              <svg width="80" height="12" viewBox="0 0 80 12">
                <line x1="0" y1="6" x2="72" y2="6" stroke={A} strokeWidth="1" strokeDasharray="3 3" />
                <polygon points="72,3 80,6 72,9" fill={A} />
              </svg>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, color: R, letterSpacing: '0.1em' }}>
                CAPE TOWN
              </span>
            </div>
          )}
          {isMobile && (
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: R, letterSpacing: '0.08em', marginBottom: 4 }}>
              PRETORIA → CAPE TOWN
            </div>
          )}

          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, color: D, letterSpacing: '0.08em' }}>
            1,600 km · 9 Chapters · 1 Story
          </div>
        </div>

        {/* Language picker */}
        <div style={{
          animation: 'introFadeUp 0.8s ease-out 0.7s both',
          marginBottom: isMobile ? 20 : 32,
          width: '100%',
        }}>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 400,
            fontSize: isMobile ? 22 : 26, color: T,
            marginBottom: 14, lineHeight: 1.1,
          }}>
            Which tongue shall the conductor speak?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  background: lang === l.code ? S : 'transparent',
                  border: `1px solid ${lang === l.code ? A : `rgba(145,112,67,0.33)`}`,
                  borderRadius: 2,
                  padding: isMobile ? '10px 12px' : '10px 16px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  minHeight: 44,
                }}
              >
                <span style={{
                  fontFamily: SANS,
                  fontSize: isMobile ? 12 : 13, fontWeight: 500,
                  color: lang === l.code ? T : `rgba(62,35,24,0.7)`,
                  letterSpacing: '0.04em',
                }}>
                  {l.label}
                </span>
                {lang === l.code && (
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <rect x="0" y="0" width="8" height="8" fill={A} transform="rotate(45 4 4)" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onBegin}
          style={{
            animation: 'introFadeUp 0.8s ease-out 0.9s both',
            background: R,
            border: `1px solid ${R}`,
            borderRadius: 2,
            padding: isMobile ? '15px 40px' : '16px 56px',
            cursor: 'pointer',
            fontFamily: SANS,
            fontSize: isMobile ? 14 : 15,
            letterSpacing: '0.16em',
            fontWeight: 500,
            color: V,
            transition: 'all 0.25s',
            boxShadow: `0 4px 16px rgba(136,82,61,0.28), 0 1px 0 rgba(250,244,224,0.2) inset`,
            minHeight: 48, width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = T
            e.currentTarget.style.boxShadow = `0 6px 20px rgba(62,35,24,0.3), 0 1px 0 rgba(250,244,224,0.2) inset`
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = R
            e.currentTarget.style.boxShadow = `0 4px 16px rgba(136,82,61,0.28), 0 1px 0 rgba(250,244,224,0.2) inset`
            e.currentTarget.style.transform = 'none'
          }}
        >
          Board the Train
        </button>

        <div style={{
          animation: 'introFadeUp 0.8s ease-out 1.1s both',
          fontFamily: MONO, fontWeight: 500, fontSize: 10,
          color: D, marginTop: 16, letterSpacing: '0.1em',
          paddingBottom: 8,
        }}>
          {CONDUCTOR_GREETING[lang]}
        </div>
      </div>
    </div>
  )
}
