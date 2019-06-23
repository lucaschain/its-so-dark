// @flow
import { type Game } from './index'
import { maybe } from '../common/maybe'
import { isEquals } from '../common/vertex'

let lastBeep = Date.now()
export const checkEnd = (game: Game): Game => {
  const { current, pathFinding } = game

  if (pathFinding) {
    const optimalPath = maybe(pathFinding.get('optimalPath'))

    if (isEquals(current, optimalPath[0])) {
      alert('Muito obrigado por testar!')
      window.location.reload()
    }
  }

  return game
}
