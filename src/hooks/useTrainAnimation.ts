import { useState, useEffect, useRef, useCallback } from 'react'
import { STATIONS } from '@/data/stations'
import { usePreferences, type TrainSpeed } from '@/lib/preferences'
import type { Station } from '@/types'

/** Progress per frame for each Settings › Train speed option (at 60 fps) */
const SPEEDS: Record<TrainSpeed, number> = {
  leisurely: 1 / 720, // ~12 s per segment
  standard:  1 / 420, // ~7 s
  express:   1 / 180, // ~3 s
}

interface UseTrainAnimationReturn {
  stIdx: number
  tProg: number
  isMoving: boolean
  awoken: Set<string>
  completed: Set<string>
  activeStation: Station | null
  newlyAwoken: string | null
  setActiveStation: (s: Station | null) => void
  handleContinue: () => void
  /** Back to Pretoria with no stamps — used by Settings and on sign-out */
  resetJourney: () => void
}

/**
 * Manages the train animation loop and all related journey state.
 *
 * Uses requestAnimationFrame to advance tProg each frame.
 * When tProg reaches 1, the train has arrived at the next station:
 *  - stIdx increments
 *  - the new station is added to `awoken`
 *  - `newlyAwoken` triggers a 1.5 s "Chapter Unlocked" banner
 */
export function useTrainAnimation(): UseTrainAnimationReturn {
  const [stIdx, setStIdx] = useState(0)
  const [tProg, setTProg] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [awoken, setAwoken] = useState<Set<string>>(new Set(['pretoria']))
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeStation, setActiveStation] = useState<Station | null>(STATIONS[0] ?? null)
  const [newlyAwoken, setNewlyAwoken] = useState<string | null>(null)

  // Refs allow the rAF callback to read current state without stale closures
  const stIdxRef = useRef(stIdx)
  const progressRef = useRef(tProg)
  const movingRef = useRef(isMoving)

  useEffect(() => { stIdxRef.current = stIdx }, [stIdx])
  useEffect(() => { progressRef.current = tProg }, [tProg])
  useEffect(() => { movingRef.current = isMoving }, [isMoving])

  // Read inside the rAF loop, so a speed change applies mid-segment
  const { trainSpeed } = usePreferences()
  const speedRef = useRef(SPEEDS[trainSpeed])
  useEffect(() => { speedRef.current = SPEEDS[trainSpeed] }, [trainSpeed])

  useEffect(() => {
    if (!isMoving) return

    let raf: number

    const tick = () => {
      if (!movingRef.current) return

      const next = progressRef.current + speedRef.current

      if (next >= 1) {
        movingRef.current = false
        progressRef.current = 0
        setTProg(0)
        setIsMoving(false)

        const nextIdx = stIdxRef.current + 1
        if (nextIdx < STATIONS.length) {
          const nextStation = STATIONS[nextIdx]
          const currentStation = STATIONS[stIdxRef.current]
          if (nextStation && currentStation) {
            setStIdx(nextIdx)
            setCompleted(c => new Set([...c, currentStation.id]))
            setAwoken(a => new Set([...a, nextStation.id]))
            setActiveStation(nextStation)
            setNewlyAwoken(nextStation.id)
            setTimeout(() => setNewlyAwoken(null), 1500)
          }
        }
        return
      }

      progressRef.current = next
      setTProg(next)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isMoving])

  const handleContinue = useCallback(() => {
    if (isMoving || stIdx >= STATIONS.length - 1) return
    setActiveStation(null)
    setIsMoving(true)
  }, [isMoving, stIdx])

  const resetJourney = useCallback(() => {
    movingRef.current = false
    progressRef.current = 0
    stIdxRef.current = 0
    setIsMoving(false)
    setTProg(0)
    setStIdx(0)
    setAwoken(new Set(['pretoria']))
    setCompleted(new Set())
    setActiveStation(STATIONS[0] ?? null)
    setNewlyAwoken(null)
  }, [])

  return {
    stIdx,
    tProg,
    isMoving,
    awoken,
    completed,
    activeStation,
    newlyAwoken,
    setActiveStation,
    handleContinue,
    resetJourney,
  }
}
