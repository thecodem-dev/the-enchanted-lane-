import { useState, useEffect } from 'react'

/** True while the viewport is narrower than `px`. Updates reactively on resize. */
function useMaxWidth(px: number): boolean {
  const [matches, setMatches] = useState(() => window.innerWidth < px)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [px])

  return matches
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
