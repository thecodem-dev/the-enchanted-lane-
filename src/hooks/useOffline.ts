import { useState, useEffect } from 'react'

/**
 * Returns true when the browser has no network connection.
 * Also returns a `wasOffline` flag that stays true for 3 seconds
 * after coming back online so the "Back online" banner can animate out.
 */
export function useOffline(): { isOffline: boolean; wasOffline: boolean } {
  const [isOffline, setIsOffline]   = useState(!navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const goOnline = () => {
      setIsOffline(false)
      setWasOffline(true)
      timer = setTimeout(() => setWasOffline(false), 3000)
    }
    const goOffline = () => {
      setIsOffline(true)
      setWasOffline(false)
    }

    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
      clearTimeout(timer)
    }
  }, [])

  return { isOffline, wasOffline }
}
