import { S, T, A, D, R, DISPLAY, SANS, MONO } from '@/styles/tokens'

export type NavItem = 'map' | 'passport' | 'gems' | 'quiz' | 'rhino' | 'settings'

interface DashboardSidebarProps {
  awoken: Set<string>
  completed: Set<string>
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
}

interface NavEntry {
  id: NavItem
  label: string
  badge?: string | undefined
}

function SidebarIcon({ id, active }: { id: NavItem; active: boolean }) {
  const c = active ? R : D
  switch (id) {
    case 'map':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z"
            stroke={c} strokeWidth="1.2" />
          <circle cx="8" cy="6" r="1.8" fill={c} opacity="0.8" />
        </svg>
      )
    case 'passport':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="1" width="12" height="14" rx="1.5" stroke={c} strokeWidth="1.2" />
          <circle cx="8" cy="7" r="2.5" stroke={c} strokeWidth="1" />
          <line x1="5" y1="11.5" x2="11" y2="11.5" stroke={c} strokeWidth="1" opacity="0.5" />
        </svg>
      )
    case 'gems':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <polygon points="8,1.5 14,5.5 11.5,13.5 4.5,13.5 2,5.5" stroke={c} strokeWidth="1.2" />
          <line x1="2" y1="5.5" x2="14" y2="5.5" stroke={c} strokeWidth="0.8" opacity="0.5" />
          <line x1="8" y1="1.5" x2="4.5" y2="5.5" stroke={c} strokeWidth="0.8" opacity="0.5" />
          <line x1="8" y1="1.5" x2="11.5" y2="5.5" stroke={c} strokeWidth="0.8" opacity="0.5" />
        </svg>
      )
    case 'quiz':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.2" />
          <text x="8" y="12" textAnchor="middle" fill={c} fontSize="8" fontFamily={MONO}>?</text>
        </svg>
      )
    case 'rhino':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <ellipse cx="7" cy="10" rx="5" ry="3.5" stroke={c} strokeWidth="1.2" />
          <ellipse cx="12.5" cy="8.5" rx="2.5" ry="2" stroke={c} strokeWidth="1.2" />
          <line x1="14.5" y1="7" x2="16" y2="5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="4" y1="13.5" x2="4" y2="15" stroke={c} strokeWidth="1" strokeLinecap="round" />
          <line x1="7" y1="13.5" x2="7" y2="15" stroke={c} strokeWidth="1" strokeLinecap="round" />
          <line x1="10" y1="13.5" x2="10" y2="15" stroke={c} strokeWidth="1" strokeLinecap="round" />
          <circle cx="13.5" cy="7.5" r="0.6" fill={c} />
        </svg>
      )
    case 'settings':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="2.2" stroke={c} strokeWidth="1.2" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            return (
              <line key={i}
                x1={8 + Math.cos(rad) * 4.2} y1={8 + Math.sin(rad) * 4.2}
                x2={8 + Math.cos(rad) * 6.5} y2={8 + Math.sin(rad) * 6.5}
                stroke={c} strokeWidth="1.5" strokeLinecap="round"
              />
            )
          })}
        </svg>
      )
  }
}

export function DashboardSidebar({
  completed,
  awoken,
  activeNav,
  onNavChange,
}: DashboardSidebarProps) {
  const quizUnlocked = awoken.size >= 1

  const nav: NavEntry[] = [
    { id: 'map',      label: 'Journey Map' },
    { id: 'passport', label: 'Passport Stamps', badge: completed.size > 0 ? String(completed.size) : undefined },
    { id: 'gems',     label: 'Hidden Gems',     badge: awoken.size > 0 ? String(awoken.size) : undefined },
    { id: 'quiz',     label: 'Quiz',            badge: quizUnlocked ? undefined : 'locked' },
    { id: 'rhino',    label: 'Talk to Rhino' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div style={{
      width: 216, flexShrink: 0, height: '100%',
      background: S,
      borderRight: `1px solid rgba(145,112,67,0.23)`,
      display: 'flex', flexDirection: 'column',
      boxShadow: `inset -1px 0 0 rgba(145,112,67,0.08)`,
    }}>

      {/* Brand */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: `1px solid rgba(145,112,67,0.2)`,
        flexShrink: 0,
        background: `linear-gradient(180deg, rgba(145,112,67,0.08) 0%, transparent 100%)`,
      }}>
        {/* Gold rule above brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, rgba(145,112,67,0.65))` }} />
          <svg width="6" height="6" viewBox="0 0 6 6">
            <rect x="0" y="0" width="6" height="6" fill={A} opacity="0.8" transform="rotate(45 3 3)" />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(145,112,67,0.65))` }} />
        </div>
        <div style={{
          fontFamily: DISPLAY,
          fontSize: 24, fontWeight: 400,
          color: T, lineHeight: 1, marginBottom: 6,
          textAlign: 'center',
        }}>
          The Enchanted Line
        </div>
        <div style={{
          fontFamily: MONO, fontWeight: 500,
          fontSize: 9, color: D, textAlign: 'center',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Journey Companion
        </div>
      </div>

      {/* Nav */}
      <nav role="navigation" aria-label="Main menu" style={{ flex: 1, paddingTop: 8 }}>
        {nav.map(item => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={item.id === 'quiz' && !quizUnlocked ? 'Visit 3 stations to unlock' : undefined}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 20px',
                background: isActive ? `rgba(145,112,67,0.13)` : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${isActive ? R : 'transparent'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
                boxShadow: isActive ? `inset 0 0 20px rgba(145,112,67,0.05)` : 'none',
                opacity: item.id === 'quiz' && !quizUnlocked ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(62,35,24,0.04)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <SidebarIcon id={item.id} active={isActive} />
              <span style={{
                fontFamily: SANS,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? T : D,
                flex: 1, lineHeight: 1,
              }}>
                {item.label}
              </span>
              {item.badge === 'locked' ? (
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-label="Locked" role="img">
                  <rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke={D} strokeWidth="1.1" />
                  <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke={D} strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              ) : item.badge ? (
                <span style={{
                  fontFamily: MONO, fontWeight: 500, fontSize: 10,
                  color: isActive ? T : D,
                  background: isActive ? `rgba(145,112,67,0.16)` : 'rgba(62,35,24,0.06)',
                  borderRadius: 2, padding: '1px 5px', lineHeight: 1.6,
                }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 14px',
        borderTop: `1px solid rgba(62,35,24,0.06)`,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: MONO, fontWeight: 500, fontSize: 9,
          color: D,
          letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.7,
        }}>
          Geekulcha 2027<br />Hackathon Entry
        </div>
      </div>
    </div>
  )
}
