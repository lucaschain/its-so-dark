// @flow
import { partial } from 'ramda'
import { withContext } from './with_context'
import { drawRect } from './rectangle'
import { type Cell } from '../maze/cell'
import { type CameraSettings } from './camera_settings'
import { type Vertex } from '../common/vertex'

const drawCellVertex = (
  settings: CameraSettings,
  cell: Cell,
  vertex: Vertex,
  index: number,
  vertices: Vertex[]
): void => {
  const isLast = (index === vertices.length - 1)
  const nextVertex = vertices[isLast ? 0 : index + 1]
  const { tileSize } = settings
  const toTile = v => v * tileSize


  withContext(settings, context => {
    context.beginPath()
    context.moveTo(
      toTile(cell.x + vertex.x),
      toTile(cell.y + vertex.y)
    )
    context.lineTo(
      toTile(cell.x + nextVertex.x),
      toTile(cell.y + nextVertex.y)
    )

    context.strokeStyle = 'rgba(170, 0, 0, 0.5)'
    context.lineWidth = 10;
    if (cell.walls[index]) {
      context.stroke()
    }
  })
}

const drawCellVertices = (settings: CameraSettings, cell: Cell): void => {
  const vertices: Vertex[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 }
  ]

  vertices.forEach(
    partial(drawCellVertex, [settings, cell])
  )
}

const drawCell = (settings: CameraSettings, cell: Cell): void => {
  const { tileSize } = settings

  drawRect(settings, {
    x: cell.x * tileSize,
    y: cell.y * tileSize,
    width: tileSize,
    height: tileSize,
    color: cell.visited ? 'rgba(10, 10, 15, 0.5)' : 'rgba(0, 0, 10, 0.5)'
  })

  drawCellVertices(settings, cell)
}

export const drawCells = (settings: CameraSettings, cells: Cell[]): void => {
  cells.forEach(drawCell.bind(null, settings))
}
