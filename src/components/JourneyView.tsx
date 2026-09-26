import { useState } from 'react'
import { STATIONS } from '@/data/stations'
import { GoogleMapView } from '@/components/GoogleMapView'
import { ChapterPanel } from '@/components/ChapterPanel'
import { RouteProgress } from '@/components/RouteProgress'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { StationContent } from '@/components/StationContent'
import { HiddenGemsPanel } from '@/components/HiddenGemsPanel'
import { VideoModal } from '@/components/VideoModal'
import { StationWeather } from '@/components/StationWeather'
import { ChapterUnlockedBanner } from '@/components/ui/ChapterUnlockedBanner'
import { useIsMobile } from '@/hooks/useIsMobile'
import { V, S, T, A, D, R, MONO, SANS, DISPLAY } from '@/styles/tokens'
import type { Language, Station } from '@/types'
import type { NavItem } from '@/components/DashboardSidebar'

interface JourneyViewProps {
  lang: Language
  stIdx: number
  tProg: number
  awoken: Set<string>
  completed: Set<string>
  activeStation: Station | null
  newlyAwoken: string | null
  isMoving: boolean
  onStationClick: (s: Station) => void
  onCloseChapter: () => void
  onContinue: () => void
}

export function JourneyView({
  lang,
  stIdx,
  tProg,
  awoken,
  completed,
  activeStation,
  newlyAwoken,
  isMoving,
  onStationClick,
  onCloseChapter,
  onContinue,
}: JourneyViewProps) {
  const isMobile = useIsMobile()
  const isComplete = stIdx >= STATIONS.length - 1 && !isMoving
  const currentStation = STATIONS[stIdx]
  const [activeNav, setActiveNav] = useState<NavItem>('map')
  const [videoStation, setVideoStation] = useState<Station | null>(null)

  const videoIdx = videoStation ? STATIONS.findIndex(s => s.id === videoStation.id) : -1
  const hasPrev  = videoIdx > 0
  const hasNext  = videoIdx < STATIONS.length - 1

  const openVideo  = (s: Station) => setVideoStation(s)
  const closeVideo = () => setVideoStation(null)
  const prevVideo  = () => { const prev = STATIONS[videoIdx - 1]; if (hasPrev && prev) setVideoStation(prev) }
  const nextVideo  = () => { const next = STATIONS[videoIdx + 1]; if (hasNext && next) setVideoStation(next) }

  const progressPct = ((stIdx + tProg) / (STATIONS.length - 1)) * 100

  /* ── Mobile layout ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div
        style={{ background: V, fontFamily: SANS }}
        className="w-full h-screen flex flex-col overflow-hidden"
      >
        {/* Mobile top bar */}
        <div style={{
          height: 48,
          borderBottom: `1px solid rgba(145,112,67,0.23)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 16, paddingRight: 16, flexShrink: 0,
          background: `rgba(215,203,181,0.96)`, backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 20,
            fontWeight: 400, color: T, lineHeight: 1,
          }}>
            Enchanted Line
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentStation && <StationWeather station={currentStation} />}
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: D, letterSpacing: '0.1em' }}>
              {STATIONS[stIdx]?.num ?? 'I'} / IX
            </span>
            <div
              role="progressbar"
              aria-label={`Journey progress: ${Math.round(progressPct)}%`}
              style={{ width: 56, height: 3, background: `rgba(145,112,67,0.2)`, borderRadius: 2 }}
            >
              <div style={{
                width: `${progressPct}%`,
                height: '100%', background: A, borderRadius: 2, transition: 'width 0.1s linear',
              }} />
            </div>
          </div>
        </div>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <GoogleMapView
            stIdx={stIdx} tProg={tProg} awoken={awoken} completed={completed} lang={lang}
            onStationClick={onStationClick}
            onVideoClick={openVideo}
          />
          {newlyAwoken && <ChapterUnlockedBanner />}
        </div>

        <RouteProgress
          awoken={awoken} completed={completed} stations={STATIONS}
          lang={lang} stIdx={stIdx} tProg={tProg} isMobile
          onStationClick={s => { if (awoken.has(s.id)) onStationClick(s) }}
        />

        {activeStation && (
          <ChapterPanel
            station={activeStation} lang={lang} completed={completed}
            isComplete={isComplete} onClose={onCloseChapter} onContinue={onContinue}
            stIdx={stIdx} isMobile
          />
        )}

        {videoStation && (
          <VideoModal
            station={videoStation} onClose={closeVideo}
            onPrev={prevVideo} onNext={nextVideo}
            hasPrev={hasPrev} hasNext={hasNext}
          />
        )}
      </div>
    )
  }

  /* ── Desktop layout ────────────────────────────────────────── */
  return (
    <div
      style={{ background: V, fontFamily: SANS }}
      className="w-full h-screen flex flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div style={{
        height: 56, flexShrink: 0, zIndex: 10,
        borderBottom: `1px solid rgba(145,112,67,0.26)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 24, paddingRight: 24,
        background: S,
        boxShadow: `0 1px 0 rgba(145,112,67,0.1), 0 4px 20px rgba(62,35,24,0.14)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <rect x="1" y="7" width="16" height="6" rx="2" fill="none" stroke={A} strokeWidth="1.2" />
            <rect x="4" y="3" width="10" height="5" rx="1" fill="none" stroke={A} strokeWidth="1.2" />
            <circle cx="4.5" cy="14" r="1.5" fill={A} />
            <circle cx="13.5" cy="14" r="1.5" fill={A} />
            <line x1="1" y1="9.5" x2="0" y2="9.5" stroke={A} strokeWidth="1.5" />
            <rect x="7" y="5" width="2" height="3" fill={A} opacity="0.4" />
            <rect x="10" y="5" width="2" height="3" fill={A} opacity="0.4" />
          </svg>
          <span style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 400, color: T, lineHeight: 1 }}>
            The Enchanted Line
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {activeNav === 'map' && currentStation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: D, letterSpacing: '0.1em' }}>
                {currentStation.names[lang]}
              </span>
              <StationWeather station={currentStation} />
              {!isComplete && (
                <button
                  onClick={onContinue}
                  disabled={isMoving}
                  style={{
                    background: isMoving ? 'transparent' : R,
                    border: `1px solid ${isMoving ? `rgba(145,112,67,0.26)` : R}`,
                    borderRadius: 4, padding: '5px 14px',
                    cursor: isMoving ? 'default' : 'pointer',
                    fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isMoving ? D : V,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isMoving) e.currentTarget.style.background = T }}
                  onMouseLeave={e => { if (!isMoving) e.currentTarget.style.background = R }}
                >
                  {isMoving ? 'En Route…' : 'Depart →'}
                </button>
              )}
            </div>
          )}
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, color: D, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Ch. {STATIONS[stIdx]?.num ?? 'I'} / IX
          </span>
          <div
            role="progressbar"
            aria-label={`Journey progress: ${Math.round(progressPct)}%`}
            style={{ width: 72, height: 2, background: 'rgba(62,35,24,0.09)', borderRadius: 1 }}
          >
            <div style={{
              width: `${progressPct}%`,
              height: '100%', background: A, borderRadius: 1, transition: 'width 0.1s linear',
            }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Col 1 — Sidebar */}
        <DashboardSidebar
          awoken={awoken}
          completed={completed}
          activeNav={activeNav}
          onNavChange={setActiveNav}
        />

        {/* Col 2 — Centre */}
        <div style={{
          flex: 1,
          overflow: activeNav === 'map' ? 'hidden' : 'auto',
          background: V, position: 'relative',
        }}>
          {/* Chapter unlocked toast */}
          {newlyAwoken && (
            <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
              <ChapterUnlockedBanner />
            </div>
          )}

          {activeNav === 'map' ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Hint pill */}
                <div style={{
                  position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                  zIndex: 5, pointerEvents: 'none',
                  background: 'rgba(250,244,224,0.9)', backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(145,112,67,0.26)`,
                  borderRadius: 20, padding: '5px 14px',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  <svg width="8" height="9" viewBox="0 0 8 9">
                    <polygon points="0,0 8,4.5 0,9" fill={A} opacity="0.8" />
                  </svg>
                  <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', color: `rgba(62,35,24,0.65)`, textTransform: 'uppercase' }}>
                    Click any station to watch
                  </span>
                </div>

                <GoogleMapView
                  stIdx={stIdx} tProg={tProg} awoken={awoken}
                  completed={completed} lang={lang}
                  onStationClick={s => {
                    onStationClick(s)
                    openVideo(s)
                  }}
                  onVideoClick={openVideo}
                />

                {activeStation && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0,
                    width: 360, zIndex: 20,
                    boxShadow: '-8px 0 32px rgba(62,35,24,0.14)',
                  }}>
                    <ChapterPanel
                      station={activeStation} lang={lang} completed={completed}
                      isComplete={isComplete} onClose={onCloseChapter} onContinue={onContinue}
                      stIdx={stIdx} isMobile={false}
                    />
                  </div>
                )}
              </div>

              <RouteProgress
                awoken={awoken} completed={completed} stations={STATIONS}
                lang={lang} stIdx={stIdx} tProg={tProg} isMobile={false}
                onStationClick={s => { if (awoken.has(s.id)) onStationClick(s); openVideo(s) }}
              />
            </div>
          ) : activeNav === 'gems' ? (
            <div style={{ minHeight: '100%' }}>
              <HiddenGemsPanel stIdx={stIdx} lang={lang} awoken={awoken} />
            </div>
          ) : (
            currentStation && (
              <div key={stIdx} style={{ minHeight: '100%', animation: 'chapterSlideIn 0.5s ease-out both' }}>
                <StationContent
                  station={currentStation} lang={lang}
                  isMoving={isMoving} isComplete={isComplete}
                  stIdx={stIdx} completed={completed}
                  onContinue={onContinue}
                />
              </div>
            )
          )}
        </div>
      </div>

      {videoStation && (
        <VideoModal
          station={videoStation} onClose={closeVideo}
          onPrev={prevVideo} onNext={nextVideo}
          hasPrev={hasPrev} hasNext={hasNext}
        />
      )}
    </div>
  )
}
