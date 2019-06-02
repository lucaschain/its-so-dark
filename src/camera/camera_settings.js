// @flow
import { withContext } from './with_context'

export const createCameraSettings = (canvasId: string, width: number, height: number, tileSize: number): CameraSettings => {
  const canvas = document.getElementById(canvasId)

  if (canvas instanceof HTMLCanvasElement) {
    canvas.width = width * tileSize
    canvas.height = height * tileSize

    return {
      context: canvas.getContext('2d'),
      withContext,
      width,
      height,
      tileSize,
      canvas
    }
  } else {
    throw new Error('Canvas element not found')
  }
}

export type CameraSettings = {
  withContext: (CameraSettings, (CanvasRenderingContext2D) => void) => void,
  width: number,
  height: number,
  tileSize: number,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
}

