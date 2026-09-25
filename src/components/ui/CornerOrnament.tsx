import type { CSSProperties } from 'react'

import { A } from '@/styles/tokens'

interface CornerOrnamentProps {
  position: 'tl' | 'tr' | 'bl' | 'br'
}

export function CornerOrnament({ position }: CornerOrnamentProps) {
  const style: CSSProperties = { position: 'absolute', width: 18, height: 18 }

  if (position === 'tl') { style.top = 6; style.left = 6 }
  if (position === 'tr') { style.top = 6; style.right = 6 }
  if (position === 'bl') { style.bottom = 6; style.left = 6 }
  if (position === 'br') { style.bottom = 6; style.right = 6 }

  const flipX = position.includes('r') ? -1 : 1
  const flipY = position.includes('b') ? -1 : 1

  return (
    <svg style={style} viewBox="0 0 18 18">
      <g transform={`scale(${flipX},${flipY}) translate(${flipX < 0 ? -18 : 0},${flipY < 0 ? -18 : 0})`}>
        <line x1="0" y1="9" x2="9" y2="0" stroke={A} strokeWidth="1" opacity="0.55" />
        <line x1="0" y1="14" x2="14" y2="0" stroke={A} strokeWidth="0.6" opacity="0.25" />
        <rect x="0" y="0" width="4" height="4" fill={A} opacity="0.45" />
      </g>
    </svg>
  )
}
