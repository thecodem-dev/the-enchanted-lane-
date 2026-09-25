import { useState, useMemo, useRef, useCallback } from 'react'
import { STATIONS } from '@/data/stations'
import {
  ATTRACTIONS,
  CATEGORY_LABELS,
  CATEGORY_COLOURS,
  type Attraction,
  type AttractionCategory,
} from '@/data/attractions'
import type { Language } from '@/types'

import { V as VOID, S as SURFACE, T as TEXT, A as ACCENT, G as SUPPORT, D as DIM, RV as REVEAL, INK, DISPLAY, TEXT_F, MONO } from '@/styles/tokens'

interface HiddenGemsPanelProps {
  stIdx: number
  lang: Language
  awoken: Set<string>
}

// ─────────────────────────────────────────────────────────────────
// Price range slider
// ─────────────────────────────────────────────────────────────────

const PRICE_MIN = 0
const PRICE_MAX = 650
const PRICE_TICKS = [0, 20, 30, 40, 50, 60, 80, 90, 120, 150, 180, 200, 232, 350, 650]

function snapToTick(raw: number): number {
  let closest = PRICE_TICKS[0]!
  let dist = Math.abs(raw - closest)
  for (const t of PRICE_TICKS) {
    const d = Math.abs(raw - t)
    if (d < dist) { dist = d; closest = t }
  }
  return closest
}

function fmtPrice(p: number) { return p === 0 ? 'Free' : `R${p}` }

