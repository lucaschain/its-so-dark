// @flow
import { pipe, unfold, partial } from 'ramda'
import { type Cell, createCell, cellEquals } from './cell'
import { type Vertex } from '../common/vertex'

export type Grid = {
  width: number,
  height: number,
  cells: Cell[]
}

const existsInGrid = (width: number, height: number, index: number): boolean => (
  index < width * height
)

const overflowsGridWidth = (width: number, position: Vertex): boolean => (
  position.x < 0 || position.x >= width
)

const positionForIndex = (width: number, index: number): Vertex => ({
  x: index % width,
  y: Math.floor(index / width)
})

const indexForPosition = (width: number, position: Vertex): number => (
  overflowsGridWidth(width, position) ? -1 : position.y * width + position.x
)

const createCellFromIndex = pipe(
  positionForIndex,
  createCell
)

const placeCellInGrid = (width: number, height: number, index: number)  => (
  existsInGrid(width, height, index) ? [
    createCellFromIndex(width, index),
    index+1
  ] : false
)

const populateGrid = (width: number, height: number): Cell[] => (
  unfold(partial(placeCellInGrid, [width, height]), 0)
)

export const cellAt = (grid: Grid, x: number, y: number): Cell => {
  return (
    grid.cells[indexForPosition(grid.width, {x, y})]
  )
}

export const replaceCell = (grid: Grid, newCell: Cell): Grid => {
  const cellReplacer = (cell: Cell): Cell => {
    if (cellEquals(cell, newCell)) {
      return newCell
    }

    return cell
  }

  const newGrid = {
    ...grid,
    cells: grid.cells.map(cellReplacer)
  }
  return newGrid
}

export const createGrid = (width: number, height: number): Grid => ({
  width,
  height,
  cells: populateGrid(width, height)
})
