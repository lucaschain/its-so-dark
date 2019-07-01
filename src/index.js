// @flow
import { OrderedSet, Set, Map } from 'immutable'
import { partial, pipe, __ } from 'ramda'
import { type Grid, createGrid } from './maze/grid'
import { type Cell, walkableNeighbors } from './maze/cell'
import { 
  type Game,
  checkEnd,
  lerpPannerListener,
  calculateNextBest,
  calculateNeighbors,
  beep,
  move,
  turn
} from './game'
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
      hasMoved: false,
      heading: 0,
      current: { x: 0, y: 0 },
      nextNearest: { x: 0, y: 0 },
      neighbors: []
    }
  }

  throw 'Could not find optimal steps'
}

alert("Utilize as setas do teclado para girar e mover, e barra de espaço pra tocar uma nota. No celular, arraste a tela. Feche os olhos e tente sair")

const gameState = createInitialState()
const camera = createCamera(cameraSettings)
const withinNeighborsAndNextBest = (hook: Hook<Game>): Hook<Game> => pipe(
  calculateNeighbors,
  hook,
  calculateNextBest
)
const normalBeep = partial(beep, [false])
const forcedBeep = partial(beep, [true])

const keyPress = Map<string, Hook<Game>[]>({
  ArrowUp: [withinNeighborsAndNextBest(move('front')), normalBeep],
  ArrowDown: [withinNeighborsAndNextBest(move('back')), normalBeep],
  ArrowLeft: [withinNeighborsAndNextBest(turn('left'))],
  ArrowRight: [withinNeighborsAndNextBest(turn('right'))],
  ' ': [forcedBeep]
})
const swipe = Map<string, Hook<Game>[]>({
  down: [withinNeighborsAndNextBest(move('front')), normalBeep],
  up: [withinNeighborsAndNextBest(move('back')), normalBeep],
  left: [withinNeighborsAndNextBest(turn('right'))],
  right: [withinNeighborsAndNextBest(turn('left'))],
})
const tap = Map<string, Hook<Game>[]>({
  double: [forcedBeep]
})
const input = { keyPress, swipe, tap }
const engine = createEngine<Game>(input, [
  lerpPannerListener,
  checkEnd,
  camera
], gameState).start()
