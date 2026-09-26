/**
 * navigation.ts — the app's URLs, without a router.
 *
 *   /          landing page (marketing)
 *   /sign-in   passenger sign-in
 *   /board     boarding: intro screen, then the journey (signed-in only)
 *
 * Journey progress isn't persisted, so /journey would have nothing to restore;
 * both the intro and the journey live under /board.
 */

import type { MouseEvent } from 'react'

const BASE = import.meta.env.BASE_URL // always ends with '/'

export const LANDING_PATH = BASE
export const SIGN_IN_PATH = `${BASE}sign-in`
export const BOARD_PATH   = `${BASE}board`

export type Route = 'landing' | 'sign-in' | 'board'

function matches(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function routeFromPath(pathname: string): Route {
  if (matches(pathname, BOARD_PATH)) return 'board'
  if (matches(pathname, SIGN_IN_PATH)) return 'sign-in'
  return 'landing'
}

/**
 * Go to a new URL and let App's popstate listener pick up the change.
 * `replace` swaps the current history entry instead of adding one.
 */
export function navigate(path: string, { replace = false } = {}) {
  if (window.location.pathname !== path) {
    if (replace) window.history.replaceState(null, '', path)
    else window.history.pushState(null, '', path)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** Swap the current URL without adding a history entry (used for redirects). */
export function redirect(path: string) {
  if (window.location.pathname !== path) window.history.replaceState(null, '', path)
}

/**
 * onClick for in-app links. Plain clicks switch screens in place;
 * modified clicks (new tab, new window) fall through to the href.
 */
function linkTo(path: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(path)
  }
}

/** "Board the train" links — signed-out passengers are sent to sign in first. */
export const goToBoard   = linkTo(BOARD_PATH)
export const goToSignIn  = linkTo(SIGN_IN_PATH)
export const goToLanding = linkTo(LANDING_PATH)
