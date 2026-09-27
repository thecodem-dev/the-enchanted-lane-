import { Logo } from '@/components/ui/Logo'
import { V, S, T, D, R, DISPLAY, SANS, MONO } from '@/styles/tokens'

export type NavItem = 'map' | 'alerts' | 'passport' | 'gems' | 'quiz' | 'thema' | 'settings'

interface DashboardSidebarProps {
  awoken: Set<string>
  completed: Set<string>
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
  /** Unread journey updates */
  unreadAlerts: number
}

interface NavEntry {
  id: NavItem
  label: string
  /** Label for the phone's bottom bar */
  short: string
  badge?: string | undefined
}

/** The journey's pages — shared by the desktop sidebar and the mobile bottom bar */
function buildNav(completed: Set<string>, awoken: Set<string>, unreadAlerts: number): NavEntry[] {
  const quizUnlocked = awoken.size >= 1
  return [
    { id: 'map',      label: 'Journey Map',     short: 'Map' },
    { id: 'alerts',   label: 'Journey Alerts',  short: 'Alerts',   badge: unreadAlerts > 0 ? String(unreadAlerts) : undefined },
    { id: 'passport', label: 'Passport Stamps', short: 'Passport', badge: completed.size > 0 ? String(completed.size) : undefined },
    { id: 'gems',     label: 'Hidden Gems',     short: 'Gems',     badge: awoken.size > 0 ? String(awoken.size) : undefined },
    { id: 'quiz',     label: 'Quiz',            short: 'Quiz',     badge: quizUnlocked ? undefined : 'locked' },
    { id: 'thema',    label: 'Talk to Thema',   short: 'Thema' },
    { id: 'settings', label: 'Settings',        short: 'Settings' },
  ]
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
    case 'thema':
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
    case 'alerts':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.8c-2.2 0-3.8 1.7-3.8 3.9v2.6L3 10.6h10l-1.2-2.3V5.7C11.8 3.5 10.2 1.8 8 1.8z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M6.3 12.4a1.8 1.8 0 0 0 3.4 0" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
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
  unreadAlerts,
}: DashboardSidebarProps) {
  const quizUnlocked = awoken.size >= 1
  const nav = buildNav(completed, awoken, unreadAlerts)

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
        {/* Logo, flanked by the brass rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, rgba(145,112,67,0.65))` }} />
          <Logo className="h-16 w-16 ring-1 ring-brass/50" />
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(145,112,67,0.65))` }} />
        </div>
        <div style={{
          fontFamily: DISPLAY,
          fontSize: 24, fontWeight: 400,
          color: T, lineHeight: 1, marginBottom: 6,
          textAlign: 'center',
        }}>
          The Enchanted Lane
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
              title={item.id === 'quiz' && !quizUnlocked ? 'Reach your first station to unlock' : undefined}
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

/**
 * MobileNavBar — the sidebar's pages as a bottom tab bar for phones.
 */
export function MobileNavBar({
  completed, awoken, activeNav, onNavChange, unreadAlerts, slim = false,
}: DashboardSidebarProps & {
  /** Phones held sideways: icon and label side by side in a shorter bar */
  slim?: boolean
}) {
  const nav = buildNav(completed, awoken, unreadAlerts)
  return (
    <nav
      aria-label="Main menu"
      style={{
        flexShrink: 0, display: 'grid', gridTemplateColumns: `repeat(${nav.length}, 1fr)`,
        background: S, borderTop: '1px solid rgba(145,112,67,0.23)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {nav.map(item => {
        const isActive = activeNav === item.id
        const locked = item.badge === 'locked'
        return (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            style={{
              position: 'relative', minHeight: slim ? 46 : 56, padding: slim ? '0 2px' : '8px 2px 7px',
              display: 'flex', flexDirection: slim ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: slim ? 7 : 4,
              background: isActive ? 'rgba(145,112,67,0.13)' : 'transparent',
              border: 'none', borderTop: `2px solid ${isActive ? R : 'transparent'}`,
              cursor: 'pointer', opacity: locked ? 0.5 : 1,
            }}
          >
            <SidebarIcon id={item.id} active={isActive} />
            <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: isActive ? 600 : 500, color: isActive ? T : D, lineHeight: 1 }}>
              {item.short}
            </span>
            {item.badge && !locked && (
              <span style={{
                position: 'absolute', top: slim ? 4 : 5, left: slim ? 'calc(50% - 4px)' : 'calc(50% + 7px)',
                minWidth: 15, height: 15, borderRadius: 8, padding: '0 4px',
                background: R, color: V, fontFamily: MONO, fontSize: 9, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
