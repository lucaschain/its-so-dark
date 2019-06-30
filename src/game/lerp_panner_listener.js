// @flow
import { type Game } from './index'
import { fromAngle } from '../common/vertex'
import { lerp } from '../common/lerp'

export const lerpPannerListener = (game: Game): Game => {
  const { synth, current, nextNearest, heading } = game

  const { panner, listener } = synth

  const moveLerp = 0.3
  // since we use a 2d cartesian to position our items
  // we consider z as y in the 3d world
  synth.panner = panner.setPosition(
    lerp(panner.positionX, nextNearest.x, moveLerp),
    0,
    lerp(panner.positionZ, nextNearest.y, moveLerp)
  )

  const orientationLerp = 0.3
  const orientation = fromAngle(heading)
  synth.listener = listener.setPosition(
    lerp(listener.positionX, current.x, moveLerp),
    0,
    lerp(listener.positionZ, current.y, moveLerp)
  ).setOrientation(
    lerp(listener.forwardX, orientation.x, orientationLerp),
    0,
    lerp(listener.forwardZ, orientation.y, orientationLerp),
    0, 1, 0
  )

  return {
    ...game,
    synth
  }
}

