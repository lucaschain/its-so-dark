// @flow
import { clamp } from 'ramda'

export const lerp = (start: number, end: number, rate: number, maximum: number = Infinity) => {
  const diff = end - start

  const amount = clamp(-maximum, maximum, diff * rate)

  return start + amount
}

