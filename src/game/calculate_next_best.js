// @flow
import { type Game } from './index'
import { maybe } from '../common/maybe'

export const calculateNextBest = (game: Game): Game => {
  const { grid, current, pathFinding } = game

  let nextNearest
  if (pathFinding) {
    const optimalPath = maybe(pathFinding.get('optimalPath'))

    nextNearest = optimalPath.find((step, index, fullPath) => {
      const next = fullPath[index+1]

      return next && next.x === current.x && next.y === current.y
    })
  }

  return {
    ...game,
    nextNearest: nextNearest || game.nextNearest
  }
}

