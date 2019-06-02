// @flow
import { partial } from 'ramda'
import { type Vertex } from '../common/vertex'
import { type CameraSettings } from './camera_settings'
import { withContext } from './with_context'

const tileCenter = (tileSize: number, vertex: Vertex): Vertex => ({
  x: (vertex.x * tileSize) + tileSize / 2,
  y: (vertex.y * tileSize) + tileSize / 2
})

export const strokePath = (
  settings: CameraSettings,
  path: Vertex[],
  color: string
): void => {
  if (!path.length) {
    return
  }
  const pathToStroke = path.map(
    partial(tileCenter, [settings.tileSize])
  )
  const [ start ] = pathToStroke
  const { tileSize } = settings;

  withContext(settings, context => {
    context.beginPath()
    context.moveTo(start.x, start.y)
    pathToStroke.slice(1).forEach((vertex: Vertex) => {
      context.lineTo(
        vertex.x, vertex.y
      )
    })
    context.strokeStyle = color
    context.lineWidth = 3;
    context.stroke()
  })
}
