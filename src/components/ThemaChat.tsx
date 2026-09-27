import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowUp } from 'lucide-react'
import rhinoUrl from '@/assets/thema-rhino.png'
import { THEMA_SUGGESTIONS } from '@/lib/thema'
import { sendToThema, useThemaChat } from '@/lib/themaChat'
import { V, S, T, A, D, R, MONO, SANS } from '@/styles/tokens'

/** Thema's avatar — the team's rhino mascot on a cream disc */
export function ThemaAvatar({ size = 30 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: V, border: `1px solid rgba(145,112,67,0.5)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <img src={rhinoUrl} alt="" style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
    </span>
  )
}

/** **bold**, *italic*, and line breaks — all Thema's replies need */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    : part.startsWith('*') && part.length > 2 ? <em key={i}>{part.slice(1, -1)}</em>
    : part,
  )
}

function Formatted({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) =>
        line === '' ? <span key={i} style={{ display: 'block', height: 6 }} /> : <span key={i} style={{ display: 'block' }}>{inline(line)}</span>,
      )}
    </>
  )
}

interface ThemaChatProps {
  /**
   * Height of the message area — or 'fill' to take whatever space the parent
   * (a flex column with a max height) leaves, up to `maxHeight`
   */
  height: number | string
  maxHeight?: number | string
  /** Show the starter questions while the chat is fresh */
  showSuggestions?: boolean
  autoFocus?: boolean
}

/**
 * ThemaChat — the conversation itself. Used full-size on the Thema page and
 * compact in the floating chat panel; both share one conversation.
 */
export function ThemaChat({ height, maxHeight, showSuggestions = true, autoFocus = false }: ThemaChatProps) {
  const fill = height === 'fill'
  const { messages, typing } = useThemaChat()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, typing])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendToThema(draft)
    setDraft('')
  }

  const fresh = messages.length === 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, fontFamily: SANS, ...(fill ? { flex: 1 } : {}) }}>
      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with Thema"
        style={{
          ...(fill ? { flex: '1 1 auto', minHeight: 48, maxHeight } : { height }),
          overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {messages.map(m => m.from === 'thema' ? (
          <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: '88%' }}>
            <ThemaAvatar />
            <div style={{
              background: V, border: '1px solid rgba(145,112,67,0.25)', borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px', fontSize: 14, lineHeight: 1.55, color: T,
            }}>
              <Formatted text={m.text} />
            </div>
          </div>
        ) : (
          <div key={m.id} style={{
            alignSelf: 'flex-end', maxWidth: '80%',
            background: R, color: V, borderRadius: '12px 12px 4px 12px',
            padding: '10px 14px', fontSize: 14, lineHeight: 1.55,
          }}>
            {m.text}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }} aria-label="Thema is typing">
            <ThemaAvatar />
            <div style={{ background: V, border: '1px solid rgba(145,112,67,0.25)', borderRadius: '12px 12px 12px 4px', padding: '12px 14px', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: A, animation: `themaDot 1s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {showSuggestions && fresh && !typing && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 40 }}>
            {THEMA_SUGGESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendToThema(q)}
                style={{
                  background: 'transparent', border: `1px solid rgba(136,82,61,0.45)`, borderRadius: 16,
                  padding: '6px 12px', cursor: 'pointer', fontFamily: SANS, fontSize: 12, color: R,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, padding: 12, flexShrink: 0, borderTop: '1px solid rgba(145,112,67,0.2)', background: S }}>
        <label htmlFor="thema-input" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Message Thema
        </label>
        <input
          id="thema-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder="Ask Thema about a stop or a gem…"
          style={{
            flex: 1, minWidth: 0, background: V, border: '1px solid rgba(62,35,24,0.2)', borderRadius: 20,
            padding: '10px 16px', fontFamily: SANS, fontSize: 14, color: T, outline: 'none',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = A }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(62,35,24,0.2)' }}
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!draft.trim() || typing}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: draft.trim() && !typing ? R : 'rgba(136,82,61,0.35)', color: V,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: draft.trim() && !typing ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
        >
          <ArrowUp size={18} strokeWidth={2} />
        </button>
      </form>
      <p style={{ margin: 0, padding: '0 12px 10px', background: S, flexShrink: 0, fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: D, textAlign: 'center' }}>
        Thema never needs your personal details
      </p>
    </div>
  )
}
