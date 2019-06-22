// @flow
export type Vertex = {
  x: number,
  y: number
}

export const distance = (pointA: Vertex, pointB: Vertex) => {
  const a = pointA.x - pointB.x
  const b = pointA.y - pointB.y

  return Math.sqrt(a * a + b * b);
}

