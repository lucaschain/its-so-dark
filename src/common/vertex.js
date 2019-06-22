// @flow
export type Vertex = {
  x: number,
  y: number
}

export const moveUp = (position: Vertex, amount: number = 1) => ({
  ...position,
  y: position.y - amount
})

export const moveDown = (position: Vertex, amount: number = 1) => ({
  ...position,
  y: position.y + amount
})

export const moveLeft = (position: Vertex, amount: number = 1) => ({
  ...position,
  x: position.x - amount
})

export const moveRight = (position: Vertex, amount: number = 1) => ({
  ...position,
  x: position.x + amount
})

export const distance = (pointA: Vertex, pointB: Vertex) => {
  const a = pointA.x - pointB.x
  const b = pointA.y - pointB.y

  return Math.sqrt(a * a + b * b);
}

