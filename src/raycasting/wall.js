// @flow
import { type Vertex } from '../common/vertex'

export type Wall = {
  pointA: Vertex,
  pointB: Vertex
}

export const createWall = (pointA: Vertex, pointB: Vertex): Wall => ({
  pointA, pointB
})
