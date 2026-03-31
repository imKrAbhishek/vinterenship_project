import { useState } from 'react'
import { registerUser, loginUser, setCurrentUser } from '../utils/auth'
import styles from './AuthScreen.module.css'
import '../components/ui.css'

export default function AuthScreen({ onLogin }) {
  const [mode,     setMode]     = useState('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  function switchMode(m) {
    setMode(m)
    setError('')
  }

  function handleSubmit() {
    setError('')
    let result
    if (mode === 'register') {
      result = registerUser({ name, email, password })
    } else {
      result = loginUser({ email, password })
    }
    if (result.error) return setError(result.error)
    setCurrentUser(result.user)
    onLogin(result.user)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        {/* Branding */}
        <div className={styles.brand}>
          <h1 className={styles.logo}>Vi<span>Notes</span></h1>
          <p className={styles.tagline}>Authentic writing verification platform</p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Tab switcher */}
          <div className={styles.tabs}>
            {['login', 'register'].map((m) => (
              <button
                key={m}
                className={`${styles.tab} ${mode === m ? styles.tabActive : ''}`}
                onClick={() => switchMode(m)}
              >
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {/* Fields */}
          {mode === 'register' && (
            <div className={styles.field}>
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            className="btn btn-primary btn-full btn-lg mt-2"
            onClick={handleSubmit}
          >
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}
