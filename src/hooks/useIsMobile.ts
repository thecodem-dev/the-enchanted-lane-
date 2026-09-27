import { useState, useEffect } from 'react'

/** True while the media query matches. Updates reactively on resize and rotation. */
function useMedia(query: string, initial: () => boolean): boolean {
  const [matches, setMatches] = useState(initial)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

function useMaxWidth(px: number): boolean {
  return useMedia(`(max-width: ${px - 1}px)`, () => window.innerWidth < px)
}

/** Phones: below 768px — single-column page layouts */
export function useIsMobile(): boolean {
  return useMaxWidth(768)
}

/**
 * Phones and tablets: below 1024px — the journey switches to the compact
 * layout (bottom tab bar, full-width map) because a sidebar plus the chapter
 * panel leaves no room for the map.
 */
export function useIsCompact(): boolean {
  return useMaxWidth(1024)
}

/**
 * Short screens: under 500px tall — phones held sideways. The journey drops
 * the route strip and slims the tab bar so the map keeps some height.
 */
export function useIsShort(): boolean {
  return useMedia('(max-height: 499px)', () => window.innerHeight < 500)
}
