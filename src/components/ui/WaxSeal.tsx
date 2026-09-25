import { T as IVORY, A as SEAL_RIM } from '@/styles/tokens'

const SEAL_BG   = '#0A1E42'   // deep cobalt seal
const SEAL_BUMP = '#0D2254'   // slightly lighter relief bumps

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
            r="1.2" fill={SEAL_BUMP}
          />
        )
      })}
      {/* Roman numeral */}
      <text
        x="14" y="18"
        textAnchor="middle"
        fill={IVORY}
        fontSize={num.length > 3 ? 7 : 9}
        fontFamily="'Cormorant Garamond', 'Playfair Display', serif"
        fontStyle="italic"
        fontWeight="600"
      >
        {num}
      </text>
    </svg>
  )
}
