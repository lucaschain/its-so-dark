// @flow
import { partial } from 'ramda'
import { type Vertex, distance } from '../common/vertex'
import { type Wall } from './wall'

export type Ray = {
  position: Vertex,
  direction: Vertex
}

export const createRay = (position: Vertex, angle: number): Ray => {
  return {
    position,
    direction: {
      x: Math.cos(angle * Math.PI / 180),
      y: Math.sin(angle * Math.PI / 180)
    }
  }
}

/*
 * using Line to Line intersections
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#In_two_dimensions
 */

export const cast = (ray: Ray, walls: Wall[]): Vertex | boolean => {
  const points = walls.map(partial(castToWall, [ray]))

  return nearestPoint(ray.position, points)
}

const nearestPoint = (reference: Vertex, points: Vertex[]): Vertex => {
  let nearestPoint = reference
  let nearestDistance = Infinity

  points.forEach((point) => {
    const pointDistance = distance(reference, point)

    if (pointDistance < nearestDistance) {
      nearestDistance = pointDistance
      nearestPoint = point
    }
  })

  return nearestPoint
}

const wallPoints = (wall: Wall) => ({
  x1: wall.pointA.x,
  x2: wall.pointB.x,
  y1: wall.pointA.y,
  y2: wall.pointB.y
})

const rayPoints = (ray: Ray) => ({
  x3: ray.position.x,
  x4: ray.position.x + ray.direction.x,
  y3: ray.position.y,
  y4: ray.position.y + ray.direction.y
})

const castToWall = (ray: Ray, wall: Wall): Vertex | boolean => {
  const { x1, x2, y1, y2 } = wallPoints(wall)
  const { x3, x4, y3, y4 } = rayPoints(ray)

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  if (denominator === 0) {
    return false
  }

  const t = (
    (x1 - x3) * (y3 - y4) - 
    (y1 - y3) * (x3 - x4)
  ) / denominator

  const u = -(
    (x1 - x2) * (y1 - y3) - 
    (y1 - y2) * (x1 - x3)
  ) / denominator

  if (t > 0 && t < 1 && u > 0) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    }
  }

  return false
}

