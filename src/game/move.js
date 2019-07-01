// @flow
import { type Game } from './index'
import { fromAngle } from '../common/vertex'

const isAllowedToMove = (newPosition, neighbors): boolean => (
  !!neighbors.find((neighbor) => (
    newPosition.x === neighbor.x && newPosition.y === neighbor.y
  ))
)

export const move = (direction: string) => (game: Game): Game => {
  const { grid, current, heading, neighbors, synth } = game

  const distance = direction === 'front' ? 1 : -1
  const movementVector = fromAngle(heading)
  const movement = {
    x: Math.round(movementVector.x) * distance,
    y: Math.round(movementVector.y) * distance
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
    synth,
    hasMoved: moveAllowed,
    current: moveAllowed ? newPosition : current
  }
}
