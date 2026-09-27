/**
 * auth.ts — passenger sign-in.
 *
 * Local-only for now: the previously configured Supabase project is
 * unreachable, so a signed-in session just lives on this device. Swap
 * signIn() for a real service once one is available.
 */

export interface Session {
  email: string
  signedInAt: number
}

const STORAGE_KEY = 'enchanted-line:session'

/** Fallback when localStorage is blocked: the session lasts until the tab closes. */
let memorySession: Session | null = null

export function getSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Session
  } catch {
    // storage blocked (private mode) or malformed
  }
  return memorySession
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export class SignInError extends Error {}

export async function signIn(email: string, password: string): Promise<Session> {
  if (!isValidEmail(email) || password.length === 0) {
    throw new SignInError('That email and password combination didn’t work. Please try again.')
  }

  const session: Session = { email: email.trim().toLowerCase(), signedInAt: Date.now() }
  memorySession = session
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // storage unavailable — memorySession covers this tab
  }
  return session
}

export function signOut() {
  memorySession = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing stored
  }
}
