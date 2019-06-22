import { vertexNote } from './synth/grid'

export const beep = (synth: Synth, game: Game): Game => {
  const { synthGrid, current } = game

  if (current) {
    const note = vertexNote(synthGrid, current)
    synth.beep(note.frequency)
  }

  return game
}
