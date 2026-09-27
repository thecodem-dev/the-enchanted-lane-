/**
 * App.tsx — root component.
 *
 * Manages the top-level phase (landing → sign-in → intro → journey) and language
 * selection, then delegates all journey state to the useTrainAnimation hook.
 *
 * The phase follows the URL (see @/lib/navigation): "/" is the landing page,
 * "/sign-in" the sign-in page, "/board" the intro and journey. Boarding needs a
 * session; signed-out visitors to "/board" are redirected to "/sign-in".
 */

import { useEffect, useState } from 'react'
import { LandingPage } from '@/components/landing/LandingPage'
import { SignInPage } from '@/components/SignInPage'
import { SignUpPage } from '@/components/SignUpPage'
import { IntroScreen } from '@/components/IntroScreen'
import { JourneyView } from '@/components/JourneyView'
import { OfflineBanner } from '@/components/OfflineBanner'
import { useTrainAnimation } from '@/hooks/useTrainAnimation'
import { getSession, signOut } from '@/lib/auth'
import { setPreference, usePreferences } from '@/lib/preferences'
import { clearThemaChat } from '@/lib/themaChat'
import { hasBoarded, saveJourney } from '@/lib/journeyStore'
import { clearTrip } from '@/lib/tripStore'
import { BOARD_PATH, LANDING_PATH, SIGN_IN_PATH, navigate, redirect, routeFromPath } from '@/lib/navigation'
import type { Language, Phase } from '@/types'

/**
 * The screen for the current URL. Guards the sign-in gate in both directions:
 * signed-out → /board goes to /sign-in; signed-in → /sign-in goes to /board.
 * An in-progress journey is kept rather than restarted.
 */
function phaseForUrl(prev: Phase): Phase {
  const route = routeFromPath(window.location.pathname)
  const signedIn = getSession() !== null

  if (route === 'landing') return 'landing'
  if (route === 'board' && !signedIn) { redirect(SIGN_IN_PATH); return 'sign-in' }
  if (route === 'sign-in' && !signedIn) return 'sign-in'
  if (route === 'sign-up' && !signedIn) return 'sign-up'
  redirect(BOARD_PATH)
  // Passengers who've boarded before go straight back to their journey
  return prev === 'journey' || hasBoarded() ? 'journey' : 'intro'
}

export default function App() {
  const [phase, setPhase] = useState<Phase>(() => phaseForUrl('landing'))
  const { language: lang, reduceMotion } = usePreferences()
  const setLang = (l: Language) => setPreference('language', l)

  // Settings › Reduce motion — index.css stills animations under this attribute
  useEffect(() => {
    document.documentElement.toggleAttribute('data-reduce-motion', reduceMotion)
  }, [reduceMotion])

  // Back/forward and in-app links re-resolve the screen from the URL.
  useEffect(() => {
    const onPopState = () => setPhase(phaseForUrl)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Each screen starts at the top — the landing page is the only one that scrolls.
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [phase])

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
    resetJourney,
  } = useTrainAnimation()

  // The next passenger on this device starts from Pretoria.
  const handleSignOut = () => {
    signOut()
    resetJourney()
    clearThemaChat()
    clearTrip()
    navigate(LANDING_PATH)
  }

  return (
    <>
      {phase === 'landing' ? (
        <LandingPage />
      ) : phase === 'sign-in' ? (
        <SignInPage />
      ) : phase === 'sign-up' ? (
        <SignUpPage />
      ) : phase === 'intro' ? (
        <IntroScreen
          lang={lang}
          setLang={setLang}
          onBegin={() => { saveJourney({ boarded: true }); setPhase('journey') }}
        />
      ) : (
        <JourneyView
          lang={lang}
          setLang={setLang}
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
          onResetJourney={resetJourney}
          onSignOut={handleSignOut}
        />
      )}

      {/* Offline status strip — visible on top of any screen */}
      <OfflineBanner />
    </>
  )
}
