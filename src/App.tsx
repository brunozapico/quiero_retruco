import { useEffect, useMemo, useState } from 'react'
import { HistoryIcon, InfoIcon, RefreshIcon, ShareIcon, HomeIcon, VolumeIcon, VolumeOffIcon } from './components/Icons'
import { Modal } from './components/Modal'
import { ScorePanel } from './components/ScorePanel'
import { useGame } from './hooks/useGame'
import { triggerFeedback } from './lib/feedback'
import type { ScoreHistoryEntry, Target, Team } from './types'
import './styles.css'

type AnimationState = Record<Team, 'up' | 'down' | null>

const SOUND_KEY = 'truco.sound-enabled.v1'

function restoreSoundPreference(): boolean {
  const stored = window.localStorage.getItem(SOUND_KEY)
  return stored !== 'false'
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
}

function formatHistoryTime(timestamp: number): string {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(timestamp)
}

export default function App() {
  const { game, start, reset, clear, changeScore } = useGame()
  const [soundEnabled, setSoundEnabled] = useState(restoreSoundPreference)
  const [animation, setAnimation] = useState<AnimationState>({ us: null, them: null })
  const [showReset, setShowReset] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showTargetChange, setShowTargetChange] = useState(false)
  const [standalone, setStandalone] = useState(isStandalone)

  useEffect(() => {
    window.localStorage.setItem(SOUND_KEY, String(soundEnabled))
  }, [soundEnabled])

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const update = () => setStandalone(isStandalone())
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const winnerLabel = useMemo(() => {
    if (game.winner === 'us') return 'Nosotros'
    if (game.winner === 'them') return 'Ellos'
    return null
  }, [game.winner])
  const historyCountLabel = game.history.length === 1 ? '1 movimiento' : `${game.history.length} movimientos`

  const selectTarget = (target: Target) => {
    start(target)
    setShowTargetChange(false)
    setShowHistory(false)
    triggerFeedback('add', soundEnabled)
  }

  const handleScore = (team: Team, delta: 1 | -1) => {
    if (!game.target) return

    setAnimation((current) => ({ ...current, [team]: delta === 1 ? 'up' : 'down' }))
    const winner = delta === 1 && game[team] + 1 >= game.target
    changeScore(team, delta)
    triggerFeedback(winner ? 'winner' : delta === 1 ? 'add' : 'subtract', soundEnabled)
  }

  const handleReset = () => {
    reset()
    setShowReset(false)
    setShowHistory(false)
    triggerFeedback('subtract', soundEnabled)
  }

  const handleNewTarget = () => {
    clear()
    setShowReset(false)
    setShowHistory(false)
  }

  if (!game.target) {
    return (
      <main className="setup-screen">
        <div className="ambient ambient--one" aria-hidden="true" />
        <div className="ambient ambient--two" aria-hidden="true" />

        <header className="setup-screen__topbar">
          <div className="brand-mark" aria-hidden="true">
            <span>T</span>
          </div>
          <button className="icon-button" type="button" onClick={() => setShowInfo(true)} aria-label="Información">
            <InfoIcon />
          </button>
        </header>

        <section className="setup-card">
          <p className="overline">CONTADOR DE TRUCO</p>
          <h1>¿A cuántos<br />juegan?</h1>
          <p className="setup-card__intro">Elegí el límite y empezá la partida.</p>

          <div className="target-grid">
            <button className="target-card" type="button" onClick={() => selectTarget(15)}>
              <span className="target-card__number">15</span>
              <span className="target-card__label">puntos</span>
            </button>
            <button className="target-card target-card--accent" type="button" onClick={() => selectTarget(30)}>
              <span className="target-card__number">30</span>
              <span className="target-card__label">puntos</span>
            </button>
          </div>

          <div className="setup-card__status">
            <span className="status-dot" aria-hidden="true" />
            {standalone ? 'Instalada · funciona sin conexión' : 'Instalable · funciona sin conexión'}
          </div>
        </section>

        <InfoModal open={showInfo} standalone={standalone} onClose={() => setShowInfo(false)} />
      </main>
    )
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient--game" aria-hidden="true" />

      <header className="app-header">
        <button
          className="target-pill"
          type="button"
          onClick={() => setShowTargetChange(true)}
          aria-label={`Partida a ${game.target} puntos. Cambiar modalidad`}
        >
          A {game.target}
        </button>

        <div className="app-header__actions">
          <button
            className="icon-button history-button"
            type="button"
            onClick={() => setShowHistory(true)}
            aria-label={`Historial de puntos. ${historyCountLabel}`}
          >
            <HistoryIcon />
            {game.history.length > 0 ? <span className="history-button__count">{game.history.length}</span> : null}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setSoundEnabled((enabled) => !enabled)}
            aria-label={soundEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? <VolumeIcon /> : <VolumeOffIcon />}
          </button>
          <button className="icon-button" type="button" onClick={() => setShowInfo(true)} aria-label="Información">
            <InfoIcon />
          </button>
          <button className="icon-button" type="button" onClick={() => setShowReset(true)} aria-label="Reiniciar partida">
            <RefreshIcon />
          </button>
        </div>
      </header>

      <section className="scoreboard" aria-label="Marcador">
        <ScorePanel
          team="us"
          label="Nosotros"
          score={game.us}
          target={game.target}
          disabled={Boolean(game.winner)}
          animation={animation.us}
          onChange={handleScore}
          onAnimationEnd={() => setAnimation((current) => ({ ...current, us: null }))}
        />
        <div className="scoreboard__divider" aria-hidden="true"><span>VS</span></div>
        <ScorePanel
          team="them"
          label="Ellos"
          score={game.them}
          target={game.target}
          disabled={Boolean(game.winner)}
          animation={animation.them}
          onChange={handleScore}
          onAnimationEnd={() => setAnimation((current) => ({ ...current, them: null }))}
        />
      </section>

      <footer className="game-footer">Tocá + o − para actualizar el marcador</footer>

      <Modal open={showReset} title="Reiniciar partida" onClose={() => setShowReset(false)}>
        <p className="modal-copy">El marcador volverá a cero. Esta acción no se puede deshacer.</p>
        <div className="modal-actions modal-actions--stacked">
          <button className="button button--primary" type="button" onClick={handleReset}>Reiniciar</button>
          <button className="button button--ghost" type="button" onClick={() => setShowReset(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal open={showTargetChange} title="Cambiar modalidad" onClose={() => setShowTargetChange(false)}>
        <p className="modal-copy">Cambiar el límite inicia una partida nueva y borra el marcador actual.</p>
        <div className="target-grid target-grid--modal">
          <button className="target-card" type="button" onClick={() => selectTarget(15)}>
            <span className="target-card__number">15</span>
            <span className="target-card__label">puntos</span>
          </button>
          <button className="target-card target-card--accent" type="button" onClick={() => selectTarget(30)}>
            <span className="target-card__number">30</span>
            <span className="target-card__label">puntos</span>
          </button>
        </div>
      </Modal>

      <Modal open={Boolean(game.winner)} title="Partida terminada">
        <div className="winner-content">
          <div className="winner-content__badge" aria-hidden="true">✦</div>
          <p className="winner-content__label">GANARON</p>
          <h2>{winnerLabel}</h2>
          <p>{game.us} — {game.them}</p>
        </div>
        <div className="modal-actions modal-actions--stacked">
          <button className="button button--ghost" type="button" onClick={() => setShowHistory(true)}>Ver historial</button>
          <button className="button button--primary" type="button" onClick={handleReset}>Revancha</button>
          <button className="button button--ghost" type="button" onClick={handleNewTarget}>Cambiar puntos</button>
        </div>
      </Modal>

      <InfoModal open={showInfo} standalone={standalone} onClose={() => setShowInfo(false)} />
      <HistoryModal history={game.history} open={showHistory} onClose={() => setShowHistory(false)} />
    </main>
  )
}

