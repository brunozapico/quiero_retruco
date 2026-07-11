export type Team = 'us' | 'them'
export type Target = 15 | 30

export interface ScoreHistoryEntry {
  id: string
  team: Team
  delta: 1 | -1
  score: number
  at: number
}

export interface GameState {
  target: Target | null
  us: number
  them: number
  winner: Team | null
  history: ScoreHistoryEntry[]
}
