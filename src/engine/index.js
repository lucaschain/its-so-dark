// @flow
import { pipe } from 'ramda'
import { type Input } from './input'
import { type Hook } from './hook'
import Hammer from 'hammerjs'

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
    let hammer
    if (input.swipe || input.tap) {
      hammer = new Hammer(document.body)
    }
    if (hammer && input.swipe) {
      hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
      const directions = {
        right: Hammer.DIRECTION_RIGHT,
        up: Hammer.DIRECTION_UP,
        down: Hammer.DIRECTION_DOWN,
        left: Hammer.DIRECTION_LEFT
      }

      input.swipe.forEach((hooks, direction) => {
        hammer.on('swipe', (event) => {
          if (event.direction === directions[direction]) {
            hooks.forEach((hook) => state = hook(state))
          }
        })
      })
    }
    if (hammer && input.tap) {
      const doubleTap = input.tap.get('double')
      if (doubleTap) {
        hammer.on('doubletap', (event) => {
          doubleTap.forEach((hook) => state = hook(state))
        })
      }
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
