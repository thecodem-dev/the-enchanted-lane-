/**
 * App.tsx — root component.
 *
 * Manages the top-level phase (intro → journey) and language selection,
 * then delegates all journey state to the useTrainAnimation hook.
 */

import { useState } from 'react'
import { IntroScreen } from '@/components/IntroScreen'
import { JourneyView } from '@/components/JourneyView'
import { OfflineBanner } from '@/components/OfflineBanner'
import { useTrainAnimation } from '@/hooks/useTrainAnimation'
import type { Language, Phase } from '@/types'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [lang, setLang] = useState<Language>('en')

  const {
    stIdx,
    tProg,
    isMoving,
    awoken,
    completed,
    activeStation,
    newlyAwoken,
    setActiveStation,
    handleContinue,
  } = useTrainAnimation()

  return (
    <>
      {phase === 'intro' ? (
        <IntroScreen
          lang={lang}
          setLang={setLang}
          onBegin={() => setPhase('journey')}
        />
      ) : (
        <JourneyView
          lang={lang}
          stIdx={stIdx}
          tProg={tProg}
          awoken={awoken}
          completed={completed}
          activeStation={activeStation}
          newlyAwoken={newlyAwoken}
          isMoving={isMoving}
          onStationClick={s => { if (awoken.has(s.id)) setActiveStation(s) }}
          onCloseChapter={() => setActiveStation(null)}
          onContinue={handleContinue}
        />
      )}

      {/* Offline status strip — visible on top of any screen */}
      <OfflineBanner />
    </>
  )
}
