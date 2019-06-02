// @flow
import { partial } from 'ramda'
import { maybe } from '../common/maybe'
import { type CameraSettings } from './camera_settings'
import { type Game } from '../game'
import { padding, drawRect } from './rectangle'
import { type Vertex } from '../common/vertex'
import { strokePath } from './path'

const padRect: Function = partial(padding, [20])

const drawPath = (
  settings: CameraSettings,
  path: ?Array<Vertex>,
  color: string
): void => {
  strokePath(settings, maybe(path), color)
}

export const drawPathFinding =  (
  settings: CameraSettings,
  game: Game,
  pathFinding: Map<string, any>
): void => {
  const { tileSize } = settings;

  drawPath(settings, pathFinding.get('optimalPath'), '#0000FFFF')

  const current = pathFinding.get('current')
  if (current) {
    drawRect(settings, padRect({
      x: current.x * tileSize,
      y: current.y * tileSize,
      width: tileSize,
      height: tileSize,
      color: '#CC00BB30'
    }))
  }
}

