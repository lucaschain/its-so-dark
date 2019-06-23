// @flow
import { OrderedSet, Set, Map } from 'immutable'
import { partial, pipe, __ } from 'ramda'
import { type Grid, createGrid } from './maze/grid'
import { type Cell, walkableNeighbors } from './maze/cell'
import { type Game, calculateNeighbors, beep, move, turn } from './game'
import { type Camera, createCamera } from './camera'
import { createCameraSettings } from './camera/camera_settings'
import { fillMaze } from './maze'
import { findPath } from './path_finding'
import { Node, nodeSetFromGrid } from './path_finding/node'
import { type Vertex } from './common/vertex'
import { createSynth } from './synth'
import { createSynthGrid } from './synth/grid'
import { type Synth } from './synth'
import { type Hook } from './engine/hook'
import { createEngine } from './engine'

const tileSize = 25
const size = 10 // keep this a square
const width = size
const height = size

const cameraSettings = createCameraSettings('canvas', width, height, tileSize)

const createInitialState = (): Game => {
  const initialGrid = createGrid(width, height)

  const grid = Array.from(fillMaze(initialGrid)).pop()

  const neighborFinder = (node) => {
    return Set(walkableNeighbors(node, grid))
  }
  const pathSteps = findPath(nodeSetFromGrid(grid), neighborFinder)

  const pathFinding = Array.from(pathSteps).pop()
  const optimalSteps = pathFinding.get('optimalPath')

  if (typeof optimalSteps !== 'undefined') {
    const synthGrid = createSynthGrid(
      Set(grid.cells),
      OrderedSet(optimalSteps)
    )

    return {
      grid,
      pathFinding,
      synthGrid,
      synth: createSynth(),
      heading: 0,
      current: { x: 0, y: 0 },
      neighbors: []
    }
  }

  throw 'Could not find optimal steps'
}

const gameState = createInitialState()
const camera = createCamera(cameraSettings)
const keyPress = Map<string, Hook<Game>>({
  ArrowUp: [move('front')],
  ArrowDown: [move('back')],
  ArrowLeft: [turn('left')],
  ArrowRight: [turn('right')]
})
const input = { keyPress }
const engine = createEngine<Game>(input, [
  calculateNeighbors,
  beep,
  camera
], gameState).start()
