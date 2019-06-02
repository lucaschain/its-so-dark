// @flow
import { range } from '../common/random'

const transpose = (frequency: number, semitones: number): number => (
  frequency * Math.pow(Math.pow(2, 1/12), semitones)
)

export class Note {
  frequency: number

  constructor(frequency: ?number) {
    this.frequency = frequency || range(200, 1000)
  }

  transpose(semitones: number) {
    return new Note(transpose(this.frequency, semitones))
  }
}
