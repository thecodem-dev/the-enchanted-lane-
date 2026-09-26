import { V as NUMERAL, A as SEAL_RIM, R as SEAL_BG, T as SEAL_BUMP, SANS } from '@/styles/tokens'

interface WaxSealProps {
  num: string
  size?: number
}

export function WaxSeal({ num, size = 28 }: WaxSealProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 28 28"
      style={{ animation: 'stampIn 0.5s ease-out both' }}
    >
      {/* Outer gold ring */}
      <circle cx="14" cy="14" r="13.5" fill={SEAL_RIM} opacity="0.9" />
      {/* Inner seal body */}
      <circle cx="14" cy="14" r="12" fill={SEAL_BG} />
      {/* Inner gold hairline */}
      <circle cx="14" cy="14" r="10.5" fill="none" stroke={SEAL_RIM} strokeWidth="0.6" opacity="0.5" />
      {/* Relief bumps — like a real wax seal */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={14 + Math.cos(angle) * 12.2}
            cy={14 + Math.sin(angle) * 12.2}
            r="1.2" fill={SEAL_BUMP} opacity="0.3"
          />
        )
      })}
      {/* Roman numeral */}
      <text
        x="14" y="18"
        textAnchor="middle"
        fill={NUMERAL}
        fontSize={num.length > 3 ? 7 : 9}
        fontFamily={SANS}
        fontStyle="italic"
        fontWeight="600"
      >
        {num}
      </text>
    </svg>
  )
}
