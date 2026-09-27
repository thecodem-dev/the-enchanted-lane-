/**
 * auth.ts — passenger sign-in.
 *
 * Uses Supabase Auth when the public client configuration is present. The
 * local fallback is retained for demos that do not provide Supabase values.
 */

import { supabase } from './supabase'

/**
 * TEMPORARILY OFF — passengers go straight from the landing page to the
 * language picker, with no sign-in or sign-up. Set to `true` to bring back
 * the /sign-in and /sign-up pages, the landing "Sign In" links and
 * Settings › Passenger.
 */
export const AUTH_ENABLED = false

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
export class SignUpError extends Error {}

export async function signIn(email: string, password: string): Promise<Session> {
  if (!isValidEmail(email) || password.length === 0) {
    throw new SignInError('That email and password combination didn’t work. Please try again.')
  }

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error || !data.user) throw new SignInError(error?.message ?? 'Unable to sign in.')
    const session = { email: data.user.email ?? email.trim().toLowerCase(), signedInAt: Date.now() }
    persistSession(session)
    return session
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

export async function signUp(firstName: string, lastName: string, email: string, password: string): Promise<{ needsEmailConfirmation: boolean; session: Session | null }> {
  if (!isValidEmail(email) || password.length < 8 || !firstName.trim() || !lastName.trim()) {
    throw new SignUpError('Enter your name, a valid email, and a password of at least 8 characters.')
  }

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
    })
    if (error) throw new SignUpError(error.message)
    const session = data.user?.email
      ? { email: data.user.email, signedInAt: Date.now() }
      : null
    if (session) persistSession(session)
    return { needsEmailConfirmation: !data.session, session }
  }

  const session = { email: email.trim().toLowerCase(), signedInAt: Date.now() }
  persistSession(session)
  return { needsEmailConfirmation: false, session }
}

function persistSession(session: Session) {
  memorySession = session
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // memorySession covers this tab when storage is unavailable.
  }
}

export function signOut() {
  memorySession = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing stored
  }
}
