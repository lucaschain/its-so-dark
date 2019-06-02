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
  const firstNote = new Note(220)
  const pos = correctPath.toArray().findIndex((subject) => (
    vertex.x === subject.x && vertex.y === subject.y
  ))

  const scale = [ 0, 2, 4, 5, 7, 9, 11 ]

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