interface HistoryModalProps {
  history: ScoreHistoryEntry[]
  open: boolean
  onClose: () => void
}

function HistoryModal({ history, open, onClose }: HistoryModalProps) {
  const orderedHistory = [...history].reverse()

  return (
    <Modal open={open} title="Historial de puntos" onClose={onClose}>
      {orderedHistory.length === 0 ? (
        <p className="history-empty">Todavía no se sumaron ni restaron puntos en esta partida.</p>
      ) : (
        <ol className="history-list" aria-label="Movimientos de la partida">
          {orderedHistory.map((entry) => {
            const teamLabel = entry.team === 'us' ? 'Nosotros' : 'Ellos'
            const actionLabel = entry.delta > 0 ? 'sumó' : 'restó'

            return (
              <li className={`history-item history-item--${entry.team}`} key={entry.id}>
                <span className="history-item__mark">{entry.delta > 0 ? '+' : '-'}</span>
                <div className="history-item__main">
                  <p><strong>{teamLabel}</strong> {actionLabel} 1 punto</p>
                  <span>{formatHistoryTime(entry.at)}</span>
                </div>
                <span className="history-item__score">{entry.score}</span>
              </li>
            )
          })}
        </ol>
      )}

      <p className="modal-footnote">El historial se borra al reiniciar la partida o cambiar la modalidad.</p>
    </Modal>
  )
}

interface InfoModalProps {
  open: boolean
  standalone: boolean
  onClose: () => void
}

function InfoModal({ open, standalone, onClose }: InfoModalProps) {
  return (
    <Modal open={open} title="Acerca de la app" onClose={onClose}>
      <p className="modal-copy">
        Guarda únicamente la partida en curso y su historial en este dispositivo. No crea cuentas ni conserva partidas anteriores.
      </p>

      {standalone ? (
        <div className="installed-note"><span className="status-dot" />Instalada en la pantalla de inicio.</div>
      ) : (
        <div className="install-guide">
          <p className="install-guide__title">Instalar en iPhone</p>
          <ol>
            <li><span><ShareIcon /></span><p>En Safari, tocá <strong>Compartir</strong>.</p></li>
            <li><span><HomeIcon /></span><p>Elegí <strong>Agregar a Inicio</strong>.</p></li>
            <li><span>3</span><p>Tocá <strong>Agregar</strong>.</p></li>
          </ol>
        </div>
      )}

      <p className="modal-footnote">
        La vibración se activa solo cuando el navegador la admite. En iPhone, el feedback principal es sonoro y visual.
      </p>
    </Modal>
  )
}
