import { COLORS } from '../constants/colors'

export default function ScoreRing({ score, size = 120 }) {
  const r    = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color =
    score >= 70 ? COLORS.success :
    score >= 40 ? COLORS.warning :
                  COLORS.danger

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={COLORS.border} strokeWidth="8"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.22, color, lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: size * 0.1, color: COLORS.textMuted, marginTop: 2 }}>
          / 100
        </div>
      </div>
    </div>
  )
}
