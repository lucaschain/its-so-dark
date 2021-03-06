// @flow
export type Vertex = {
  x: number,
  y: number
}

export const isEquals = (a: Vertex, b: Vertex) => (
  a.x === b.x && a.y === b.y
)

export const distance = (pointA: Vertex, pointB: Vertex) => {
  const a = pointA.x - pointB.x
  const b = pointA.y - pointB.y

  return Math.sqrt(a * a + b * b);
}

export const fromAngle = (angle: number) => ({
  y: Math.sin(angle * Math.PI / 180),
  x: Math.cos(angle * Math.PI / 180)
})

export const toAngle = (vertex: Vertex) => (
  Math.atan2(vertex.y, vertex.x) * (180 / Math.PI)
)
