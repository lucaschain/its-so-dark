// @flow
import { withContext } from './with_context'
import { type CameraSettings } from './camera_settings'

export type Rectangle = {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
}

export const padding = (
  amount: number,
  rectangle: Rectangle
): Rectangle => ({
  ...rectangle,
  x:  rectangle.x + amount,
  y:  rectangle.y + amount,
  width: rectangle.width - amount * 2,
  height: rectangle.height - amount * 2
})

export const drawRect = (
  settings: CameraSettings,
  rectangle: Rectangle
): void => {
  withContext(settings, (context: CanvasRenderingContext2D) => {
    context.fillStyle = rectangle.color
    context.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    )
  })
}
