import { STATIONS } from '@/data/stations'
import { PageHeader } from '@/components/ui/PageHeader'
import { ThemaAvatar, ThemaChat } from '@/components/ThemaChat'
import { useIsMobile } from '@/hooks/useIsMobile'
import { sendToThema, useThemaChat } from '@/lib/themaChat'
import { V, S, T, A, D, DISPLAY, MONO, SANS } from '@/styles/tokens'

const HOUSE_RULES = [
  'Thema talks about the Pretoria to Cape Town line and the places along it.',
  'Please don’t share emails, phone numbers or ID numbers — Thema will stop you.',
  'No questions about drugs or illegal substances.',
]

/**
 * ThemaPanel — a full conversation with Thema, the line's resident rhino,
 * beside quick questions for every stop and Thema's house rules.
 */
export function ThemaPanel() {
  const isMobile = useIsMobile()
  const { typing } = useThemaChat()

  return (
    <div style={{ fontFamily: SANS, background: V, minHeight: '100%' }}>
      <PageHeader eyebrow="Your guide" title="Talk to Thema" subtitle="The line’s resident rhino — ask about any stop or gem." />

      <div style={{
        padding: isMobile ? '20px 16px 32px' : '28px 36px 56px',
        display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 320px',
        gap: isMobile ? 16 : 32, alignItems: 'start',
      }}>
        {/* ── The conversation ── */}
        <section aria-label="Chat with Thema" style={{ background: S, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(145,112,67,0.2)' }}>
            <ThemaAvatar size={40} />
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 24, color: T, lineHeight: 1 }}>Thema</div>
              <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: D, marginTop: 4 }}>
                {typing ? 'Typing…' : 'Your rhino guide · always aboard'}
              </div>
            </div>
          </div>
          <ThemaChat height={isMobile ? '52dvh' : 460} />
        </section>

        {/* ── Quick questions + house rules ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: S, borderRadius: 6, padding: '20px 20px 16px' }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: T, margin: '0 0 4px', lineHeight: 1 }}>Ask about a stop</h3>
            <p style={{ fontSize: 12, color: D, margin: '0 0 12px' }}>Tap a station and Thema will tell you about it.</p>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: 2 }}>
              {STATIONS.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => sendToThema(`Tell me about ${s.name}`)}
                    disabled={typing}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'baseline', gap: 10, textAlign: 'left',
                      background: 'transparent', border: 'none', borderRadius: 4, padding: '6px 8px',
                      cursor: typing ? 'default' : 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(145,112,67,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: A, minWidth: 26 }}>{s.num}</span>
                    <span style={{ fontFamily: DISPLAY, fontSize: 20, color: T, lineHeight: 1.15 }}>{s.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ background: S, borderRadius: 6, padding: '20px 20px 18px' }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: T, margin: '0 0 10px', lineHeight: 1 }}>Thema’s house rules</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOUSE_RULES.map(rule => (
                <li key={rule} style={{ display: 'flex', gap: 10, fontSize: 13, color: D, lineHeight: 1.5 }}>
                  <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden="true" style={{ flexShrink: 0, marginTop: 7 }}>
                    <rect x="0" y="0" width="6" height="6" fill={A} transform="rotate(45 3 3)" />
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
