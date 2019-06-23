import { vertexNote } from '../synth/grid'

export const beep = (game: Game): Game => {
  const { synth, synthGrid, current } = game

  if (current) {
    const note = vertexNote(synthGrid, current)
    //synth.beep(note.frequency)
  }

  return game
}
