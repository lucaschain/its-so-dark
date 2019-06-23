// @flow
import { pipe } from 'ramda'
import { type Game } from './index'
import { type Hook } from '../engine/hook'

type Subscriber = {
  callbacks: Hook<Game>[]
}

type Event = {
  name: string
}

const dispatchEvents = (game: Game): Game => {
  return pipe(
    clearEvents
  )
}

const clearEvents = (game: Game): Game => {
  return {
    ...game,
    events: []
  }
}
