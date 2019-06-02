// @flow
import { type CameraSettings } from './camera_settings'

export const withContext = (settings: CameraSettings, callback: Function) => {
  const context: any = settings.context

  const propertiesToPreserve = [
    'strokeStyle',
    'fillStyle',
    'lineWidth'
  ]

  const oldProperties = propertiesToPreserve.map((property: string): any => (
    context[propertiesToPreserve]
  ))

  callback(settings.context)

  oldProperties.forEach((property, index: number) => {
    context[propertiesToPreserve[index]] = property
  })
}
