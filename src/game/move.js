// @flow
import { type Game } from './index'

const isAllowedToMove = (newPosition, neighbors): boolean => (
  !!neighbors.find((neighbor) => (
    newPosition.x === neighbor.x && newPosition.y === neighbor.y
  ))
)

export const move = (direction: string) => (game: Game): Game => {
  const { grid, current, heading, neighbors } = game

  const sin = (angle) => Math.round(Math.sin(angle * Math.PI / 180))
  const cos = (angle) => Math.round(Math.cos(angle * Math.PI / 180))
  const distance = direction === 'front' ? 1 : -1

  const movement = {
    x: cos(heading) * distance,
    y: sin(heading) * distance
  }

  const newPosition = {
    x: movement.x + current.x,
    y: movement.y + current.y
  }

  const moveAllowed = isAllowedToMove(
    newPosition,
    neighbors
  )

  return {
    ...game,
    current: moveAllowed ? newPosition : current
  }
}
