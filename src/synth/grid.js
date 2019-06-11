// @flow

import { partial, unfold } from 'ramda'
import { Set, OrderedSet } from 'immutable'
import { Note } from './note'
import { type Key } from './key'
import { type Vertex } from '../common/vertex'

type SynthGrid = Set<Key>

const createKeyForVertex = (
  grid: Set<Vertex>,
  correctPath: OrderedSet<Vertex>,
  vertex: Vertex
): Key => {
  const firstNote = new Note(130.81)
  const pos = correctPath.toArray().findIndex((subject) => (
    vertex.x === subject.x && vertex.y === subject.y
  ))

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

  const scale = "-B E G F# E B A F# E G F# Eb E -B -B E G F# E B +D +Db +C Ab +C B Bb Eb G E G B G B G +C B Bb F# G B Bb Eb E B G B G B G +D +Db +C Ab +C B Bb Eb G E"
    .split(' ')
    .map(noteToNum)

  if (pos > -1) {
    const positionInPath = correctPath.size - 1 - pos
    const positionInScale = positionInPath % scale.length
    const semiTones = scale[positionInScale]

    return {
      ...vertex,
      note: firstNote.transpose(semiTones)
    }
  }

  return {
    ...vertex,
    note: new Note()
  }
}

export const vertexNote = (grid: SynthGrid, vertex: Vertex): Note => {
  const key = grid.find((subject) => {
    return vertex.x === subject.x && vertex.y === subject.y
  })
  return key.note || new Note();
}

export const createSynthGrid = (
  grid: Set<Vertex>,
  correctPath: OrderedSet<Vertex>
): SynthGrid => (
  grid.map(partial(createKeyForVertex, [grid, correctPath]))
)
