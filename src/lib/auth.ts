/**
 * auth.ts — passenger sign-in.
 *
 * ⚠ PLACEHOLDER. There is no backend yet: signIn() accepts any well-formed
 * email with a non-empty password and keeps the session in localStorage.
 * It is NOT access control — anyone can get past it. Replace signIn() (and
 * signOut(), if the real service needs it) with the real identity provider;
 * the rest of the app only depends on the Session shape and these functions.
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
  // TODO: replace with a call to the real sign-in service.
  await new Promise(resolve => setTimeout(resolve, 600))

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
