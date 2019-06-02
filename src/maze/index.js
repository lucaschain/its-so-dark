// @flow
import { type Cell, neighbors, breakWalls } from './cell'
import { type Grid, cellAt } from './grid'

export const allVisited = (grid: Grid): bool => {
  const visitedCell = (cell) => cell.visited

  return grid.cells.every(visitedCell)
}

const pickNextRandomCell = (grid: Grid, cell: Cell): Cell => {
  const random = () => Math.random() - 0.5
  const unvisited = cell => !cell.visited

  return neighbors(cell, grid)
    .filter(unvisited)
    .sort(random) // plz
    .sort(random) // gimme
    .sort(random) // some
    .sort(random) // entropy
    .pop()
}

type MazeFiller = Generator<Grid, void, void>
export function* fillMaze(grid: Grid): MazeFiller {
  const cellStack: Cell[] = []

  let currentCell: Cell = cellAt(grid, 0, 0)
  currentCell.visited = true
  cellStack.push(currentCell)

  while (!allVisited(grid)) {
    const nextCell = pickNextRandomCell(grid, currentCell)

    if (nextCell) {
      nextCell.visited = true
      breakWalls(currentCell, nextCell)
      cellStack.push(nextCell)
      currentCell = nextCell
      yield grid
    } else if (cellStack.length > 0) {
      currentCell = cellStack.pop()
    }
  }
}
