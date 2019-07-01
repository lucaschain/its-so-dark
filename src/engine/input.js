// @flow
import { Map } from 'immutable'
import { type Hook } from './hook'

export type KeyMap<T> = Map<string, Hook<T>[]>
export type SwipeMap<T> = Map<string, Hook<T>[]>
export type TypeMap<T> = Map<string, Hook<T>[]>

export type Input<T> = {
  keyPress: KeyMap<T>,
  swipe: KeyMap<T>,
  tap: TypeMap<T>
}
