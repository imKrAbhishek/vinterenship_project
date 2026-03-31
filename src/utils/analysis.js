/**
 * Core authenticity analysis engine.
 * Analyses keystroke timing data + paste events to produce a human-writing score.
 */

/**
 * @param {Object} session
 * @param {Array}  session.keystrokes   — array of { time, key, type }
 * @param {Array}  session.pasteEvents  — array of { time, length }
 * @param {string} session.text         — final text content
 * @returns {Object|null} analysis result, or null if insufficient data
 */
export function analyzeSession(session) {
  const { keystrokes = [], pasteEvents = [], text = '' } = session

  if (keystrokes.length < 5) return null

  // ── Inter-keystroke intervals ─────────────────────────────────────────────
  const intervals = keystrokes
    .slice(1)
    .map((k, i) => k.time - keystrokes[i].time)
    .filter((d) => d > 0 && d < 5000)   // discard outliers (afk, etc.)

  const avgInterval = intervals.length
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 0

  const variance = intervals.length
    ? intervals.map((d) => (d - avgInterval) ** 2).reduce((a, b) => a + b, 0) / intervals.length
    : 0

  const stdDev = Math.sqrt(variance)
  const variability = avgInterval > 0 ? stdDev / avgInterval : 0   // coefficient of variation

  // ── Correction behaviour ───────────────────────────────────────────────────
  const deletions = keystrokes.filter(
    (k) => k.key === 'Backspace' || k.key === 'Delete'
  ).length
  const totalKeys    = keystrokes.length
  const deletionRate = totalKeys > 0 ? deletions / totalKeys : 0

  // ── Paste behaviour ────────────────────────────────────────────────────────
  const pastedChars = pasteEvents.reduce((a, p) => a + p.length, 0)
  const pasteRatio  = text.length > 0 ? pastedChars / text.length : 0

  // ── Pause behaviour ────────────────────────────────────────────────────────
  const longPauses = intervals.filter((d) => d > 2000).length
  const words       = text.trim().split(/\s+/).length
  const pauseScore  = Math.min(longPauses / Math.max(words / 20, 1), 1)

  // ── Typing speed ───────────────────────────────────────────────────────────
  const wpm = avgInterval > 0 ? Math.round(60000 / avgInterval / 5) : 0

  // ── Composite score (0–100, higher = more human) ───────────────────────────
  let score = 0
  score += Math.min(variability * 50, 30)                                       // natural rhythm variation
  score += Math.min(deletionRate * 200, 25)                                     // organic corrections
  score += Math.min(pauseScore * 20, 15)                                        // thinking pauses
  score += pasteRatio === 0 ? 20 : Math.max(20 - pasteRatio * 40, 0)           // paste penalty
  score += wpm > 20 && wpm < 120 ? 10 : 0                                      // plausible human WPM

  // ── Detection flags ────────────────────────────────────────────────────────
  const flags = []

  if (pasteRatio > 0.3)
    flags.push({ type: 'danger',  msg: `${Math.round(pasteRatio * 100)}% of text was pasted` })
  if (variability < 0.2 && totalKeys > 20)
    flags.push({ type: 'warning', msg: 'Unusually consistent typing rhythm detected' })
  if (deletionRate < 0.01 && totalKeys > 30)
    flags.push({ type: 'warning', msg: 'Almost no corrections — atypical for human writing' })
  if (longPauses === 0 && text.length > 200)
    flags.push({ type: 'warning', msg: 'No thinking pauses detected' })
  if (pasteRatio === 0 && variability > 0.3)
    flags.push({ type: 'success', msg: 'Natural typing variability observed' })
  if (deletionRate > 0.05)
    flags.push({ type: 'success', msg: 'Organic editing behaviour observed' })
  if (longPauses > 2)
    flags.push({ type: 'success', msg: 'Thinking pauses consistent with human composition' })

  return {
    score:        Math.round(Math.min(score, 100)),
    variability:  Math.round(variability * 100),
    deletionRate: Math.round(deletionRate * 100),
    pasteRatio:   Math.round(pasteRatio * 100),
    wpm,
    flags,
    totalKeys,
    longPauses,
  }
}

/**
 * Map a numeric score to a human-readable verdict.
 */
export function getVerdict(score) {
  if (score === null || score === undefined) return { label: 'No data',   color: 'info' }
  if (score >= 70) return { label: 'Likely Human',  color: 'success' }
  if (score >= 40) return { label: 'Uncertain',      color: 'warning' }
  return            { label: 'Suspicious',           color: 'danger'  }
}
