// @flow
import { type Game } from './index'

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

