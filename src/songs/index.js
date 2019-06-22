// @flow

import harryPotterSong from './harry_potter'

const noteToNum = (note: string): number => {
  const octavesUp = (note.match(/\+/g) || []).length
  const octavesDown = (note.match(/\-/g) || []).length

  const pureNote = note.replace(/(\+|\-)/g, '')
  return {
    "Cb": -1,
    "C": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11
  }[pureNote] + (octavesUp * 12) - (octavesDown * 12) + 12
}

const translate = (song): number[] => (
  song.split(' ').map(noteToNum)
)

export const harryPotter = translate(harryPotterSong)
