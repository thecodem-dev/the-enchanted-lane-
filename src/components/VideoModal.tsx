import { STATION_VIDEOS } from '@/data/videos'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePreferences } from '@/lib/preferences'
import { V, S, T, A, D, R, DISPLAY, TEXT_F, MONO } from '@/styles/tokens'
import type { Station } from '@/types'

export interface VideoModalProps {
  station: Station
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

/**
 * VideoModal — full-screen overlay that embeds a YouTube heritage clip
 * for the given station. Falls back gracefully when no video ID is configured.
 *
 * Navigation: prev/next stop arrows let the user step through stations
 * without closing and reopening the modal.
 */
export function VideoModal({
  station,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: VideoModalProps) {
  const vid = STATION_VIDEOS[station.id]
  const isMobile = useIsMobile()
  const { autoplayVideos } = usePreferences()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(62,35,24,0.45)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? 12 : 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 820, maxHeight: '100%', overflowY: 'auto',
          background: V, borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid rgba(145,112,67,0.33)`,
          boxShadow: `0 32px 100px rgba(62,35,24,0.28)`,
          animation: 'introFadeUp 0.22s ease-out both',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px 14px',
          borderBottom: `1px solid rgba(62,35,24,0.08)`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.18em',
              color: R, textTransform: 'uppercase', marginBottom: 5,
            }}>
              Chapter {station.num} · {station.terrain}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: isMobile ? 26 : 32, fontWeight: 400, color: T, lineHeight: 1 }}>
              {vid?.title ?? station.names.en}
            </div>
            <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 14, color: D, marginTop: 3 }}>
              {station.subtitle}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            style={{
              background: 'rgba(62,35,24,0.08)', border: '1px solid rgba(62,35,24,0.14)',
              borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
              color: D, fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Video embed */}
        <div style={{ position: 'relative', paddingBottom: '52%', background: S }}>
          {vid?.src ? (
            <video
              key={vid.src}
              src={vid.src}
              title={vid.title}
              controls
              playsInline
              preload="metadata"
              autoPlay={autoplayVideos}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: T }}
            />
          ) : vid?.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${vid.videoId}?autoplay=${autoplayVideos ? 1 : 0}&rel=0&modestbranding=1&color=white`}
              title={vid.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ opacity: 0.2 }}>
                <circle cx="24" cy="24" r="22" stroke={A} strokeWidth="1.5" fill="none" />
                <polygon points="19,16 35,24 19,32" fill={A} />
              </svg>
              <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: T }}>
                Video coming soon
              </div>
              <div style={{ fontFamily: TEXT_F, fontStyle: 'italic', fontSize: 13, color: D }}>
                Add a YouTube ID to STATION_VIDEOS['{station.id}'] in src/data/videos.ts
              </div>
            </div>
          )}
        </div>

        {/* Station info */}
        <div style={{
          padding: '14px 22px 18px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 24, alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em',
              color: R, textTransform: 'uppercase', marginBottom: 6,
            }}>
              About this stop
            </div>
            <p style={{ fontFamily: TEXT_F, fontSize: 14, color: `rgba(62,35,24,0.72)`, margin: 0, lineHeight: 1.65 }}>
              {station.heritage.slice(0, 220)}…
            </p>
          </div>
          <div style={{ width: isMobile ? 'auto' : 160, flexShrink: 0 }}>
            <div style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 8, letterSpacing: '0.14em',
              color: R, textTransform: 'uppercase', marginBottom: 6,
            }}>
              Gems nearby
            </div>
            {station.gems.slice(0, 2).map((gem, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'flex-start' }}>
                <span style={{ color: A, flexShrink: 0, fontSize: 9, marginTop: 3 }}>◆</span>
                <span style={{ fontFamily: TEXT_F, fontSize: 12, color: D, lineHeight: 1.4 }}>
                  {gem.split(' — ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Back / Next */}
        <div style={{
          padding: '0 22px 18px',
          display: 'flex', gap: 8, justifyContent: 'space-between',
        }}>
          <button
            disabled={!hasPrev}
            onClick={onPrev}
            aria-label="Previous station"
            style={{
              background: 'transparent',
              border: `1px solid rgba(166,169,154,0.56)`,
              borderRadius: 6, padding: '8px 16px', cursor: hasPrev ? 'pointer' : 'default',
              fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: D, opacity: hasPrev ? 1 : 0.35,
            }}
          >
            ← Prev stop
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid rgba(145,112,67,0.36)`,
              borderRadius: 6, padding: '8px 18px', cursor: 'pointer',
              fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: R,
            }}
          >
            Back to map
          </button>
          <button
            disabled={!hasNext}
            onClick={onNext}
            aria-label="Next station"
            style={{
              background: 'transparent',
              border: `1px solid rgba(166,169,154,0.56)`,
              borderRadius: 6, padding: '8px 16px', cursor: hasNext ? 'pointer' : 'default',
              fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: D, opacity: hasNext ? 1 : 0.35,
            }}
          >
            Next stop →
          </button>
        </div>
      </div>
    </div>
  )
}
