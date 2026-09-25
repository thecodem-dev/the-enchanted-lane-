import { WaxSeal } from '@/components/ui/WaxSeal'
import type { Language, Station } from '@/types'

import { V, S, A, D, MONO } from '@/styles/tokens'

interface RouteProgressProps {
  awoken: Set<string>
  completed: Set<string>
  stations: Station[]
  lang: Language
  stIdx: number
  tProg: number
  isMobile: boolean
  onStationClick: (s: Station) => void
}

export function RouteProgress({
  awoken,
  completed,
  stations,
  lang,
  stIdx,
  tProg,
  isMobile,
  onStationClick,
}: RouteProgressProps) {
  const barHeight = isMobile ? 60 : 72
  const connectorWidth = isMobile ? 20 : 40
  const px = isMobile ? 12 : 24

  return (
    <div
      style={{
        height: barHeight,
        borderTop: `1px solid rgba(201,168,76,0.18)`,
        background: `rgba(5,14,24,0.98)`,
        display: 'flex', alignItems: 'center',
        paddingLeft: px, paddingRight: px,
        flexShrink: 0, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
      }}
    >
      {stations.map((s, i) => {
        const isAwoken = awoken.has(s.id)
        const isDone = completed.has(s.id)
        const isCurrent = i === stIdx

        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div
              role="button"
              tabIndex={isAwoken ? 0 : -1}
              onClick={() => onStationClick(s)}
              onKeyDown={e => e.key === 'Enter' && onStationClick(s)}
              title={s.names[lang]}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, cursor: isAwoken ? 'pointer' : 'default',
                minWidth: isMobile ? 32 : 'auto',
                padding: isMobile ? '0 2px' : 0,
              }}
            >
              <div style={{
                position: 'relative', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone ? (
                  <WaxSeal num={s.num} size={isMobile ? 18 : 20} />
                ) : (
                  <svg width={isMobile ? 12 : 14} height={isMobile ? 12 : 14} viewBox="0 0 14 14">
                    <rect
                      x="0" y="0" width="14" height="14"
                      fill={isCurrent ? A : isAwoken ? S : V}
                      stroke={isAwoken ? A : `rgba(201,168,76,0.25)`}
                      strokeWidth="1"
                      opacity={isAwoken ? 1 : 0.4}
                      transform="rotate(45 7 7)"
                    />
                  </svg>
                )}
              </div>
              {!isMobile && (
                <span style={{
                  fontFamily: MONO, fontSize: 8, letterSpacing: '0.08em',
                  color: isAwoken ? A : D,
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  opacity: isAwoken ? 1 : 0.45,
                }}>
                  {s.names[lang].split(' ')[0]}
                </span>
              )}
            </div>

            {/* Track connector */}
            {i < stations.length - 1 && (
              <div
                style={{
                  width: connectorWidth, height: 2,
                  margin: isMobile ? '0 1px' : '0 2px',
                  marginBottom: isMobile ? 0 : 14,
                  background:
                    i < stIdx
                      ? A
                      : i === stIdx
                        ? `linear-gradient(to right, ${A} ${tProg * 100}%, rgba(201,168,76,0.12) ${tProg * 100}%)`
                        : 'rgba(201,168,76,0.12)',
                  transition: 'background 0.1s',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
