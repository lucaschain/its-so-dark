// @flow
import { type Game } from './index'
import { walkableNeighbors } from '../maze/cell'

export const calculateNeighbors = (game: Game): Game => {
  const { grid, current } = game
  return {
    ...game,
    neighbors: walkableNeighbors(current, grid)
  }
}

