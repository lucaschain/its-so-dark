// @flow
import { chain, partial } from 'ramda'
import { drawRect } from './rectangle'
import { withContext } from './with_context'
import { type CameraSettings } from './camera_settings'
import { type Game } from '../game'
import { type Vertex, toAngle, distance } from '../common/vertex'
import { constrain } from '../common/constrain'
import { type Cell, WALLS } from '../maze/cell'
import { type Wall, createWall } from '../raycasting/wall'
import { type Ray } from '../raycasting/ray'
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

const drawPoints = (settings: CameraSettings, origin: Vertex, rays: Ray[]) => {
  withContext(settings, context => {
    rays.forEach((ray) => {
      const point = ray.target
      if (point) {
        context.beginPath()
        context.moveTo(origin.x, origin.y)
        context.lineTo(point.x, point.y)
        context.strokeStyle = 'rgba(255, 255, 255, 1)'
        context.lineWidth = 3;
        context.stroke()
      }
    })
  })
}

let lastState;
const draw3dRendered = (settings: CameraSettings, origin: Vertex, rays: Ray[], angle: number) => {
  if (!lastState) {
    lastState = rays
  }

  const sliceWidth = settings.canvas.width / rays.length

  rays.forEach((ray, index) => {
    if (!ray.target) {
      return
    }
    const lastRay = lastState[index] || ray
    const lastRayTarget = (lastRay.target) ? lastRay.target : ray.target
    const rayLength = distance(origin, ray.target)

    const maxDistance = 5
    const minDistance = 3
    const lastRayLength = distance(origin, lastRayTarget)
    const fixedDistance = rayLength + ((lastRayLength - rayLength) / 5)

    const alpha = constrain(fixedDistance, minDistance, maxDistance)

    const heightFixRate = Math.cos((angle - ray.angle) * Math.PI / 180)
    const height = constrain(fixedDistance * heightFixRate, 0, settings.canvas.height * 10)

    const y = (settings.canvas.height - height) / 2

    drawRect(settings, {
      x: (index * sliceWidth) - (sliceWidth / 2),
      y,
      width: sliceWidth * 2,
      height,
      color: `rgba(155, 30, 30, ${alpha})`
    })

    lastState[index] = ray
  })
}

export const drawRaycasting = (
  settings: CameraSettings,
  game: Game,
): void => {
  const { grid: { cells }, synth, current, heading } = game
  const { tileSize } = settings

  const angle = toAngle({
    x: synth.listener.forwardX,
    y: synth.listener.forwardZ
  })

  if (typeof angle === 'undefined') {
    return
  }

  const cameraSizeCenterTiled = (x, y) => {
    const position = toCameraSize(tileSize, x, y)
    return {
      x: position.x + tileSize / 2,
      y: position.y + tileSize / 2
    }
  }
  const listenerPosition = {
    x: synth.listener.positionX,
    y: synth.listener.positionZ
  }
  const sourcePosition = cameraSizeCenterTiled(listenerPosition.x, listenerPosition.y)


  const walls = chain(
    partial(wallsFromCell, [settings]),
    cells
  )
  const rays = flashLight(sourcePosition, angle, walls)

  draw3dRendered(settings, sourcePosition, rays, angle)
  drawPoints(settings, sourcePosition, rays)
}
