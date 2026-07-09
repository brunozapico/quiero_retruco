import { useCallback, useEffect, useState } from 'react'
import type { GameState, Target, Team } from '../types'

const STORAGE_KEY = 'truco.current-game.v1'

const EMPTY_GAME: GameState = {
  target: null,
  us: 0,
  them: 0,
  winner: null,
}

function isTarget(value: unknown): value is Target {
  return value === 15 || value === 30
}

function isTeam(value: unknown): value is Team {
  return value === 'us' || value === 'them'
}

function restoreGame(): GameState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_GAME

    const parsed = JSON.parse(raw) as Partial<GameState>
    const target = isTarget(parsed.target) ? parsed.target : null
    const us = Number.isInteger(parsed.us) && Number(parsed.us) >= 0 ? Number(parsed.us) : 0
    const them = Number.isInteger(parsed.them) && Number(parsed.them) >= 0 ? Number(parsed.them) : 0
    const winner = isTeam(parsed.winner) ? parsed.winner : null

    if (!target) return EMPTY_GAME

    return {
      target,
      us: Math.min(us, target),
      them: Math.min(them, target),
      winner,
    }
  } catch {
    return EMPTY_GAME
  }
}

export function useGame() {
  const [game, setGame] = useState<GameState>(restoreGame)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
  }, [game])

  const start = useCallback((target: Target) => {
    setGame({ target, us: 0, them: 0, winner: null })
  }, [])

  const reset = useCallback(() => {
    setGame((current) => ({
      target: current.target,
      us: 0,
      them: 0,
      winner: null,
    }))
  }, [])

  const clear = useCallback(() => {
    setGame(EMPTY_GAME)
  }, [])

  const changeScore = useCallback((team: Team, delta: 1 | -1) => {
    setGame((current) => {
      if (!current.target || current.winner) return current

      const currentScore = current[team]
      const nextScore = Math.max(0, Math.min(current.target, currentScore + delta))
      if (nextScore === currentScore) return current

      return {
        ...current,
        [team]: nextScore,
        winner: nextScore >= current.target ? team : null,
      }
    })
  }, [])

  return {
    game,
    start,
    reset,
    clear,
    changeScore,
  }
}
