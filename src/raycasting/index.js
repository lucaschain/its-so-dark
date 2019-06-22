// @flow
import { unfold, partial } from 'ramda'
import { type Vertex } from '../common/vertex'
import { type Wall } from './wall'
import { type Ray, createRay, cast } from './ray'

const createRays = (
  source: Vertex,
  angle: number,
  fieldOfView: number,
  amountOfRays: number,
  raysLeft: number
) => {
  if (raysLeft <= 0) { return false }

  const rayIndex = amountOfRays - raysLeft
  const spacing = fieldOfView / amountOfRays
  const rayAngle = angle - (fieldOfView / 2) + (rayIndex * spacing)

  const ray = createRay(source, rayAngle)

  return [
    ray,
    raysLeft - 1
  ]
}

export const flashLight = (
  source: Vertex,
  angle: number,
  walls: Wall[],
  fieldOfView: number = 160,
  amountOfRays: number = fieldOfView * 2
): Vertex[] => {
  const rays = unfold(
    partial(
      createRays,
      [source, angle, fieldOfView, amountOfRays]
    ),
    amountOfRays
  )

  return rays.map((ray) => cast(ray, walls))
}