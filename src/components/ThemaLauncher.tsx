import { useEffect } from 'react'
import { Maximize2, X } from 'lucide-react'
import rhinoUrl from '@/assets/thema-rhino.png'
import { ThemaAvatar, ThemaChat } from '@/components/ThemaChat'
import { useIsMobile } from '@/hooks/useIsMobile'
import { setThemaWidgetOpen, useThemaChat } from '@/lib/themaChat'
import { V, S, T, MONO, SANS, DISPLAY } from '@/styles/tokens'

interface ThemaLauncherProps {
  /** Distance from the bottom of the viewport, clearing bars below */
  bottom: number
  /** Distance from the right, clearing side panels */
  right: number
  /** Jump to the full Thema page */
  onExpand: () => void
}

/**
 * ThemaLauncher — the floating "Ask Thema" button and its chat panel,
 * available on the journey's pages. Shares one conversation with the
 * Thema page.
 */
export function ThemaLauncher({ bottom, right, onExpand }: ThemaLauncherProps) {
  const isMobile = useIsMobile()
  const { widgetOpen, typing } = useThemaChat()

  // Escape closes the panel
  useEffect(() => {
    if (!widgetOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setThemaWidgetOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [widgetOpen])

  return (
    <>
      {widgetOpen && (
        <div
          role="dialog"
          aria-label="Chat with Thema"
          style={{
            position: 'fixed', zIndex: 300,
            ...(isMobile
              ? { left: 8, right: 8, bottom: bottom + 64 }
              : { right, bottom: bottom + 68, width: 380 }),
            // Never taller than the space above the launcher
            maxHeight: `calc(100dvh - ${bottom + 64 + 8}px)`,
            display: 'flex', flexDirection: 'column',
            background: S, borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(145,112,67,0.35)',
            boxShadow: '0 18px 48px rgba(62,35,24,0.25)',
            animation: 'themaPanelIn 0.2s ease-out both',
            fontFamily: SANS,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px 12px 14px', background: T, color: V, flexShrink: 0 }}>
            <ThemaAvatar size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, lineHeight: 1 }}>Thema</div>
              <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75, marginTop: 3 }}>
                {typing ? 'Typing…' : 'Your rhino guide'}
              </div>
            </div>
            <button
              onClick={() => { setThemaWidgetOpen(false); onExpand() }}
              aria-label="Open the full Thema page"
              title="Open the full Thema page"
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(250,244,224,0.12)', color: V, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Maximize2 size={14} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setThemaWidgetOpen(false)}
              aria-label="Close chat"
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(250,244,224,0.12)', color: V, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} strokeWidth={1.8} />
            </button>
          </div>
          {/* Messages take whatever height the panel has left, so it never runs off screen */}
          <ThemaChat height="fill" maxHeight={isMobile ? '46dvh' : 340} autoFocus={!isMobile} />
        </div>
      )}

      {/* The launcher */}
      <button
        onClick={() => setThemaWidgetOpen(!widgetOpen)}
        aria-label={widgetOpen ? 'Close chat with Thema' : 'Chat with Thema'}
        aria-expanded={widgetOpen}
        style={{
          position: 'fixed', zIndex: 300, right, bottom,
          height: 52, padding: isMobile ? 0 : '0 18px 0 6px', width: isMobile ? 52 : 'auto',
          borderRadius: 26, border: '1px solid rgba(145,112,67,0.5)',
          background: T, color: V, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(62,35,24,0.3)', transition: 'transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
      >
        {widgetOpen ? (
          <X size={20} strokeWidth={1.8} style={isMobile ? undefined : { marginLeft: 10 }} />
        ) : (
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: V, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={rhinoUrl} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </span>
        )}
        {!isMobile && (
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: V }}>
            {widgetOpen ? 'Close' : 'Ask Thema'}
          </span>
        )}
      </button>
    </>
  )
}

