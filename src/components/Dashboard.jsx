import Navbar from './Navbar'
import { analyzeSession, getVerdict } from '../utils/analysis'
import styles from './Dashboard.module.css'
import '../components/ui.css'

export default function Dashboard({ user, sessions, onNewSession, onViewSession, onDeleteSession, onLogout }) {
  const analysed = sessions.map((s) => ({ ...s, analysis: analyzeSession(s) }))

  const avgScore = sessions.length
    ? Math.round(analysed.map((s) => s.analysis?.score ?? 0).reduce((a, b) => a + b, 0) / sessions.length)
    : null

  const verifiedCount = analysed.filter((s) => (s.analysis?.score ?? 0) >= 70).length

  return (
    <div className={styles.wrap}>
      <Navbar user={user} onLogout={onLogout} />

      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Writing sessions</h1>
            <p className={styles.subtitle}>Your authenticity verification history</p>
          </div>
          <button className="btn btn-primary" onClick={onNewSession}>
            + New session
          </button>
        </div>

        {/* Summary stats */}
        {sessions.length > 0 && (
          <div className={styles.summaryGrid}>
            {[
              { val: sessions.length,   lbl: 'Total sessions' },
              { val: avgScore !== null ? `${avgScore}/100` : '—', lbl: 'Avg. authenticity' },
              { val: verifiedCount,     lbl: 'Verified human' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className={`card ${styles.summaryCard}`}>
                <div className={styles.summaryVal}>{val}</div>
                <div className={styles.summaryLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Session list */}
        {sessions.length === 0 ? (
          <div className={`card ${styles.empty}`}>
            <div className={styles.emptyIcon}>✍</div>
            <h2 className={styles.emptyTitle}>No sessions yet</h2>
            <p className={styles.emptyText}>
              Start a new writing session to capture your authentic typing patterns.
            </p>
            <button className="btn btn-primary mt-2" onClick={onNewSession}>
              Start writing
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {analysed.map((s) => {
              const v = getVerdict(s.analysis?.score ?? null)
              return (
                <div
                  key={s.id}
                  className={styles.item}
                  onClick={() => onViewSession(s)}
                >
                  <div className={styles.itemLeft}>
                    <span className={styles.itemTitle}>{s.title}</span>
                    <span className={styles.itemMeta}>
                      {new Date(s.createdAt).toLocaleDateString()} ·{' '}
                      {s.wordCount} words ·{' '}
                      {s.keystrokes.length} keystrokes
                    </span>
                  </div>
                  <div className={styles.itemRight}>
                    {s.analysis && (
                      <span className={styles.itemScore} style={{
                        color: s.analysis.score >= 70 ? 'var(--success)'
                             : s.analysis.score >= 40 ? 'var(--warning)'
                             : 'var(--danger)'
                      }}>
                        {s.analysis.score}
                      </span>
                    )}
                    <span className={`tag tag-${v.color}`}>{v.label}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id) }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
