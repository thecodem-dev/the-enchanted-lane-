import { V, R } from '@/styles/tokens'

/** Accessible on/off switch — rust when on */
export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative', width: 44, height: 24, borderRadius: 12, padding: 0, cursor: 'pointer', flexShrink: 0,
        background: checked ? R : 'rgba(62,35,24,0.18)', border: 'none', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%',
        background: V, boxShadow: '0 1px 3px rgba(62,35,24,0.3)', transition: 'left 0.2s',
      }} />
    </button>
  )
}
