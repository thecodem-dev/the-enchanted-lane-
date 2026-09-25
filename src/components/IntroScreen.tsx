import { LANGUAGES, CONDUCTOR_GREETING } from '@/data/stations'
import { ArtDecoOrnament } from '@/components/ui/ArtDecoOrnament'
import { CornerOrnament } from '@/components/ui/CornerOrnament'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Language } from '@/types'

import { V, S, T, A, D, SANS, MONO, DISPLAY } from '@/styles/tokens'

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
        <ArtDecoOrnament />

        {/* Ticket */}
        <div
          style={{
            animation: 'ticketDrop 0.9s ease-out 0.3s both',
            background: `linear-gradient(160deg, #0F1E3A 0%, #0C1830 60%, #162444 100%)`,
            border: `1px solid #C9A84C`,
            borderRadius: 3,
            padding: isMobile ? '24px 22px 20px' : '32px 44px 28px',
            marginBottom: isMobile ? 24 : 36,
            position: 'relative',
            boxShadow: `0 0 60px rgba(201,168,76,0.14), 0 0 120px rgba(201,168,76,0.05), 0 16px 64px rgba(0,0,0,0.85)`,
            width: '100%',
          }}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
            <CornerOrnament key={pos} position={pos} />
          ))}
          <div style={{
            position: 'absolute', inset: 7,
            border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 2, pointerEvents: 'none',
          }} />
          {/* Inner gold shimmer line */}
          <div style={{
            position: 'absolute', inset: 12,
            border: `1px solid rgba(201,168,76,0.1)`, borderRadius: 1, pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: MONO, fontSize: isMobile ? 9 : 10,
            letterSpacing: '0.2em', color: D,
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            South African Railways · Est. 1910
          </div>

          <div style={{
            fontFamily: DISPLAY,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 700, color: T,
            lineHeight: 1.1, letterSpacing: '0.04em',
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            The Enchanted Line
          </div>

          <div style={{
            fontFamily: DISPLAY, fontSize: isMobile ? 12 : 14,
            fontStyle: 'italic', color: `rgba(230,217,184,0.75)`,
            marginBottom: isMobile ? 14 : 20, letterSpacing: '0.06em',
          }}>
            A Living Museum on Rails
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: A, letterSpacing: '0.1em' }}>
                PRETORIA
              </span>
              <svg width="80" height="12" viewBox="0 0 80 12">
                <line x1="0" y1="6" x2="72" y2="6" stroke={A} strokeWidth="1" strokeDasharray="3 3" />
                <polygon points="72,3 80,6 72,9" fill={A} />
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 11, color: A, letterSpacing: '0.1em' }}>
                CAPE TOWN
              </span>
            </div>
          )}
          {isMobile && (
            <div style={{ fontFamily: MONO, fontSize: 10, color: A, letterSpacing: '0.08em', marginBottom: 4 }}>
              PRETORIA → CAPE TOWN
            </div>
          )}

          <div style={{ fontFamily: MONO, fontSize: 9, color: `rgba(201,168,76,0.5)`, letterSpacing: '0.08em' }}>
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
            fontFamily: DISPLAY, fontStyle: 'italic',
            fontSize: isMobile ? 12 : 14, color: D,
            marginBottom: 12, letterSpacing: '0.06em',
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
                  border: `1px solid ${lang === l.code ? A : `rgba(201,168,76,0.25)`}`,
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
                  color: lang === l.code ? T : `rgba(230,217,184,0.7)`,
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
            background: `linear-gradient(135deg, #C9A84C 0%, #E8C96A 40%, #C9A84C 70%, #A88430 100%)`,
            backgroundSize: '200% 100%',
            border: `1px solid rgba(232,201,106,0.6)`,
            borderRadius: 2,
            padding: isMobile ? '15px 40px' : '16px 56px',
            cursor: 'pointer',
            fontFamily: DISPLAY,
            fontSize: isMobile ? 15 : 17,
            letterSpacing: '0.22em',
            fontWeight: 600,
            fontStyle: 'italic',
            color: V,
            transition: 'all 0.25s',
            boxShadow: `0 4px 24px rgba(201,168,76,0.4), 0 1px 0 rgba(255,255,255,0.2) inset`,
            minHeight: 48, width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundPosition = '100% 0'
            e.currentTarget.style.boxShadow = `0 6px 32px rgba(201,168,76,0.55), 0 1px 0 rgba(255,255,255,0.2) inset`
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundPosition = '0 0'
            e.currentTarget.style.boxShadow = `0 4px 24px rgba(201,168,76,0.4), 0 1px 0 rgba(255,255,255,0.2) inset`
            e.currentTarget.style.transform = 'none'
          }}
        >
          Board the Train
        </button>

        <div style={{
          animation: 'introFadeUp 0.8s ease-out 1.1s both',
          fontFamily: MONO, fontSize: 10,
          color: `rgba(42,74,106,0.8)`, marginTop: 16, letterSpacing: '0.1em',
          paddingBottom: 8,
        }}>
          {CONDUCTOR_GREETING[lang]}
        </div>
      </div>
    </div>
  )
}
