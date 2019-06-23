// @flow
import { type Game } from '../game'
import { withContext } from './with_context'
import { drawCells } from './cell'
import { drawPathFinding } from './path_finding'
import { drawRaycasting } from './raycasting'
import { type CameraSettings, createCameraSettings } from './camera_settings'
import { drawCircle } from './circle'

export type Camera = Game => Game

const clearScreen = (settings: CameraSettings): void => {
  withContext(settings, (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, settings.canvas.width, settings.canvas.height)
  })
}

const draw = (settings: CameraSettings, game: Game): Game => {
  const { grid: { cells }, pathFinding, synthGrid, current, nextNearest } = game

  clearScreen(settings)

  drawRaycasting(settings, game)

  drawCells(settings, cells)

  if (pathFinding) {
    //drawPathFinding(settings, game, pathFinding)
  }

  const tileSize = settings.tileSize
  drawCircle(settings, {
    x: current.x * tileSize + (tileSize / 2),
    y: current.y * tileSize + (tileSize / 2),
    radius: tileSize / 3,
    color: '#00FF0077'
  })

  /*
  drawCircle(settings, {
    x: nextNearest.x * tileSize + (tileSize / 2),
    y: nextNearest.y * tileSize + (tileSize / 2),
    radius: tileSize / 3,
    color: '#FFFF0077'
  })
  */

  return game
}

export const createCamera = (settings: CameraSettings): Camera => (
	draw.bind(null, settings)
)
