import { useState, useRef, useCallback, useEffect } from 'react'
import Navbar from './Navbar'
import styles from './Editor.module.css'
import '../components/ui.css'

export default function Editor({ user, onSave, onBack }) {
  const [text,        setText]        = useState('')
  const [title,       setTitle]       = useState('')
  const [lastPaste,   setLastPaste]   = useState(null)
  const [saved,       setSaved]       = useState(false)
  const [elapsed,     setElapsed]     = useState(0)

  const keystrokesRef  = useRef([])
  const pasteRef       = useRef([])
  const sessionStart   = useRef(Date.now())
  const timerRef       = useRef(null)

  // Tick elapsed timer every second
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - sessionStart.current) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // ── Keystroke capture ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    const entry = { time: Date.now(), key: e.key, type: 'keydown' }
    keystrokesRef.current = [...keystrokesRef.current, entry]
  }, [])

  // ── Paste capture ─────────────────────────────────────────────────────────
  const handlePaste = useCallback((e) => {
    const pasted = e.clipboardData?.getData('text') ?? ''
    if (!pasted) return
    const ev = { time: Date.now(), length: pasted.length }
    pasteRef.current = [...pasteRef.current, ev]
    setLastPaste(ev)
    setTimeout(() => setLastPaste(null), 4000)
  }, [])

  // ── Save session ──────────────────────────────────────────────────────────
  function handleSave() {
    if (!text.trim()) return
    const session = {
      title:       title.trim() || 'Untitled session',
      text,
      keystrokes:  keystrokesRef.current,
      pasteEvents: pasteRef.current,
      wordCount:   text.trim().split(/\s+/).length,
      charCount:   text.length,
      duration:    Math.round((Date.now() - sessionStart.current) / 1000),
    }
    setSaved(true)
    setTimeout(() => onSave(session), 500)
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const wordCount    = text.trim() ? text.trim().split(/\s+/).length : 0
  const pastedTotal  = pasteRef.current.reduce((a, p) => a + p.length, 0)
  const pastePercent = text.length > 0 ? Math.round((pastedTotal / text.length) * 100) : 0
  const mins         = Math.floor(elapsed / 60)
  const secs         = elapsed % 60

  return (
    <div className={styles.wrap}>
      <Navbar user={user} onLogout={() => {}}>
        <div className={styles.titleRow}>
          <button className="btn btn-sm btn-ghost" onClick={onBack}>← Back</button>
          <input
            className={styles.titleInput}
            placeholder="Session title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>
      </Navbar>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.statsBar}>
          <span>{wordCount} words</span>
          <span>{text.length} chars</span>
          <span>{keystrokesRef.current.length} keystrokes</span>
          <span>{pasteRef.current.length} paste{pasteRef.current.length !== 1 ? 's' : ''}</span>
          {pastePercent > 0 && (
            <span style={{ color: 'var(--warning)' }}>{pastePercent}% pasted</span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <span className={styles.elapsed}>{mins}m {secs}s</span>
          <span className={styles.monitor}>
            <span className="pulse-dot" />
            Monitoring
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={!text.trim() || saved}
          >
            {saved ? '✓ Saved' : 'Save & Analyse'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        className={styles.editor}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Start writing here. Your typing patterns are being recorded silently in the background to verify authenticity. Write naturally…"
        spellCheck
        autoFocus
      />

      {/* Paste banner */}
      {lastPaste && (
        <div className={styles.pasteBanner}>
          ⚠ Paste detected — {lastPaste.length} characters pasted at{' '}
          {new Date(lastPaste.time).toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
