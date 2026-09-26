import { useOffline } from '@/hooks/useOffline'
import { S, T, D, R, G as SUPPORT, MONO, TEXT_F } from '@/styles/tokens'

/**
 * OfflineBanner — a non-blocking status strip that appears at the bottom
 * of the screen when the device has no network connection, and briefly
 * shows a "Back online" confirmation when it reconnects.
 *
 * All app content (stations, attractions, journey data) is baked into
 * the JS bundle, so the core experience works fully offline.
 * The only features that require a connection are:
 *   · Map tiles (previously visited areas remain available offline)
 *   · YouTube video embeds (videos won't play offline)
 */
export function OfflineBanner() {
  const { isOffline, wasOffline } = useOffline()

  if (!isOffline && !wasOffline) return null

  if (wasOffline && !isOffline) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: SUPPORT,
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: 'center',
          animation: 'mobileSheetUp 0.3s ease-out both',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke={T} strokeWidth="1.2" />
          <path d="M4 7 L6 9 L10 5" stroke={T} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, letterSpacing: '0.14em', color: T, textTransform: 'uppercase' }}>
          Back online
        </span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: S,
        borderTop: `1px solid rgba(145,112,67,0.39)`,
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'mobileSheetUp 0.3s ease-out both',
      }}
    >
      {/* Signal icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <line x1="2" y1="14" x2="2" y2="10" stroke={R} strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="14" x2="6" y2="7"  stroke="rgba(145,112,67,0.45)" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="14" x2="10" y2="4" stroke="rgba(145,112,67,0.26)"  strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="14" x2="14" y2="1" stroke="rgba(145,112,67,0.13)"  strokeWidth="2" strokeLinecap="round" />
        {/* Cross */}
        <line x1="9" y1="1" x2="15" y2="7" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="1" x2="9" y2="7" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '0.14em', color: T, textTransform: 'uppercase', marginBottom: 2 }}>
          Offline mode
        </div>
        <div style={{ fontFamily: TEXT_F, fontSize: 13, color: `rgba(62,35,24,0.7)` }}>
          Journey content and saved weather remain available offline. Previously viewed map areas remain cached; new areas and videos need a connection.
        </div>
      </div>

      <div style={{
        flexShrink: 0, textAlign: 'right',
        fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.1em',
        color: D, textTransform: 'uppercase', lineHeight: 1.6,
      }}>
        9 chapters<br />cached
      </div>
    </div>
  )
}
