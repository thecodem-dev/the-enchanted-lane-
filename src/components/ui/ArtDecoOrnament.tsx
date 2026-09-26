import { A } from '@/styles/tokens'

/**
 * Horizontal art-deco decorative divider used above the intro ticket.
 */
export function ArtDecoOrnament() {
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" style={{ marginBottom: 12 }}>
      <rect x="56" y="10" width="8" height="8" fill={A} transform="rotate(45 60 14)" />
      <line x1="0" y1="14" x2="48" y2="14" stroke={A} strokeWidth="1" opacity="0.45" />
      <line x1="72" y1="14" x2="120" y2="14" stroke={A} strokeWidth="1" opacity="0.45" />
      {[20, 36, 84, 100].map(x => (
        <rect
          key={x} x={x - 3} y={11} width={6} height={6}
          fill="none" stroke={A} strokeWidth="0.8" opacity="0.45"
          transform={`rotate(45 ${x} 14)`}
        />
      ))}
      <line x1="20" y1="4" x2="100" y2="4" stroke={`rgba(145,112,67,0.33)`} strokeWidth="0.5" />
      <line x1="20" y1="24" x2="100" y2="24" stroke={`rgba(145,112,67,0.33)`} strokeWidth="0.5" />
    </svg>
  )
}
