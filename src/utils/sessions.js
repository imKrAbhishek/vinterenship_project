import { loadStore, saveStore, KEYS } from './storage'
import { generateId } from './auth'

export function getSessions(userId) {
  return loadStore(KEYS.sessions(userId), [])
}

export function saveSessions(userId, sessions) {
  saveStore(KEYS.sessions(userId), sessions)
}

export function addSession(userId, sessionData) {
  const existing = getSessions(userId)
  const session = { id: generateId(), userId, createdAt: Date.now(), ...sessionData }
  saveSessions(userId, [session, ...existing])
  return session
}

export function deleteSession(userId, sessionId) {
  const updated = getSessions(userId).filter((s) => s.id !== sessionId)
  saveSessions(userId, updated)
  return updated
}
