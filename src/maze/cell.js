// @flow
import { type Grid, cellAt } from './grid'
import { type Vertex } from '../common/vertex'

export type Cell = {
  x: number,
  y: number,
  visited: boolean,
  walls: boolean[]
}

export const WALLS = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
}

const connectionPoints = (currentCell: Cell, nextCell: Cell): boolean[] => {
  const isTop = currentCell.y > nextCell.y
  const isRight = currentCell.x < nextCell.x
  const isBottom = currentCell.y < nextCell.y
  const isLeft = currentCell.x > nextCell.x

  return [isTop, isRight, isBottom, isLeft]
}

export const breakWalls = (currentCell: Cell, nextCell: Cell) => {
  const currentWallsToBreak = connectionPoints(currentCell, nextCell)

  currentCell.walls = currentCell.walls.map((wall: bool, index: number) => {
    if (currentWallsToBreak[index]) {
      return false
    }

    return wall
  })

  nextCell.walls = nextCell.walls.map((wall: bool, index: number) => {
    const oppositeWall = (index + 2) % currentWallsToBreak.length
    if (currentWallsToBreak[oppositeWall]) {
      return false
    }

    return wall
  })
}

export const createCell = (position: Vertex): Cell => ({
  x: position.x,
  y: position.y,
  visited: false,
  walls: [true, true, true, true]
})

export const neighbors = (cell: Cell, grid: Grid): Cell[] => {
  const cellFrom = (relativeX, relativeY): Cell => {
    return cellAt(grid, cell.x + relativeX, cell.y + relativeY)
  }

  return [
    cellFrom(-1, 0),
    cellFrom(0, 1),
    cellFrom(1, 0),
    cellFrom(0, -1)
  ].filter(Boolean)
}

export const cellEquals = (cellA: Cell, cellB: Cell): boolean => (
  cellA.x === cellB.x && cellA.y === cellB.y
)

export const walkableNeighbors = (cell: Cell, grid: Grid): Cell[] => {
  const canWalkTo = (nextCell: Cell) => {
    const [isTop, isRight, isBottom, isLeft ] = connectionPoints(cell, nextCell)

    return (
      (isTop && (!cell.walls[WALLS.TOP] || !nextCell.walls[WALLS.BOTTOM])) ||
      (isRight && (!cell.walls[WALLS.RIGHT] || !nextCell.walls[WALLS.LEFT])) ||
      (isBottom && (!cell.walls[WALLS.BOTTOM] || !nextCell.walls[WALLS.TOP])) ||
      (isLeft && (!cell.walls[WALLS.LEFT] || !nextCell.walls[WALLS.RIGHT]))
    )
  }

  return neighbors(cell, grid)
    .filter(canWalkTo)
}