function PriceRangeSlider({ min, max, onChange }: { min: number; max: number; onChange: (lo: number, hi: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'lo' | 'hi' | null>(null)
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const valFromPtr = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return snapToTick(Math.max(PRICE_MIN, Math.min(PRICE_MAX,
      ((clientX - rect.left) / rect.width) * (PRICE_MAX - PRICE_MIN) + PRICE_MIN)))
  }, [])

  const onDown = (h: 'lo' | 'hi') => (e: React.PointerEvent) => {
    dragging.current = h;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const v = valFromPtr(e.clientX)
    dragging.current === 'lo' ? onChange(Math.min(v, max), max) : onChange(min, Math.max(v, min))
  }
  const onUp = () => { dragging.current = null }

  const lo = pct(min), hi = pct(max)
  const majors = [0, 150, 350, 650]
  const presets: [string, number, number][] = [
    ['Any', 0, 650], ['Free', 0, 0], ['< R150', 0, 150], ['R150–500', 150, 500], ['R500+', 500, 650],
  ]

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      {/* Value readout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'baseline' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.14em', color: `rgba(201,168,76,0.5)`, textTransform: 'uppercase', marginBottom: 2 }}>From</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{fmtPrice(min)}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: '0.08em' }}>
          {min === PRICE_MIN && max === PRICE_MAX ? 'all prices' : max === PRICE_MAX ? `${fmtPrice(min)} and above` : `${fmtPrice(min)} – ${fmtPrice(max)}`}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.14em', color: `rgba(201,168,76,0.5)`, textTransform: 'uppercase', marginBottom: 2 }}>Up to</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: max === PRICE_MAX ? DIM : TEXT, lineHeight: 1 }}>{max === PRICE_MAX ? 'Any' : fmtPrice(max)}</div>
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        style={{ position: 'relative', height: 34, cursor: 'pointer' }}>
        <div style={{ position: 'absolute', top: 13, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', top: 13, height: 6, borderRadius: 3, left: `${lo}%`, width: `${hi - lo}%`, background: `linear-gradient(90deg, ${ACCENT}, #DDB84E)` }} />
        {PRICE_TICKS.map(t => {
          const p = pct(t); const isMaj = majors.includes(t); const inRange = t >= min && t <= max
          return <div key={t} style={{ position: 'absolute', left: `${p}%`, top: isMaj ? 10 : 12, width: isMaj ? 2 : 1, height: isMaj ? 12 : 8, transform: 'translateX(-50%)', background: inRange ? (isMaj ? `rgba(201,168,76,0.6)` : `rgba(201,168,76,0.25)`) : (isMaj ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'), borderRadius: 1, pointerEvents: 'none' }} />
        })}
        {/* Low handle */}
        <div onPointerDown={onDown('lo')} style={{ position: 'absolute', top: 7, left: `${lo}%`, transform: 'translateX(-50%)', width: 18, height: 18, background: `linear-gradient(135deg, ${ACCENT}, #DDB84E)`, borderRadius: '50%', cursor: 'grab', boxShadow: `0 2px 8px rgba(201,168,76,0.45)`, zIndex: min > max - 40 ? 3 : 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: INK, opacity: 0.6 }} />
        </div>
        {/* High handle */}
        <div onPointerDown={onDown('hi')} style={{ position: 'absolute', top: 7, left: `${hi}%`, transform: 'translateX(-50%)', width: 18, height: 18, background: `linear-gradient(135deg, ${ACCENT}, #DDB84E)`, borderRadius: '50%', cursor: 'grab', boxShadow: `0 2px 8px rgba(201,168,76,0.45)`, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: INK, opacity: 0.6 }} />
        </div>
      </div>

      {/* Axis */}
      <div style={{ position: 'relative', height: 16, marginTop: 2 }}>
        {majors.map(t => <span key={t} style={{ position: 'absolute', left: `${pct(t)}%`, transform: t === 0 ? 'none' : t === PRICE_MAX ? 'translateX(-100%)' : 'translateX(-50%)', fontFamily: MONO, fontSize: 8, color: DIM, whiteSpace: 'nowrap' }}>{t === 0 ? 'Free' : `R${t}`}</span>)}
      </div>

      {/* Quick presets */}
      <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
        {presets.map(([label, lo, hi]) => {
          const active = min === lo && max === hi
          return (
            <button key={label} onClick={() => onChange(lo, hi)} style={{ background: active ? `rgba(201,168,76,0.12)` : 'transparent', border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.08)'}`, borderRadius: 4, padding: '3px 9px', cursor: 'pointer', fontFamily: TEXT_F, fontSize: 13, color: active ? TEXT : DIM, transition: 'all 0.1s' }}>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Booking modal
// ─────────────────────────────────────────────────────────────────

interface BookingForm { name: string; email: string; date: string; guests: string; notes: string }
const EMPTY: BookingForm = { name: '', email: '', date: '', guests: '1', notes: '' }

function BookingModal({ attraction, isUpcoming, onClose }: { attraction: Attraction; isUpcoming: boolean; onClose: () => void }) {
  const [form, setForm] = useState<BookingForm>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const field = (k: keyof BookingForm) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value })),
  })

  const guests = parseInt(form.guests) || 1
  const total = attraction.priceZAR === 0 ? 0 : attraction.priceZAR * guests

  const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 6, padding: '10px 13px', color: TEXT, fontFamily: TEXT_F, fontSize: 15, outline: 'none' }
  const lbl: React.CSSProperties = { fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', color: `rgba(201,168,76,0.55)`, textTransform: 'uppercase', display: 'block', marginBottom: 5 }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(2,6,14,0.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, height: '100%', background: SURFACE, borderLeft: `1px solid rgba(201,168,76,0.18)`, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.28s cubic-bezier(0.22,0.61,0.36,1) both', overflow: 'hidden' }}>

        {submitted ? (
          /* ── Success ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 36px', textAlign: 'center', gap: 18 }}>
            {/* Wax-seal checkmark */}
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="none" stroke={ACCENT} strokeWidth="1.5" />
              <path d="M20 32 L28 40 L44 24" stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, color: TEXT, lineHeight: 1.15 }}>It's yours.</div>
            <div style={{ fontFamily: TEXT_F, fontSize: 16, color: DIM, lineHeight: 1.7, maxWidth: 300 }}>
              Your enquiry for <em style={{ color: TEXT }}>{attraction.name}</em> is on its way to the venue.
              Expect a reply at <span style={{ color: TEXT }}>{form.email}</span> within 24 hours.
            </div>
            {attraction.bookingInfo.url && (
              <a href={attraction.bookingInfo.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', color: ACCENT, textDecoration: 'none', borderBottom: `1px solid rgba(201,168,76,0.35)`, paddingBottom: 2 }}>
                Official website ↗
              </a>
            )}
            <button onClick={onClose} style={{ marginTop: 8, width: '100%', padding: '13px', borderRadius: 6, background: ACCENT, border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK, fontWeight: 500 }}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div style={{ padding: '22px 28px 16px', borderBottom: `1px solid rgba(255,255,255,0.06)`, flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: `rgba(201,168,76,0.5)`, textTransform: 'uppercase', marginBottom: 5 }}>
                  {isUpcoming ? 'Advance claim' : "You're claiming"}
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{attraction.name}</div>
                <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 14, color: DIM, marginTop: 3 }}>{attraction.tagline}</div>
              </div>
              <button onClick={onClose} aria-label="Close" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: DIM, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>

            {/* ── Upcoming notice ── */}
            {isUpcoming && (
              <div style={{ margin: '14px 28px 0', padding: '11px 14px', borderRadius: 8, background: `rgba(74,124,106,0.08)`, border: `1px solid rgba(74,124,106,0.22)`, display: 'flex', gap: 10, alignItems: 'flex-start', flexShrink: 0 }}>
                <span style={{ fontFamily: TEXT_F, fontSize: 14, color: SUPPORT, lineHeight: 1.55 }}>
                  The train hasn't reached this stop yet. Book ahead and the venue will hold your spot.
                </span>
              </div>
            )}

            {/* ── Summary tiles ── */}
            <div style={{ display: 'flex', margin: '14px 28px 0', gap: 8, flexShrink: 0 }}>
              {[
                { label: 'Entry', value: attraction.priceZAR === 0 ? 'Free' : `R${attraction.priceZAR} p.p.` },
                { label: 'Duration', value: attraction.duration },
                { label: 'Hours', value: attraction.openingHours.split(';')[0]?.split(',')[0] ?? '' },
              ].map(it => (
                <div key={it.label} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: `rgba(201,168,76,0.45)`, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>{it.label}</div>
                  <div style={{ fontFamily: TEXT_F, fontSize: 14, color: TEXT, fontWeight: 600 }}>{it.value}</div>
                </div>
              ))}
            </div>

            {/* ── Form ── */}
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} style={{ flex: 1, overflowY: 'auto', padding: '18px 28px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={lbl}>Full name</label><input required style={inp} placeholder="Your name" {...field('name')} onFocus={e => { e.currentTarget.style.borderColor = `rgba(201,168,76,0.45)` }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }} /></div>
                <div><label style={lbl}>Email</label><input required type="email" style={inp} placeholder="you@email.com" {...field('email')} onFocus={e => { e.currentTarget.style.borderColor = `rgba(201,168,76,0.45)` }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={lbl}>Visit date</label><input required type="date" style={inp} {...field('date')} onFocus={e => { e.currentTarget.style.borderColor = `rgba(201,168,76,0.45)` }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }} /></div>
                <div><label style={lbl}>Guests</label>
                  <select required style={{ ...inp, cursor: 'pointer' }} {...field('guests')}>
                    {['1','2','3','4','5','6','7','8','9','10'].map(n => <option key={n} value={n} style={{ background: SURFACE }}>{n} guest{n !== '1' ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Notes <span style={{ fontFamily: TEXT_F, fontSize: 13, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, color: DIM }}>optional</span></label>
                <textarea rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Accessibility needs, group type, guide request…" {...field('notes')} onFocus={e => { e.currentTarget.style.borderColor = `rgba(201,168,76,0.45)` }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }} />
              </div>

              {/* Price breakdown */}
              {attraction.priceZAR > 0 && (
                <div style={{ padding: '12px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: TEXT_F, fontSize: 14, color: DIM }}>R{attraction.priceZAR} × {guests} guest{guests !== 1 ? 's' : ''}</span>
                    <span style={{ fontFamily: TEXT_F, fontSize: 14, color: TEXT, fontWeight: 600 }}>R{total}</span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 6 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total estimate</span>
                    <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: TEXT }}>R{total}</span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ paddingBottom: 28 }}>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', borderRadius: 6, background: ACCENT, border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK, fontWeight: 500, boxShadow: `0 4px 18px rgba(201,168,76,0.28)` }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#DDB84E'; e.currentTarget.style.color = VOID }}
                  onMouseLeave={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = INK }}
                >
                  {isUpcoming ? 'Lock in advance' : 'Lock it in'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 9, fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 13, color: `rgba(42,74,106,0.7)` }}>
                  No payment taken now · Free to cancel
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Gem entry — the journal row
// ─────────────────────────────────────────────────────────────────

function categoryIcon(cat: AttractionCategory): string {
  const map: Record<AttractionCategory, string> = {
    history: '⌛', museum: '🏛', nature: '◈', heritage: '◉',
    arts: '◐', science: '◎', township: '◍', architecture: '◆',
  }
  return map[cat] ?? '◆'
}

function GemEntry({
  attraction, index, isUpcoming, onClaim,
}: {
  attraction: Attraction
  index: number
  isUpcoming: boolean
  onClaim: (a: Attraction) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const catColour = CATEGORY_COLOURS[attraction.category]

  const isFree   = attraction.priceZAR === 0
  const hasUrl   = !!attraction.bookingInfo.url
  const canBook  = attraction.bookingInfo.available

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 0,
        background: hovered ? REVEAL : SURFACE,
        borderRadius: 6,
        overflow: 'hidden',
        transition: 'background 0.22s ease',
        animation: `gemDrop 0.28s ease-out ${index * 60}ms both`,
      }}
    >
      {/* ── Left art panel (120px) ── */}
      <div style={{
        width: 120, flexShrink: 0, position: 'relative',
        background: `linear-gradient(160deg, ${VOID} 0%, #0d1f10 100%)`,
        overflow: 'hidden',
      }}>
        {/* Category accent strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: catColour, opacity: 0.65 }} />
        {/* Grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id={`g-${attraction.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0L0 0 0 16" fill="none" stroke={catColour} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="120" height="140" fill={`url(#g-${attraction.id})`} />
        </svg>
        {/* Central symbol */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 22, opacity: 0.3 }}>{categoryIcon(attraction.category)}</span>
          <span style={{ fontFamily: MONO, fontSize: 7, letterSpacing: '0.18em', color: catColour, textTransform: 'uppercase', opacity: 0.45 }}>
            {CATEGORY_LABELS[attraction.category]}
          </span>
        </div>
        {/* Free badge */}
        {isFree && (
          <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: SUPPORT, background: `rgba(74,124,106,0.12)`, border: `1px solid rgba(74,124,106,0.28)`, borderRadius: 3, padding: '2px 7px' }}>Free</span>
          </div>
        )}
        {/* Upcoming ribbon */}
        {isUpcoming && (
          <div style={{ position: 'absolute', top: 8, right: -22, background: SUPPORT, color: VOID, fontFamily: MONO, fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 28px', transform: 'rotate(45deg)', transformOrigin: 'center' }}>
            Ahead
          </div>
        )}
      </div>

      {/* ── Right: journal text ── */}
      <div style={{ flex: 1, padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Name + price */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <h3 style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.2, flex: 1 }}>
            {attraction.name}
          </h3>
          {!isFree && (
            <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: TEXT, flexShrink: 0, lineHeight: 1 }}>
              R{attraction.priceZAR}
            </span>
          )}
        </div>

        {/* Tagline */}
        <p style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 15, color: DIM, margin: '0 0 8px', lineHeight: 1.45 }}>
          {attraction.tagline}
        </p>

        {/* Description — 2 lines, expandable */}
        <p style={{
          fontFamily: TEXT_F, fontSize: 14, lineHeight: 1.68, color: `rgba(230,217,184,0.72)`,
          margin: '0 0 10px',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
        } as React.CSSProperties}>
          {attraction.description}
        </p>

        {/* Expanded: highlights + practical info */}
        {expanded && (
          <div style={{ marginBottom: 12, display: 'flex', gap: 20 }}>
            {/* Highlights */}
            <div style={{ flex: 1 }}>
              {attraction.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1, fontSize: 10 }}>◆</span>
                  <span style={{ fontFamily: TEXT_F, fontSize: 13, color: DIM, lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
            {/* Practical */}
            <div style={{ width: 160, flexShrink: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.15em', color: `rgba(201,168,76,0.45)`, textTransform: 'uppercase', marginBottom: 6 }}>Practical</div>
              <div style={{ fontFamily: TEXT_F, fontSize: 13, color: DIM, lineHeight: 1.8 }}>
                🕐 {attraction.openingHours}<br />
                📞 {attraction.bookingInfo.contact}
              </div>
              {attraction.bookingInfo.url && (
                <a href={attraction.bookingInfo.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 6, fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: ACCENT, textDecoration: 'none', borderBottom: `1px solid rgba(201,168,76,0.3)`, paddingBottom: 1 }}>
                  Official site ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* Metadata row + action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.06em' }}>
              {isFree ? <span style={{ color: SUPPORT }}>Free entry</span> : `R${attraction.priceZAR} p.p.`}
            </span>
            <span style={{ color: `rgba(42,74,106,0.4)`, fontSize: 10 }}>·</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.06em' }}>{attraction.duration}</span>
            <span style={{ color: `rgba(42,74,106,0.4)`, fontSize: 10 }}>·</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.06em' }}>
              ◎ {attraction.address.split(',').slice(-2).join(',').trim()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
            {/* Toggle details */}
            <button
              onClick={() => setExpanded(x => !x)}
              style={{ background: 'transparent', border: 'none', padding: '5px 8px', cursor: 'pointer', fontFamily: TEXT_F, fontSize: 13, color: DIM, transition: 'color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = TEXT }}
              onMouseLeave={e => { e.currentTarget.style.color = DIM }}
            >
              {expanded ? 'Less' : 'More'}
            </button>

            {/* Primary CTA */}
            {canBook ? (
              <button
                onClick={() => onClaim(attraction)}
                style={{ background: ACCENT, border: 'none', borderRadius: 4, padding: '7px 16px', cursor: 'pointer', fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#DDB84E'; e.currentTarget.style.color = VOID }}
                onMouseLeave={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = INK }}
              >
                {isUpcoming ? 'Book ahead' : 'Claim this spot'}
              </button>
            ) : hasUrl ? (
              <a
                href={attraction.bookingInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'transparent', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: 4, padding: '6px 15px', fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}
              >
                Book directly ↗
              </a>
            ) : (
              <a
                href={`tel:${attraction.bookingInfo.contact}`}
                style={{ background: 'transparent', border: `1px solid rgba(42,74,106,0.35)`, borderRadius: 4, padding: '6px 15px', fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: DIM, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}
              >
                Plan your visit
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Station section — collapsible chapter marker
// ─────────────────────────────────────────────────────────────────

function StationSection({
  stationId, lang, awoken, entries, priceRange, categoryFilter, searchQuery, onClaim,
}: {
  stationId: string
  lang: Language
  awoken: Set<string>
  entries: Attraction[]
  priceRange: [number, number]
  categoryFilter: string
  searchQuery: string
  onClaim: (a: Attraction) => void
}) {
  const station = STATIONS.find(s => s.id === stationId)
  if (!station) return null

  const isVisited = awoken.has(stationId)
  const isUpcoming = !isVisited

  const [open, setOpen] = useState(true)

  const filtered = useMemo(() => {
    const [lo, hi] = priceRange
    return entries.filter(a => {
      if (a.priceZAR < lo) return false
      if (hi < PRICE_MAX && a.priceZAR > hi) return false
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!a.name.toLowerCase().includes(q) && !a.tagline.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [entries, priceRange, categoryFilter, searchQuery])

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Chapter marker / section header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          cursor: 'pointer', padding: 0, marginBottom: open ? 12 : 0,
          display: 'flex', alignItems: 'center', gap: 14,
          textAlign: 'left',
        }}
      >
        {/* Roman numeral */}
        <span style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: isVisited ? TEXT : `rgba(230,217,184,0.3)`, lineHeight: 1, flexShrink: 0, minWidth: 36 }}>
          {station.num}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: isVisited ? TEXT : `rgba(230,217,184,0.4)`, letterSpacing: '-0.01em' }}>
              {station.names[lang]}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: DIM, textTransform: 'uppercase' }}>
              {station.terrain}
            </span>
            {isUpcoming && (
              <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.12em', color: SUPPORT, textTransform: 'uppercase', background: `rgba(74,124,106,0.1)`, border: `1px solid rgba(74,124,106,0.25)`, borderRadius: 3, padding: '1px 6px' }}>
                upcoming
              </span>
            )}
          </div>
        </div>
        {/* Count + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: '0.08em' }}>
            {filtered.length}/{entries.length}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.4 }}>
            <polyline points="2,4 7,10 12,4" stroke={TEXT} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Rule */}
      <div style={{ height: 1, background: `rgba(42,74,106,0.25)`, marginBottom: open ? 12 : 0 }} />

      {/* Entries */}
      {open && (
        filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((a, i) => (
              <GemEntry key={a.id} attraction={a} index={i} isUpcoming={isUpcoming} onClaim={onClaim} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: '28px 0', fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 15, color: `rgba(42,74,106,0.5)` }}>
            This station hasn't revealed its secrets yet.
          </div>
        ) : (
          <div style={{ padding: '28px 0', fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 15, color: `rgba(42,74,106,0.5)` }}>
            Nothing here matches — try different filters.
          </div>
        )
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Filter drawer
// ─────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = [
  'all', 'history', 'museum', 'nature', 'heritage', 'arts', 'science', 'township', 'architecture',
] as const
type CatFilter = typeof ALL_CATEGORIES[number]

function FilterDrawer({
  priceRange, onPriceChange, categoryFilter, onCategoryChange,
  onClose,
}: {
  priceRange: [number, number]
  onPriceChange: (lo: number, hi: number) => void
  categoryFilter: CatFilter
  onCategoryChange: (c: CatFilter) => void
  onClose: () => void
}) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,6,14,0.6)' }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, width: 340, height: '100%', background: SURFACE, borderLeft: `1px solid rgba(255,255,255,0.05)`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto', animation: 'slideInRight 0.22s ease-out both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: TEXT }}>Filters</span>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: DIM, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Price slider */}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: `rgba(201,168,76,0.5)`, textTransform: 'uppercase', marginBottom: 16 }}>Entry price</div>
          <PriceRangeSlider min={priceRange[0]} max={priceRange[1]} onChange={onPriceChange} />
        </div>

        {/* Category */}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: `rgba(201,168,76,0.5)`, textTransform: 'uppercase', marginBottom: 12 }}>Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ALL_CATEGORIES.map(c => (
              <button key={c} onClick={() => onCategoryChange(c)} style={{ background: categoryFilter === c ? `rgba(201,168,76,0.1)` : 'transparent', border: `1px solid ${categoryFilter === c ? `rgba(201,168,76,0.35)` : 'transparent'}`, borderRadius: 5, padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontFamily: TEXT_F, fontSize: 15, color: categoryFilter === c ? TEXT : DIM, transition: 'all 0.1s' }}>
                {c === 'all' ? 'All categories' : CATEGORY_LABELS[c as AttractionCategory]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { onPriceChange(PRICE_MIN, PRICE_MAX); onCategoryChange('all'); onClose() }}
          style={{ background: 'transparent', border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 5, padding: '10px', cursor: 'pointer', fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginTop: 'auto' }}
        >
          Clear all filters
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────────

export function HiddenGemsPanel({ lang, awoken }: HiddenGemsPanelProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])
  const [categoryFilter, setCategoryFilter] = useState<CatFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [bookingTarget, setBookingTarget] = useState<Attraction | null>(null)

  // Group attractions by station, preserving journey order
  const byStation = useMemo(() => {
    const map = new Map<string, Attraction[]>()
    for (const s of STATIONS) map.set(s.id, [])
    for (const a of ATTRACTIONS) map.get(a.stationId)?.push(a)
    return map
  }, [])

  const totalUnlocked = useMemo(() => ATTRACTIONS.filter(a => awoken.has(a.stationId)).length, [awoken])
  const filtersActive = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX || categoryFilter !== 'all' || searchQuery.trim() !== ''

  const isUpcoming = bookingTarget ? !awoken.has(bookingTarget.stationId) : false

  return (
    <div style={{ fontFamily: TEXT_F, background: VOID, minHeight: '100%' }}>

      {/* ══ Page header ══ */}
      <div style={{ padding: '28px 36px 22px', borderBottom: `1px solid rgba(42,74,106,0.2)` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 18 }}>
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <svg width="9" height="9" viewBox="0 0 9 9" style={{ animation: 'shimmerGem 2.5s ease-in-out infinite' }}>
                <rect x="0" y="0" width="9" height="9" fill={ACCENT} transform="rotate(45 4.5 4.5)" />
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.22em', color: `rgba(201,168,76,0.55)`, textTransform: 'uppercase' }}>
                Hidden Gems
              </span>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: TEXT, margin: '0 0 5px', lineHeight: 1.1 }}>
              What most passengers miss
            </h2>
            <p style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 16, color: DIM, margin: 0, lineHeight: 1.5 }}>
              Lesser-known places worth stepping off the train for.
            </p>
          </div>
          {totalUnlocked > 0 && (
            <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 4 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{totalUnlocked}</div>
              <div style={{ fontFamily: MONO, fontSize: 8, color: `rgba(201,168,76,0.45)`, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3, lineHeight: 1.5 }}>spots<br />unlocked</div>
            </div>
          )}
        </div>

        {/* Search + filter row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.3 }}>
              <circle cx="5.5" cy="5.5" r="4" stroke={TEXT} strokeWidth="1.3" />
              <line x1="9" y1="9" x2="13" y2="13" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search places, themes, history…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: SURFACE, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 6, padding: '10px 36px', color: TEXT, fontFamily: TEXT_F, fontSize: 15, outline: 'none' }}
              onFocus={e => { e.currentTarget.style.borderColor = `rgba(201,168,76,0.4)` }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: DIM, fontSize: 18, cursor: 'pointer', padding: '2px 6px', lineHeight: 1 }}>×</button>
            )}
          </div>
          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            style={{ background: filtersActive ? `rgba(201,168,76,0.12)` : SURFACE, border: `1px solid ${filtersActive ? `rgba(201,168,76,0.4)` : 'rgba(255,255,255,0.07)'}`, borderRadius: 6, padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: TEXT_F, fontSize: 14, color: filtersActive ? TEXT : DIM, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <line x1="0" y1="1.5" x2="13" y2="1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="2" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4" y1="8.5" x2="9" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Filter{filtersActive ? ' ·' : ''}
            {filtersActive && <span style={{ color: ACCENT, fontFamily: MONO, fontSize: 9 }}>ON</span>}
          </button>
        </div>
      </div>

      {/* ══ Journal body ══ */}
      <div style={{ padding: '28px 36px 56px' }}>
        {STATIONS.map(s => {
          const entries = byStation.get(s.id) ?? []
          if (entries.length === 0) return null
          return (
            <StationSection
              key={s.id}
              stationId={s.id}
              lang={lang}
              awoken={awoken}
              entries={entries}
              priceRange={priceRange}
              categoryFilter={categoryFilter}
              searchQuery={searchQuery}
              onClaim={setBookingTarget}
            />
          )
        })}

        {/* Price legend */}
        <div style={{ marginTop: 16, paddingTop: 20, borderTop: `1px solid rgba(42,74,106,0.18)`, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.16em', color: `rgba(42,74,106,0.5)`, textTransform: 'uppercase' }}>Price guide</span>
          {(['Free entry', 'Under R150', 'R150–500', 'R500+'] as const).map(l => (
            <span key={l} style={{ fontFamily: TEXT_F, fontSize: 13, color: `rgba(42,74,106,0.6)` }}>
              <span style={{ color: `rgba(201,168,76,0.4)`, marginRight: 5 }}>·</span>{l}
            </span>
          ))}
          <span style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 12, color: `rgba(42,74,106,0.4)`, marginLeft: 'auto' }}>
            Approximate adult entry fees in ZAR
          </span>
        </div>
      </div>

      {/* Modals */}
      {filterOpen && (
        <FilterDrawer
          priceRange={priceRange}
          onPriceChange={(lo, hi) => setPriceRange([lo, hi])}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {bookingTarget && (
        <BookingModal
          attraction={bookingTarget}
          isUpcoming={isUpcoming}
          onClose={() => setBookingTarget(null)}
        />
      )}
    </div>
  )
}
