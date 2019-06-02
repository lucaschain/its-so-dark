// @flow
import { withContext } from './with_context'
import { type CameraSettings } from './camera_settings'

type Circle = {
  x: number,
  y: number,
  radius: number,
  color: string
}

export const drawCircle = (
  settings: CameraSettings,
  circle: Circle
): void => {
  withContext(settings, (context: CanvasRenderingContext2D) => {
    context.fillStyle = circle.color
    context.beginPath();
    context.arc(
      circle.x,
      circle.y,
      circle.radius,
      0,
      2 * Math.PI
    )
    context.fill();
  })
}
