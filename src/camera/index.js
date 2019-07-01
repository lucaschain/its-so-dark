// @flow
import { type Game } from '../game'
import { withContext } from './with_context'
import { drawCells } from './cell'
import { drawPathFinding } from './path_finding'
import { drawRaycasting } from './raycasting'
import { type CameraSettings, createCameraSettings } from './camera_settings'
import { drawCircle } from './circle'

const DRAW_MINIMAP = false

export type Camera = Game => Game

const clearScreen = (settings: CameraSettings): void => {
  withContext(settings, (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, settings.canvas.width, settings.canvas.height)
  })
}

const draw = (settings: CameraSettings, game: Game): Game => {
  const { grid: { cells }, pathFinding, synth, synthGrid, nextNearest } = game

  clearScreen(settings)

  drawRaycasting(settings, game)

  if (!DRAW_MINIMAP) {
    return game
  }

  drawCells(settings, cells)

  if (pathFinding) {
    drawPathFinding(settings, game, pathFinding)
  }

  const tileSize = settings.tileSize
  const listenerPosition = {
    x: synth.listener.positionX,
    y: synth.listener.positionZ
  }
  drawCircle(settings, {
    x: listenerPosition.x * tileSize + (tileSize / 2),
    y: listenerPosition.y * tileSize + (tileSize / 2),
    radius: tileSize / 3,
    color: '#00FF0077'
  })

  const pannerPosition = {
    x: synth.panner.positionX,
    y: synth.panner.positionZ
  }
  drawCircle(settings, {
    x: pannerPosition.x * tileSize + (tileSize / 2),
    y: pannerPosition.y * tileSize + (tileSize / 2),
    radius: tileSize / 3,
    color: '#FFFF0077'
  })

  return game
}

export const createCamera = (settings: CameraSettings): Camera => (
	draw.bind(null, settings)
)
