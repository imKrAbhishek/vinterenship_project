import Navbar from './Navbar'
import ScoreRing from './ScoreRing'
import { analyzeSession, getVerdict } from '../utils/analysis'
import styles from './SessionReport.module.css'
import '../components/ui.css'

export default function SessionReport({ session, user, onBack, onDelete }) {
  const analysis = analyzeSession(session)
  const verdict  = getVerdict(analysis?.score ?? null)

  const meta = [
    ['Created',      new Date(session.createdAt).toLocaleString()],
    ['Duration',     `${Math.floor(session.duration / 60)}m ${session.duration % 60}s`],
    ['Words',        session.wordCount],
    ['Characters',   session.charCount],
    ['Keystrokes',   session.keystrokes.length],
    ['Paste events', session.pasteEvents.length],
  ]

  return (
    <div className={styles.wrap}>
      <Navbar user={user} onLogout={() => {}}>
        <div className={styles.navRow}>
          <button className="btn btn-sm btn-ghost" onClick={onBack}>← Sessions</button>
          <span className={styles.navTitle}>{session.title}</span>
        </div>
      </Navbar>

      <div className={styles.page}>

        {/* Top row — score + meta */}
        <div className={styles.topGrid}>
          <div className={`card ${styles.scoreCard}`}>
            {analysis
              ? <ScoreRing score={analysis.score} size={130} />
              : <div style={{ color: 'var(--text-muted)' }}>Insufficient data</div>
            }
            <div className={styles.verdictBlock}>
              <span className={`tag tag-${verdict.color}`}>{verdict.label}</span>
              <span className={styles.verdictSub}>Authenticity verdict</span>
            </div>
          </div>

          <div className="card">
            <p className={styles.sectionLabel}>Session metadata</p>
            <table className={styles.metaTable}>
              <tbody>
                {meta.map(([k, v]) => (
                  <tr key={k}>
                    <td className={styles.metaKey}>{k}</td>
                    <td className={styles.metaVal}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Behavioral metrics */}
        {analysis && (
          <>
            <div className={`card ${styles.section}`}>
              <p className={styles.sectionLabel}>Behavioral metrics</p>
              <div className="stat-grid">
                {[
                  { val: `${analysis.variability}%`,  lbl: 'Rhythm variability', good: analysis.variability > 20 },
                  { val: `${analysis.deletionRate}%`, lbl: 'Correction rate',     good: analysis.deletionRate > 2 },
                  { val: `${analysis.pasteRatio}%`,   lbl: 'Text pasted',         good: analysis.pasteRatio < 20 },
                  { val: analysis.wpm,                lbl: 'Est. WPM',            good: analysis.wpm > 15 && analysis.wpm < 130 },
                  { val: analysis.longPauses,         lbl: 'Long pauses',         good: analysis.longPauses > 0 },
                  { val: analysis.totalKeys,          lbl: 'Total keys',          good: analysis.totalKeys > 10 },
                ].map(({ val, lbl, good }) => (
                  <div key={lbl} className="stat">
                    <div
                      className="stat-val"
                      style={{ color: good ? 'var(--success)' : 'var(--warning)' }}
                    >
                      {val}
                    </div>
                    <div className="stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detection flags */}
            <div className={`card ${styles.section}`}>
              <p className={styles.sectionLabel}>Detection flags</p>
              {analysis.flags.length === 0
                ? <p className={styles.noFlags}>No flags — write more text to generate flags.</p>
                : (
                  <div className={styles.flagList}>
                    {analysis.flags.map((f, i) => (
                      <div key={i} className={`tag tag-${f.type}`} style={{ alignSelf: 'flex-start', padding: '6px 14px' }}>
                        {f.type === 'success' ? '✓' : f.type === 'danger' ? '✗' : '!'} {f.msg}
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </>
        )}

        {/* Written content */}
        <div className={`card ${styles.section}`}>
          <p className={styles.sectionLabel}>Written content</p>
          <div className={styles.textPreview}>
            {session.text || <span style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>No content</span>}
          </div>
        </div>

        {/* Danger zone */}
        <div className={styles.dangerZone}>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(session.id)}>
            Delete session
          </button>
        </div>
      </div>
    </div>
  )
}
