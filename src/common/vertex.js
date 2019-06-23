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

export const fromAngle = (angle: number) => ({
  y: Math.sin(angle * Math.PI / 180),
  x: Math.cos(angle * Math.PI / 180)
})
