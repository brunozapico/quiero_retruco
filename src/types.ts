export type Team = 'us' | 'them'
export type Target = 15 | 30

export interface GameState {
  target: Target | null
  us: number
  them: number
  winner: Team | null
}
