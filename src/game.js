// @flow
import { Set } from 'immutable'
import { type Grid } from './maze/grid'
import { type Vertex } from './common/vertex'
import { type Synth } from './synth'
import { vertexNote } from './synth/grid'

type Camera = (Game) => void

export type Game = {
  grid: Grid,
  pathFinding: any,
  current: Vertex,
  neighbors: Set<Vertex>,
  synthGrid: any
}

export const tick = (synth: Synth, camera: Camera, game: Game): Game => {
  const { synthGrid, current } = game

  camera(game)

  if (current) {
    const note = vertexNote(synthGrid, current)
    synth.beep(note.frequency)
  }

  return game
}

const isAllowedToMove = (newPosition, neighbors): boolean => (
  !!neighbors.find((neighbor) => (
    newPosition.x === neighbor.x && newPosition.y === neighbor.y
  ))
)

export const move = (direction: string) => (game: Game): Game => {
  const { grid, current, neighbors } = game
  const movementVector = {
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 },
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
  }[direction] || { x: 0, y: 0 }

  const newPosition = {
    x: movementVector.x + current.x,
    y: movementVector.y + current.y
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
