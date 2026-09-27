import { useState, type CSSProperties, type ReactNode } from 'react'
import { LANGUAGES, STATIONS, shortStationName } from '@/data/stations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Toggle } from '@/components/ui/Toggle'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useOffline } from '@/hooks/useOffline'
import { AUTH_ENABLED, getSession } from '@/lib/auth'
import { resetPreferences, setPreference, usePreferences, type DelayThreshold, type TemperatureUnit, type TrainSpeed } from '@/lib/preferences'
import { V, S, T, A, D, R, DISPLAY, MONO, SANS } from '@/styles/tokens'
import type { Language } from '@/types'

interface SettingsPanelProps {
  lang: Language
  setLang: (l: Language) => void
  stIdx: number
  completed: Set<string>
  onResetJourney: () => void
  onSignOut: () => void
}

const APP_VERSION = '1.0.0'

const outlineButton: CSSProperties = {
  background: 'transparent', border: `1px solid ${R}`, borderRadius: 4,
  padding: '9px 18px', minHeight: 38, cursor: 'pointer',
  fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: R, transition: 'background 0.15s, color 0.15s',
}

const solidButton: CSSProperties = {
  ...outlineButton, background: R, color: V,
}

const quietButton: CSSProperties = {
  ...outlineButton, borderColor: 'rgba(62,35,24,0.25)', color: D,
}

/* ── Building blocks ─────────────────────────────────────────── */

/** A settings card: Del Rose title + description on the left, controls on the right */
function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <section style={{
      background: S, borderRadius: 6, padding: isMobile ? '18px 16px' : '22px 24px',
      display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '280px minmax(0, 1fr)',
      gap: isMobile ? 14 : 32, alignItems: 'start',
    }}>
      <div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: T, margin: '0 0 6px', lineHeight: 1.1 }}>
          {title}
        </h3>
        <p style={{ fontFamily: SANS, fontSize: 13, color: D, margin: 0, lineHeight: 1.55 }}>{description}</p>
      </div>
      <div>{children}</div>
    </section>
  )
}

