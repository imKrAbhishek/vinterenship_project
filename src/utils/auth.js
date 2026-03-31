import { loadStore, saveStore, removeStore, KEYS } from './storage'

/**
 * Minimal password hashing — NOT cryptographically secure.
 * For production replace with bcrypt / server-side hashing.
 */
export function hashPassword(password) {
  let h = 0
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0
  }
  return h.toString(36)
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

// ── User store ──────────────────────────────────────────────────────────────

export function getUsers() {
  return loadStore(KEYS.users, {})
}

export function saveUsers(users) {
  saveStore(KEYS.users, users)
}

export function getCurrentUser() {
  return loadStore(KEYS.current, null)
}

export function setCurrentUser(user) {
  saveStore(KEYS.current, user)
}

export function clearCurrentUser() {
  removeStore(KEYS.current)
}

// ── Convenience auth functions ──────────────────────────────────────────────

/**
 * Register a new user.
 * Returns { user } on success or { error } on failure.
 */
export function registerUser({ name, email, password }) {
  if (!name || !email || !password) return { error: 'All fields are required' }
  const users = getUsers()
  if (users[email]) return { error: 'Email is already registered' }
  const user = {
    id:           generateId(),
    email,
    name,
    passwordHash: hashPassword(password),
    createdAt:    Date.now(),
  }
  users[email] = user
  saveUsers(users)
  return { user }
}

/**
 * Attempt login.
 * Returns { user } on success or { error } on failure.
 */
export function loginUser({ email, password }) {
  if (!email || !password) return { error: 'Email and password are required' }
  const users = getUsers()
  const user = users[email]
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { error: 'Invalid email or password' }
  }
  return { user }
}
