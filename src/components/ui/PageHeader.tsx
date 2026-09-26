import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks/useIsMobile'
import { T, A, D, R, DISPLAY, MONO, SANS } from '@/styles/tokens'

interface PageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  /** Right-aligned slot, e.g. a count */
  aside?: ReactNode
}

/**
 * Shared header for the journey's sidebar pages (Passport, Hidden Gems,
 * Thema, Settings): rust eyebrow, Del Rose title, muted italic subtitle.
 */
export function PageHeader({ eyebrow, title, subtitle, aside }: PageHeaderProps) {
  const isMobile = useIsMobile()
  return (
    <div style={{
      padding: isMobile ? '20px 16px 16px' : '28px 36px 22px',
      borderBottom: '1px solid rgba(166,169,154,0.4)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true" style={{ animation: 'shimmerGem 2.5s ease-in-out infinite' }}>
            <rect x="0" y="0" width="9" height="9" fill={A} transform="rotate(45 4.5 4.5)" />
          </svg>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.22em', color: R, textTransform: 'uppercase' }}>
            {eyebrow}
          </span>
        </div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 32 : 40, fontWeight: 400, color: T, margin: '0 0 8px', lineHeight: 1 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontFamily: SANS, fontStyle: 'italic', fontSize: isMobile ? 14 : 16, color: D, margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>
      {aside}
    </div>
  )
}
