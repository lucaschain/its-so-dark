// @flow
import { type Game } from './index'
import { fromAngle } from '../common/vertex'

export const turn = (direction: string) => (game: Game): Game => {
  let { heading, synth } = game

  if (direction === 'right') {
    heading += 90
  } else if (direction === 'left') {
    heading -= 90
  }

  return {
    ...game,
    synth,
    heading
  }
}

