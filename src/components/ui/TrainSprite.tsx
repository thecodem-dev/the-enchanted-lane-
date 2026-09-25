import { STATIONS } from '@/data/stations'

import { V, S, A, T } from '@/styles/tokens'

interface TrainSpriteProps {
  x: number
  y: number
  stIdx: number
}

export function TrainSprite({ x, y, stIdx }: TrainSpriteProps) {
  const dx =
    stIdx < STATIONS.length - 1
      ? (STATIONS[stIdx + 1]?.x ?? 0) - (STATIONS[stIdx]?.x ?? 0)
      : -1
  const scale = dx > 0 ? 1 : -1

  return (
    <g transform={`translate(${x}, ${y})`}>
      {[0, 1, 2].map(i => (
        <circle
          key={i}
          cx={-scale * (8 + i * 5)}
          cy={-8 - i * 3}
          r={2 + i}
          fill={T}
          opacity={0}
          style={{
            animation: `trainSmoke 1.2s ease-out ${i * 0.3}s infinite`,
            transformOrigin: `${-scale * (8 + i * 5)}px ${-8 - i * 3}px`,
          }}
        />
      ))}
      <g transform={`scale(${scale}, 1)`}>
        {/* Cab */}
        <rect x="-6" y="-7" width="8" height="7" rx="1" fill={S} stroke={A} strokeWidth="0.8" />
        <rect x="-4" y="-5.5" width="3" height="3" rx="0.5" fill={T} opacity="0.55" />
        {/* Body */}
        <rect x="2" y="-5" width="10" height="5" rx="2" fill={S} stroke={A} strokeWidth="0.8" />
        {/* Stack */}
        <rect x="9" y="-9" width="2.5" height="4" rx="0.5" fill={S} stroke={A} strokeWidth="0.7" />
        {/* Wheels */}
        <circle cx="-2" cy="2" r="2.5" fill={V} stroke={A} strokeWidth="0.8" />
        <circle cx="5" cy="2" r="2.5" fill={V} stroke={A} strokeWidth="0.8" />
        <circle cx="10" cy="2" r="2" fill={V} stroke={A} strokeWidth="0.7" />
        {/* Headlamp */}
        <circle cx="12" cy="-3" r="1.2" fill={A} opacity="0.9" />
      </g>
    </g>
  )
}
