// @flow
import { clamp } from 'ramda'

export const constrain = (
  subject: number,
  lowestPossibleInput: number,
  highestPossibleInput: number
): number => {
  const range = highestPossibleInput - lowestPossibleInput
  const clampedSubject = clamp(lowestPossibleInput, highestPossibleInput, subject)

  const relativeAmount = subject - lowestPossibleInput

  if (relativeAmount === 0) {
    return 0
  }

  return range / relativeAmount
}
