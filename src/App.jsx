import { useState } from 'react'
import AuthScreen    from './components/AuthScreen'
import Dashboard     from './components/Dashboard'
import Editor        from './components/Editor'
import SessionReport from './components/SessionReport'
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './utils/auth'
import { getSessions, addSession, deleteSession }           from './utils/sessions'

/**
 * Views:
 *   'dashboard' — session list
 *   'editor'    — writing editor
 *   'report'    — single session report
 */
export default function App() {
  const [user,          setUser]          = useState(() => getCurrentUser())
  const [view,          setView]          = useState('dashboard')
  const [sessions,      setSessions]      = useState(() => user ? getSessions(user.id) : [])
  const [activeSession, setActiveSession] = useState(null)

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleLogin(u) {
    setCurrentUser(u)
    setUser(u)
    setSessions(getSessions(u.id))
    setView('dashboard')
  }

  function handleLogout() {
    clearCurrentUser()
    setUser(null)
    setSessions([])
    setView('dashboard')
  }

  // ── Editor save ───────────────────────────────────────────────────────────
  function handleSave(sessionData) {
    const saved = addSession(user.id, sessionData)
    setSessions(getSessions(user.id))
    setActiveSession(saved)
    setView('report')
  }

  // ── Session navigation ────────────────────────────────────────────────────
  function handleViewSession(session) {
    setActiveSession(session)
    setView('report')
  }

  function handleDeleteSession(sessionId) {
    const updated = deleteSession(user.id, sessionId)
    setSessions(updated)
    setActiveSession(null)
    setView('dashboard')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />
  }

  if (view === 'editor') {
    return (
      <Editor
        user={user}
        onSave={handleSave}
        onBack={() => setView('dashboard')}
      />
    )
  }

  if (view === 'report' && activeSession) {
    return (
      <SessionReport
        session={activeSession}
        user={user}
        onBack={() => setView('dashboard')}
        onDelete={handleDeleteSession}
      />
    )
  }

  return (
    <Dashboard
      user={user}
      sessions={sessions}
      onNewSession={() => setView('editor')}
      onViewSession={handleViewSession}
      onDeleteSession={handleDeleteSession}
      onLogout={handleLogout}
    />
  )
}
