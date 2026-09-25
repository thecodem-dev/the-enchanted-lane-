import { S, A, T, MONO } from '@/styles/tokens'

/**
 * ChapterUnlockedBanner — brief animated toast shown when a new station is reached.
 * Rendered with `aria-live` so screen readers announce it automatically.
 */
export function ChapterUnlockedBanner() {
  return (
    <div
      aria-live="polite"
      style={{
        animation: 'awakenStation 0.8s ease-out forwards',
        background: S,
        border: `1px solid ${A}`, borderRadius: 2,
        padding: '7px 18px',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        pointerEvents: 'none', whiteSpace: 'nowrap',
        boxShadow: `0 4px 20px rgba(201,168,76,0.2)`,
      }}
    >
      <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
        <rect x="0" y="0" width="10" height="10" fill={A} transform="rotate(45 5 5)" />
      </svg>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.15em', color: T, textTransform: 'uppercase' }}>
        Chapter Unlocked
      </span>
    </div>
  )
}
