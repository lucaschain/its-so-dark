// @flow
import { type Game } from '../game'
import { withContext } from './with_context'
import { drawCells } from './cell'
import { drawPathFinding } from './path_finding'
import { type CameraSettings, createCameraSettings } from './camera_settings'
import { drawCircle } from './circle'

const clearScreen = (settings: CameraSettings): void => {
  withContext(settings, (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, settings.width * settings.tileSize, settings.height * settings.tileSize)
  })
}

const draw = (settings: CameraSettings, game: Game): void => {
  const { grid: { cells }, pathFinding, synthGrid, current } = game

  clearScreen(settings);

  drawCells(settings, cells)

  if (pathFinding) {
    drawPathFinding(settings, game, pathFinding)
  }

  if (current) {
    const tileSize = settings.tileSize

    drawCircle(settings, {
      x: current.x * tileSize + (tileSize / 2),
      y: current.y * tileSize + (tileSize / 2),
      radius: 20,
      color: '#00FF00'
    })
    */

    drawRaycasting(settings, game)
  }
}

export const createCamera = (settings: CameraSettings): Function => (
	draw.bind(null, settings)
)

