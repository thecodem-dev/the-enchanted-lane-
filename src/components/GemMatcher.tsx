import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Bookmark, BookmarkCheck, MessageCircle, RotateCcw, Star, Zap } from 'lucide-react'
import { CORRIDOR_GEMS, INTERESTS, PRICE_BANDS, PROFILES, type PriceBand, type TravelerProfile } from '@/data/corridorGems'
import { Toggle } from '@/components/ui/Toggle'
import { useIsMobile } from '@/hooks/useIsMobile'
import { DEFAULT_FILTERS, computeMatches, corridorSnapshot, tagLabel, type MatchFilters } from '@/lib/gemMatcher'
import { askThema } from '@/lib/themaChat'
import { V, S, T, A, D, R, DISPLAY, MONO, SANS } from '@/styles/tokens'

const SAVED_KEY = 'enchanted-line:saved-gems'

function loadSaved(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

const label: CSSProperties = {
  display: 'block', fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.15em',
  textTransform: 'uppercase', color: D, marginBottom: 7,
}

const select: CSSProperties = {
  width: '100%', appearance: 'none', background: V, border: '1px solid rgba(62,35,24,0.2)', borderRadius: 6,
  padding: '10px 36px 10px 13px', fontFamily: SANS, fontSize: 14, color: T, cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B5444' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 13px center',
}

/**
 * GemMatcher — scores the corridor's local makers (SMMEs) against a
 * traveller's budget, profile and interests, and surfaces the top three.
 * Ported from the standalone Hidden Gems Match Engine.
 */
export function GemMatcher() {
  const isMobile = useIsMobile()
  const [filters, setFilters] = useState<MatchFilters>(DEFAULT_FILTERS)
  const [saved, setSaved] = useState<string[]>(loadSaved)
  const matches = useMemo(() => computeMatches(filters), [filters])
  const snap = useMemo(corridorSnapshot, [])

  useEffect(() => {
    try { window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved)) } catch { /* storage blocked */ }
  }, [saved])

  const set = <K extends keyof MatchFilters>(key: K, value: MatchFilters[K]) => setFilters(f => ({ ...f, [key]: value }))
  const toggleInterest = (name: string) =>
    set('interests', filters.interests.includes(name) ? filters.interests.filter(i => i !== name) : [...filters.interests, name])
  const toggleSaved = (id: string) => setSaved(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))
  const savedGems = CORRIDOR_GEMS.filter(g => saved.includes(g.id))

  return (
    <div style={{ fontFamily: SANS, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Intro + corridor snapshot ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto', gap: 20, alignItems: 'end' }}>
        <div>
          <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 32, fontWeight: 400, color: T, margin: '0 0 6px', lineHeight: 1.05 }}>
            Local makers along the corridor
          </h3>
          <p style={{ fontSize: 14, color: D, margin: 0, lineHeight: 1.6, maxWidth: '60ch' }}>
            Tell the matcher your budget, travel style and interests, and it scores every one of the {snap.total} small businesses on the route for you.
          </p>
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: isMobile ? 16 : 28, margin: 0 }}>
          {[
            { v: String(snap.total), l: 'Local makers' },
            { v: `${snap.backupPowerPct}%`, l: 'Backup power' },
            { v: snap.avgIntlRating.toFixed(1), l: 'Avg rating' },
            { v: String(snap.provinces), l: 'Provinces' },
          ].map(s => (
            <div key={s.l}>
              <dd style={{ margin: 0, fontFamily: DISPLAY, fontSize: 30, color: T, lineHeight: 1 }}>{s.v}</dd>
              <dt style={{ fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: D, marginTop: 4 }}>{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Your journey profile ── */}
      <section aria-label="Your journey profile" style={{ background: S, borderRadius: 6, padding: isMobile ? '18px 16px' : '22px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          <div>
            <label htmlFor="match-budget" style={label}>Budget (ZAR per person)</label>
            <select id="match-budget" style={select} value={filters.budget} onChange={e => set('budget', e.target.value as PriceBand | '')}>
              <option value="">Any budget</option>
              {PRICE_BANDS.map(b => <option key={b} value={b}>{b.replace(' - ', ' – ')}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="match-profile" style={label}>Traveller profile</label>
            <select id="match-profile" style={select} value={filters.profile} onChange={e => set('profile', e.target.value as TravelerProfile | '')}>
              <option value="">Any traveller</option>
              {PROFILES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ ...label, marginTop: 18 }}>Your interests</div>
        <div role="group" aria-label="Your interests" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.keys(INTERESTS).map(name => {
            const active = filters.interests.includes(name)
            return (
              <button
                key={name}
                aria-pressed={active}
                onClick={() => toggleInterest(name)}
                style={{
                  borderRadius: 18, padding: '7px 14px', cursor: 'pointer', fontFamily: SANS, fontSize: 13,
                  border: `1px solid ${active ? R : 'rgba(145,112,67,0.4)'}`,
                  background: active ? R : V, color: active ? V : T, transition: 'all 0.15s',
                }}
              >
                {name}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 28px', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(145,112,67,0.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 28px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, color: T }}>
              <Toggle label="Only places with backup power" checked={filters.requireBackupPower} onChange={v => set('requireBackupPower', v)} />
              Backup power only
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, color: T }}>
              <Toggle label="Quick stopovers only" checked={filters.quickStop} onChange={v => set('quickStop', v)} />
              Quick stopover (≤ R150)
            </span>
          </div>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D }}
          >
            <RotateCcw size={12} strokeWidth={1.8} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* ── Top matches ── */}
      <section aria-label="Your top matches">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h3 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: T, margin: 0, lineHeight: 1 }}>Your top matches</h3>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: D }}>
            Scored across {CORRIDOR_GEMS.length} local makers
          </span>
        </div>

        {matches.length === 0 ? (
          <div style={{ padding: '28px 0', fontStyle: 'italic', fontSize: 15, color: D }}>
            Nothing matches this combination yet — try loosening a filter.
          </div>
        ) : (
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            {matches.map(({ gem, score }, i) => {
              const isSaved = saved.includes(gem.id)
              return (
                <li key={gem.id} style={{
                  background: S, borderRadius: 6, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 10,
                  border: `1px solid ${i === 0 ? R : 'transparent'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: i === 0 ? R : T, color: V, borderRadius: 12, padding: '4px 10px', fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Match #{i + 1} · {score}%
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: T }}>
                      <Star size={13} strokeWidth={0} fill={A} aria-hidden="true" /> {gem.intlRating.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: R }}>
                    {gem.city} · {gem.province}
                  </div>
                  <h4 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: T, margin: 0, lineHeight: 1.1 }}>{gem.name}</h4>
                  <p style={{ fontSize: 13, color: D, margin: 0, lineHeight: 1.55 }}>
                    {gem.category} · around R{gem.avgSpend} a person
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: gem.backupPower ? T : D }}>
                    <Zap size={13} strokeWidth={1.8} color={gem.backupPower ? A : D} aria-hidden="true" />
                    {gem.backupPower ? 'Backup power ready' : 'No guaranteed backup power'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {gem.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: 11, color: T, background: V, border: '1px solid rgba(145,112,67,0.3)', borderRadius: 10, padding: '3px 9px' }}>{tagLabel(t)}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: D, paddingTop: 10, borderTop: '1px solid rgba(145,112,67,0.2)', marginTop: 'auto' }}>
                    <span>{gem.reviews} reviews</span>
                    <span>{gem.priceBand.replace(' - ', ' – ')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      onClick={() => toggleSaved(gem.id)}
                      aria-pressed={isSaved}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 36,
                        borderRadius: 4, cursor: 'pointer', fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                        border: `1px solid ${R}`, background: isSaved ? R : 'transparent', color: isSaved ? V : R,
                      }}
                    >
                      {isSaved ? <BookmarkCheck size={13} strokeWidth={1.8} /> : <Bookmark size={13} strokeWidth={1.8} />}
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => askThema(`Tell me about ${gem.name}`)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 36,
                        borderRadius: 4, cursor: 'pointer', fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                        border: '1px solid rgba(62,35,24,0.25)', background: 'transparent', color: T,
                      }}
                    >
                      <MessageCircle size={13} strokeWidth={1.8} /> Ask Thema
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      {/* ── Saved ── */}
      {savedGems.length > 0 && (
        <section aria-label="Your saved gems" style={{ background: S, borderRadius: 6, padding: isMobile ? '16px' : '18px 24px' }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: D, marginBottom: 10 }}>
            Your saved gems · {savedGems.length}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {savedGems.map(g => (
              <li key={g.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: V, border: '1px solid rgba(145,112,67,0.35)', borderRadius: 16, padding: '5px 6px 5px 12px', fontSize: 13, color: T }}>
                {g.name} <span style={{ color: D, fontSize: 12 }}>· {g.city}</span>
                <button
                  onClick={() => toggleSaved(g.id)}
                  aria-label={`Remove ${g.name}`}
                  style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(62,35,24,0.08)', color: D, cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
