import type { Team } from '../types'

type AnimationDirection = 'up' | 'down' | null

interface ScorePanelProps {
  team: Team
  label: string
  score: number
  target: number
  disabled: boolean
  animation: AnimationDirection
  onChange: (team: Team, delta: 1 | -1) => void
  onAnimationEnd: () => void
}

export function ScorePanel({
  team,
  label,
  score,
  target,
  disabled,
  animation,
  onChange,
  onAnimationEnd,
}: ScorePanelProps) {
  const progress = `${(score / target) * 100}%`

  return (
    <section className={`score-panel score-panel--${team}`} aria-label={`${label}: ${score} puntos`}>
      <div className="score-panel__glow" aria-hidden="true" />

      <div className="score-panel__heading">
        <span className="score-panel__eyebrow">EQUIPO</span>
        <h2>{label}</h2>
      </div>

      <div className="score-panel__score-wrap" aria-live="polite" aria-atomic="true">
        <span
          className={`score-panel__score${animation ? ` score-panel__score--${animation}` : ''}`}
          onAnimationEnd={onAnimationEnd}
        >
          {score}
        </span>
        <span className="score-panel__target">/{target}</span>
      </div>

      <div className="score-panel__progress" aria-hidden="true">
        <span style={{ width: progress }} />
      </div>

      <div className="score-panel__controls">
        <button
          className="score-button score-button--minus"
          type="button"
          aria-label={`Restar un punto a ${label}`}
          disabled={disabled || score === 0}
          onClick={() => onChange(team, -1)}
        >
          <span aria-hidden="true">−</span>
        </button>
        <button
          className="score-button score-button--plus"
          type="button"
          aria-label={`Sumar un punto a ${label}`}
          disabled={disabled || score >= target}
          onClick={() => onChange(team, 1)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </section>
  )
}
