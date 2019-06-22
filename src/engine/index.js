// @flow
import { pipe } from 'ramda'
import { type Input } from './input'
import { type Hook } from './hook'

export type Engine<T> = {|
  hooks: Hook<T>[],
  input: Input<T>,
  start: () => void,
  stop: () => void
|}

export const createEngine = <T>(
  input: Input<T>,
  hooks: Hook<T>[],
  initialState: T
): Engine<T> => {
  let state = initialState
  let interval

  const start = () => {
    if (input.keyPress) {
      input.keyPress.forEach((hooks, key) => {
        document.addEventListener('keydown', (event: any) => {
          if (event.key === key) {
            hooks.forEach((hook) => state = hook(state))
          }
        })
      })
    }
    const tick = () => { 
      state = pipe(...hooks)(state)
      requestAnimationFrame(tick)
    }
    tick()
  }

  const stop = () => {
    clearInterval(interval)
  }

  return {
    hooks,
    start,
    input,
    stop
  }
}
