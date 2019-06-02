// @flow

export type Vertex = {
  x: number,
  y: number
}

export const moveUp = (position: Vertex) => ({
  ...position,
  y: position.y - 1
})

export const moveDown = (position: Vertex) => ({
  ...position,
  y: position.y + 1
})

export const moveLeft = (position: Vertex) => ({
  ...position,
  x: position.x - 1
})

export const moveRight = (position: Vertex) => ({
  ...position,
  x: position.x + 1
})

