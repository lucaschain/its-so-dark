// @flow
import { chain, partial } from 'ramda'
import { drawRect } from './rectangle'
import { withContext } from './with_context'
import { type CameraSettings } from './camera_settings'
import { type Game } from '../game'
import { type Vertex, distance } from '../common/vertex'
import { type Cell, WALLS } from '../maze/cell'
import { type Wall, createWall } from '../raycasting/wall'
import { flashLight } from '../raycasting'

const toCameraSize = (tileSize: number, x: number, y: number) => ({
  x: x * tileSize,
  y: y * tileSize
})

const wallFromIndex = (
  settings: CameraSettings,
  index: number,
  cell: Cell
): Wall => {
  const { tileSize } = settings

  const cameraSize = partial(toCameraSize, [tileSize])

  switch(index) {
    case WALLS.TOP:
      return createWall(
        cameraSize(cell.x, cell.y),
        cameraSize(cell.x + 1, cell.y)
      )
    case WALLS.RIGHT:
      return createWall(
        cameraSize(cell.x + 1, cell.y),
        cameraSize(cell.x + 1, cell.y + 1)
      )
    case WALLS.BOTTOM:
      return createWall(
        cameraSize(cell.x, cell.y + 1),
        cameraSize(cell.x + 1, cell.y + 1)
      )
    default: // LEFT
      return createWall(
        cameraSize(cell.x, cell.y),
        cameraSize(cell.x, cell.y + 1)
      )
  }
}

const wallsFromCell = (settings: CameraSettings, cell: Cell): Wall[] => {
  return cell.walls.map((wall, index) => {
    if (wall) {
      return wallFromIndex(settings, index, cell)
    }
  }).filter(Boolean)
}

const drawPoints = (settings: CameraSettings, origin: Vertex, points: Vertex[]) => {
  withContext(settings, context => {
    points.forEach((point) => {
      context.beginPath()
      context.moveTo(origin.x, origin.y)
      context.lineTo(point.x, point.y)
      context.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      context.lineWidth = 3;
      context.stroke()
    })
  })
}

const draw3dRendered = (settings: CameraSettings, origin: Vertex, points: Vertex[]) => {
  const distances = points.map(partial(distance, [origin]))
  const sliceWidth = settings.canvas.width / points.length

  distances.forEach((distance, index) => {
    const alpha = 1 / distance

    const height = settings.canvas.height / (distance / 10)

    const y = (settings.canvas.height - height) / 2

    drawRect(settings, {
      x: index * sliceWidth,
      y,
      width: sliceWidth,
      height,
      color: `rgba(255, 50, 50, ${alpha})`
    })
  })
}

export const drawRaycasting = (
  settings: CameraSettings,
  game: Game,
): void => {
  const { grid: { cells }, current, heading } = game
  const { tileSize } = settings

  const angle = heading

  if (typeof angle === 'undefined') {
    return
  }

  const walls = chain(
    (cell) => wallsFromCell(settings, cell),
    cells
  )

  const cameraSizeCenterTiled = (x, y) => {
    const position = toCameraSize(tileSize, x, y)
    return {
      x: position.x + tileSize / 2,
      y: position.y + tileSize / 2
    }
  }

  const sourcePosition = cameraSizeCenterTiled(current.x, current.y)
  const points = flashLight(sourcePosition, angle, walls)

  //drawPoints(settings, sourcePosition, points)
  draw3dRendered(settings, sourcePosition, points)
}
