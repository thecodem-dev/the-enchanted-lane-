import { A, D, V, MONO } from '@/styles/tokens'

interface CompassRoseProps {
  x: number
  y: number
}

export function CompassRose({ x, y }: CompassRoseProps) {
  return (
    <g transform={`translate(${x},${y})`} opacity="0.5">
      {[0, 90, 180, 270].map(deg => (
        <g key={deg} transform={`rotate(${deg})`}>
          <polygon points="0,-18 3,-8 -3,-8" fill={A} opacity="0.8" />
          <polygon points="0,-8 2,-2 -2,-2" fill={D} opacity="0.5" />
        </g>
      ))}
      {[45, 135, 225, 315].map(deg => (
        <g key={deg} transform={`rotate(${deg})`}>
          <polygon points="0,-12 2,-5 -2,-5" fill={A} opacity="0.35" />
        </g>
      ))}
      <circle cx="0" cy="0" r="3" fill={V} stroke={A} strokeWidth="1" />
      <circle cx="0" cy="0" r="1" fill={A} />
      <text
        x="0" y="-22"
        textAnchor="middle"
        fill={A} fontSize="7"
        fontFamily={MONO}
        letterSpacing="0.1em"
      >
        N
      </text>
    </g>
  )
}
