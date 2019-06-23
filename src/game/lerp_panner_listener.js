// @flow
import { type Game } from './index'
import { fromAngle } from '../common/vertex'

const lerp = (start: number, end: number, amount: number) => {
  return (1 - amount) * start + amount * end
}

export const lerpPannerListener = (game: Game): Game => {
  const { synth, current, nextNearest, heading } = game

  const { panner, listener } = synth

  const moveLerp = 0.5
  // since we use a 2d cartesian to position our items
  // we consider z as y in the 3d world
  synth.panner = panner.setPosition(
    lerp(panner.positionX, nextNearest.x, moveLerp),
    0,
    lerp(panner.positionY, nextNearest.y, moveLerp)
  )

  const orientationLerp = 0.5
  const orientation = fromAngle(heading)
  synth.listener = listener.setPosition(
    lerp(listener.positionX, current.x, moveLerp),
    0,
    lerp(listener.positionY, current.y, moveLerp)
  ).setOrientation(
    lerp(listener.forwardX, orientation.x, orientationLerp),
    0,
    lerp(listener.forwardY, orientation.y, orientationLerp),
    0, 1, 0
  )

  return {
    ...game,
    synth
  }
}

