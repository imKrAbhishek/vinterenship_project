/**
 * Safe localStorage wrapper — returns `defaultValue` on any error.
 */
export function loadStore(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Persist a value to localStorage as JSON.
 */
export function saveStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('[vi-notes] localStorage write failed:', err)
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeStore(key) {
  try {
    localStorage.removeItem(key)
  } catch { /* ignore */ }
}

// ── Key namespacing ─────────────────────────────────────────────────────────
export const KEYS = {
  users:    'vi_users',
  current:  'vi_current',
  sessions: (userId) => `vi_sessions_${userId}`,
}
