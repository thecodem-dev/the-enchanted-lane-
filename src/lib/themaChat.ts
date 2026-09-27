/**
 * themaChat.ts — one conversation with Thema, shared by the Thema page and the
 * floating chat button, so a chat started in one continues in the other.
 * Lives in memory for the session and is cleared on sign-out.
 */

import { useSyncExternalStore } from 'react'
import { THEMA_WELCOME, themaReply } from '@/lib/thema'

export interface ChatMessage {
  id: number
  from: 'thema' | 'passenger'
  text: string
}

interface ChatState {
  messages: ChatMessage[]
  /** Thema is "typing" a reply */
  typing: boolean
  /** The floating chat panel is open */
  widgetOpen: boolean
}

let nextId = 1
const welcome = (): ChatMessage => ({ id: nextId++, from: 'thema', text: THEMA_WELCOME })

let state: ChatState = { messages: [welcome()], typing: false, widgetOpen: false }
const listeners = new Set<() => void>()

function update(patch: Partial<ChatState>) {
  state = { ...state, ...patch }
  listeners.forEach(l => l())
}

/** Send a passenger message; Thema answers after a short, readable pause */
export function sendToThema(text: string) {
  const clean = text.trim()
  if (!clean || state.typing) return
  update({ messages: [...state.messages, { id: nextId++, from: 'passenger', text: clean }], typing: true })
  window.setTimeout(() => {
    update({ messages: [...state.messages, { id: nextId++, from: 'thema', text: themaReply(clean) }], typing: false })
  }, 650)
}

export function setThemaWidgetOpen(open: boolean) {
  update({ widgetOpen: open })
}

/** Open the floating chat and ask a question in one go (used by "Ask Thema" buttons) */
export function askThema(question: string) {
  update({ widgetOpen: true })
  sendToThema(question)
}

export function clearThemaChat() {
  update({ messages: [welcome()], typing: false, widgetOpen: false })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useThemaChat(): ChatState {
  return useSyncExternalStore(subscribe, () => state)
}