/** One setting inside a section: label + hint, control on the right (wraps under on phones) */
function SettingRow({ label, hint, control, first = false }: { label: string; hint?: string; control: ReactNode; first?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px 24px',
      padding: first ? '0 0 14px' : '14px 0',
      borderTop: first ? 'none' : '1px solid rgba(145,112,67,0.2)',
    }}>
      <div style={{ flex: '1 1 220px', minWidth: 0 }}>
        <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: T }}>{label}</div>
        {hint && <div style={{ fontFamily: SANS, fontSize: 12, color: D, marginTop: 2, lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  )
}

/** Segmented choice — a small radio group */
function Segmented<Value extends string>({
  label, value, options, onChange,
}: {
  label: string
  value: Value
  options: { value: Value; label: string }[]
  onChange: (v: Value) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} style={{
      display: 'inline-flex', padding: 3, gap: 2, borderRadius: 6,
      background: 'rgba(62,35,24,0.07)', border: '1px solid rgba(145,112,67,0.25)',
    }}>
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            style={{
              border: 'none', borderRadius: 4, padding: '7px 14px', cursor: 'pointer',
              background: active ? V : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(62,35,24,0.15)' : 'none',
              fontFamily: SANS, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? T : D,
              transition: 'all 0.15s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

const TRAIN_SPEEDS: { value: TrainSpeed; label: string }[] = [
  { value: 'leisurely', label: 'Leisurely' },
  { value: 'standard',  label: 'Standard' },
  { value: 'express',   label: 'Express' },
]

const DELAY_THRESHOLDS: { value: `${DelayThreshold}`; label: string }[] = [
  { value: '5',  label: '5 min' },
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
]

/** Browser notification support and permission, as a short status line */
function notificationStatus(): { supported: boolean; permission: NotificationPermission | 'unsupported' } {
  if (!('Notification' in window)) return { supported: false, permission: 'unsupported' }
  return { supported: true, permission: Notification.permission }
}

const TEMPERATURE_UNITS: { value: TemperatureUnit; label: string }[] = [
  { value: 'c', label: '°C' },
  { value: 'f', label: '°F' },
]

/**
 * SettingsPanel — every option here changes real behaviour and is saved on
 * the device (see @/lib/preferences), except Passenger, which is the session.
 */
export function SettingsPanel({ lang, setLang, stIdx, completed, onResetJourney, onSignOut }: SettingsPanelProps) {
  const isMobile = useIsMobile()
  const { isOffline } = useOffline()
  const prefs = usePreferences()
  const session = getSession()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [confirmingDefaults, setConfirmingDefaults] = useState(false)
  const [notify, setNotify] = useState(notificationStatus)

  // Turning phone notifications on asks the browser for permission first
  const toggleSystemNotifications = async (on: boolean) => {
    if (!on) return setPreference('systemNotifications', false)
    if (!notify.supported) return
    const permission = notify.permission === 'granted' ? 'granted' : await Notification.requestPermission()
    setNotify({ supported: true, permission })
    setPreference('systemNotifications', permission === 'granted')
  }
  const current = STATIONS[stIdx]

  return (
    <div style={{ fontFamily: SANS, background: V, minHeight: '100%' }}>
      <PageHeader eyebrow="Settings" title="Your journey, your way" subtitle="Language, journey, display and account." />

      <div style={{ padding: isMobile ? '20px 16px 32px' : '28px 36px 56px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Language ── */}
        <Section title="Conductor’s language" description="The language your conductor greets you in along the line.">
          <div role="radiogroup" aria-label="Conductor’s language" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {LANGUAGES.map(l => {
              const active = l.code === lang
              return (
                <button
                  key={l.code}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setLang(l.code)}
                  style={{
                    background: active ? V : 'transparent',
                    border: `1px solid ${active ? A : 'rgba(145,112,67,0.35)'}`,
                    borderRadius: 4, padding: '10px 14px', minHeight: 44, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: SANS, fontSize: 14, fontWeight: active ? 600 : 400, color: active ? T : D,
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                      <rect x="0" y="0" width="8" height="8" fill={R} transform="rotate(45 4 4)" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── Journey ── */}
        <Section title="Journey" description="Where you are on the line, how fast the train travels, and a fresh start if you want one.">
          <div style={{ fontFamily: SANS, fontSize: 14, color: T, lineHeight: 1.6, marginBottom: 16 }}>
            Chapter {current?.num ?? 'I'} of IX · {current?.name}
            <br />
            <span style={{ color: D }}>
              {completed.size} of {STATIONS.length} passport {completed.size === 1 ? 'seal' : 'seals'} collected
            </span>
          </div>
          {/* The nine stops: stamped, current, ahead */}
          <ol aria-hidden="true" style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'flex', alignItems: 'flex-start' }}>
            {STATIONS.map((s, i) => {
              const done = completed.has(s.id)
              const here = i === stIdx
              return (
                <li key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
                  {i > 0 && (
                    <span style={{ position: 'absolute', top: 5, right: '50%', width: '100%', height: 2, background: i <= stIdx ? R : 'rgba(145,112,67,0.3)' }} />
                  )}
                  <span style={{
                    position: 'relative', width: 12, height: 12, borderRadius: '50%',
                    background: done ? R : here ? A : V,
                    border: `2px solid ${done ? R : A}`,
                  }} />
                  {/* On phones only the current stop is labelled — nine labels don't fit */}
                  {(!isMobile || here) && (
                    <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: here ? T : D, whiteSpace: 'nowrap' }}>
                      {shortStationName(s.name)}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <SettingRow
            label="Train speed"
            hint="How long the train takes between stations."
            control={<Segmented label="Train speed" value={prefs.trainSpeed} options={TRAIN_SPEEDS} onChange={v => setPreference('trainSpeed', v)} />}
          />
          <SettingRow
            label="Restart journey"
            hint="Back to Pretoria with an empty passport."
            control={confirmingReset ? (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button style={solidButton} onClick={() => { onResetJourney(); setConfirmingReset(false) }}>Yes, restart</button>
                <button style={quietButton} onClick={() => setConfirmingReset(false)}>Cancel</button>
              </div>
            ) : (
              <button style={outlineButton} onClick={() => setConfirmingReset(true)}>Restart</button>
            )}
          />
        </Section>

        {/* ── Map & weather ── */}
        <Section title="Map & weather" description="What the journey map shows, and how live weather is measured.">
          <SettingRow
            first
            label="Weather on the map"
            hint="A small temperature tag beside each station."
            control={<Toggle label="Weather on the map" checked={prefs.showMapWeather} onChange={v => setPreference('showMapWeather', v)} />}
          />
          <SettingRow
            label="Temperature"
            hint="Used on the map and in the top bar."
            control={<Segmented label="Temperature unit" value={prefs.temperatureUnit} options={TEMPERATURE_UNITS} onChange={v => setPreference('temperatureUnit', v)} />}
          />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" description="Updates about your train’s schedule and any delays along the way.">
          <SettingRow
            first
            label="Delay alerts"
            hint="Updates when the train runs late, and a ‘Running late’ banner on the map."
            control={<Toggle label="Delay alerts" checked={prefs.notifyDelays} onChange={v => setPreference('notifyDelays', v)} />}
          />
          <SettingRow
            label="Only for delays of at least"
            hint="Smaller delays stay quiet."
            control={
              <Segmented
                label="Delay threshold"
                value={`${prefs.delayThreshold}` as `${DelayThreshold}`}
                options={DELAY_THRESHOLDS}
                onChange={v => setPreference('delayThreshold', Number(v) as DelayThreshold)}
              />
            }
          />
          <SettingRow
            label="Arriving soon"
            hint="A heads-up about 15 minutes before each station."
            control={<Toggle label="Arriving soon" checked={prefs.notifyArriving} onChange={v => setPreference('notifyArriving', v)} />}
          />
          <SettingRow
            label="Phone notifications"
            hint={
              !notify.supported ? 'This browser doesn’t support notifications.'
              : notify.permission === 'denied' ? 'Notifications are blocked for this site — allow them in your browser settings.'
              : 'Show updates on your device while the app is in the background.'
            }
            control={
              <Toggle
                label="Phone notifications"
                checked={prefs.systemNotifications && notify.permission === 'granted'}
                onChange={toggleSystemNotifications}
              />
            }
          />
        </Section>

        {/* ── Experience ── */}
        <Section title="Experience" description="Motion, alerts and video along the way.">
          <SettingRow
            first
            label="Reduce motion"
            hint="Calms animations and transitions across the app."
            control={<Toggle label="Reduce motion" checked={prefs.reduceMotion} onChange={v => setPreference('reduceMotion', v)} />}
          />
          <SettingRow
            label="Chapter alerts"
            hint="A ‘Chapter unlocked’ notice when the train reaches a station."
            control={<Toggle label="Chapter alerts" checked={prefs.chapterAlerts} onChange={v => setPreference('chapterAlerts', v)} />}
          />
          <SettingRow
            label="Autoplay station videos"
            hint="Start each station’s video as soon as it opens."
            control={<Toggle label="Autoplay station videos" checked={prefs.autoplayVideos} onChange={v => setPreference('autoplayVideos', v)} />}
          />
        </Section>

        {/* ── Data & offline ── */}
        <Section title="Data & offline" description="What works without a signal, and what this device remembers.">
          <SettingRow
            first
            label="Connection"
            hint={isOffline
              ? 'Journey content still works. The map, weather and videos need a connection.'
              : 'Everything is available, including the map, live weather and videos.'}
            control={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T }}>
                <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: isOffline ? R : '#4E6B45' }} />
                {isOffline ? 'Offline' : 'Online'}
              </span>
            }
          />
          <SettingRow
            label="Saved on this device"
            hint={AUTH_ENABLED
              ? 'Your settings, journey progress, saved trip and sign-in. Resetting restores the settings above; your journey, trip and sign-in stay.'
              : 'Your settings, journey progress and saved trip. Resetting restores the settings above; your journey and trip stay.'}
            control={confirmingDefaults ? (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button style={solidButton} onClick={() => { resetPreferences(); setConfirmingDefaults(false) }}>Yes, reset</button>
                <button style={quietButton} onClick={() => setConfirmingDefaults(false)}>Cancel</button>
              </div>
            ) : (
              <button style={outlineButton} onClick={() => setConfirmingDefaults(true)}>Reset settings</button>
            )}
          />
        </Section>

        {/* ── Passenger (hidden while sign-in is switched off) ── */}
        {AUTH_ENABLED && (
          <Section title="Passenger" description="The account you boarded with.">
            <SettingRow
              first
              label="Signed in as"
              hint={session?.email ?? 'Passenger'}
              control={<button style={outlineButton} onClick={onSignOut}>Sign out</button>}
            />
          </Section>
        )}

        {/* ── About ── */}
        <Section title="About" description="The app, and the open data it runs on.">
          <SettingRow first label="Version" control={<span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', color: D }}>{APP_VERSION}</span>} />
          <SettingRow label="Map" hint="Map data © OpenStreetMap contributors · tiles by OpenFreeMap" control={null} />
          <SettingRow label="Weather" hint="Live weather by Open-Meteo" control={null} />
        </Section>
      </div>
    </div>
  )
}
