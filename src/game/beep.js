// @flow
import { vertexNote } from '../synth/grid'
import { type Game } from './index'

let lastBeep = Date.now()
export const beep = (forceBeep: boolean, game: Game): Game => {
  const { synth, synthGrid, current, nextNearest, hasMoved } = game
  const canBeep = hasMoved || forceBeep

  if (!canBeep) {
    return game
  }

  if (Date.now() - lastBeep > 50) {
    const note = vertexNote(synthGrid, current)
    synth.beep(note.frequency)

    lastBeep = Date.now()
  }

  return game
}
