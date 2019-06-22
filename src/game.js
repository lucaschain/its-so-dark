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
  heading: number,
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

export const turn = (direction: string) => (game: Game): Game => {
  let { heading } = game

  if (direction === 'right') {
    heading += 90
  } else if (direction === 'left') {
    heading -= 90
  }

  return {
    ...game,
    heading: heading
  }
}

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
