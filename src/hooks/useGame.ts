import { useCallback, useEffect, useState } from 'react'
import type { GameState, ScoreHistoryEntry, Target, Team } from '../types'

const STORAGE_KEY = 'truco.current-game.v1'

const EMPTY_GAME: GameState = {
  target: null,
  us: 0,
  them: 0,
  winner: null,
  history: [],
}

function isTarget(value: unknown): value is Target {
  return value === 15 || value === 30
}

function isTeam(value: unknown): value is Team {
  return value === 'us' || value === 'them'
}

function isDelta(value: unknown): value is 1 | -1 {
  return value === 1 || value === -1
}

function restoreHistory(value: unknown, target: Target): ScoreHistoryEntry[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry): ScoreHistoryEntry[] => {
    if (!entry || typeof entry !== 'object') return []

    const item = entry as Partial<ScoreHistoryEntry>
    const score = item.score
    if (
      typeof item.id !== 'string' ||
      !isTeam(item.team) ||
      !isDelta(item.delta) ||
      typeof score !== 'number' ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > target ||
      typeof item.at !== 'number' ||
      !Number.isFinite(item.at)
    ) {
      return []
    }

    return [{ id: item.id, team: item.team, delta: item.delta, score, at: item.at }]
  })
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
      history: restoreHistory(parsed.history, target),
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
    setGame({ target, us: 0, them: 0, winner: null, history: [] })
  }, [])

  const reset = useCallback(() => {
    setGame((current) => ({
      target: current.target,
      us: 0,
      them: 0,
      winner: null,
      history: [],
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

      const now = Date.now()
      const entry: ScoreHistoryEntry = {
        id: `${now}-${team}-${delta}-${current.history.length}`,
        team,
        delta,
        score: nextScore,
        at: now,
      }

      return {
        ...current,
        [team]: nextScore,
        winner: nextScore >= current.target ? team : null,
        history: [...current.history, entry],
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
