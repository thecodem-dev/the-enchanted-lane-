import { STATIONS } from '@/data/stations'
import { PageHeader } from '@/components/ui/PageHeader'
import { useIsMobile } from '@/hooks/useIsMobile'
import { V, S, T, A, D, DISPLAY, MONO, SANS } from '@/styles/tokens'

/**
 * ThemaPanel — placeholder for Thema, the rhino guide. The conversation
 * feature isn't built yet; this page says so plainly rather than faking it.
 */
export function ThemaPanel() {
  const isMobile = useIsMobile()

  return (
    <div style={{ fontFamily: SANS, background: V, minHeight: '100%' }}>
      <PageHeader eyebrow="Your guide" title="Talk to Thema" subtitle="The line’s resident rhino." />

      <div style={{ padding: isMobile ? '20px 16px 32px' : '28px 36px 56px' }}>
        <div style={{
          background: S, borderRadius: 6, padding: isMobile ? '32px 20px' : '40px 36px',
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: isMobile ? 28 : 40, alignItems: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <svg width="72" height="72" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <ellipse cx="7" cy="10" rx="5" ry="3.5" stroke={A} strokeWidth="0.7" />
              <ellipse cx="12.5" cy="8.5" rx="2.5" ry="2" stroke={A} strokeWidth="0.7" />
              <line x1="14.5" y1="7" x2="16" y2="5" stroke={A} strokeWidth="0.7" strokeLinecap="round" />
              <line x1="4" y1="13.5" x2="4" y2="15" stroke={A} strokeWidth="0.6" strokeLinecap="round" />
              <line x1="7" y1="13.5" x2="7" y2="15" stroke={A} strokeWidth="0.6" strokeLinecap="round" />
              <line x1="10" y1="13.5" x2="10" y2="15" stroke={A} strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="13.5" cy="7.5" r="0.4" fill={A} />
            </svg>
            <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 32, fontWeight: 400, color: T, margin: '18px 0 10px', lineHeight: 1.05 }}>
              Thema is coming aboard soon
            </h3>
            <p style={{ fontSize: 14, color: D, lineHeight: 1.65, margin: 0, maxWidth: 380 }}>
              Before long you’ll be able to ask Thema about any town on the route, right here on the train.
            </p>
          </div>

          {/* The stops Thema will know — straight from the route */}
          <div style={isMobile
            ? { borderTop: '1px dashed rgba(145,112,67,0.45)', paddingTop: 24 }
            : { borderLeft: '1px dashed rgba(145,112,67,0.45)', paddingLeft: 40 }}>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: D, marginBottom: 14 }}>
              Every stop on the line
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              {STATIONS.map(s => (
                <li key={s.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                  <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: A, minWidth: 26 }}>{s.num}</span>
                  <span style={{ fontFamily: DISPLAY, fontSize: isMobile ? 19 : 22, color: T, lineHeight: 1.1 }}>{s.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
