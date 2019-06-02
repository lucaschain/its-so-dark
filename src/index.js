// @flow
import { OrderedSet, Set, Map } from 'immutable'
import { partial, pipe } from 'ramda'
import { type Grid, createGrid, cellAt } from './maze/grid'
import { type Cell, walkableNeighbors as cellNeighbors } from './maze/cell'
import { type Game, tick, move } from './game'
import { createCamera } from './camera'
import { createCameraSettings } from './camera/camera_settings'
import { fillMaze } from './maze'
import { findPath } from './path_finding'
import { Node, nodeSetFromGrid } from './path_finding/node'
import { sleep } from './common/sleep'
import { type Vertex } from './common/vertex'
import { createSynth } from './synth'
import { createSynthGrid } from './synth/grid'
import { onKeyDown } from './input'
import { type Synth } from './synth'

const tileSize = 100
const size = 10 // keep this a square
const width = size
const height = size

const cameraSettings = createCameraSettings(
  'canvas', width, height, tileSize
)
const neighbors = (grid, node: Vertex): Set<Vertex> => (
  Set(
    cellNeighbors(
      cellAt(grid, node.x, node.y), grid
    ).map(
      (cell: Cell) => ({ x: cell.x, y: cell.y })
    )
  )
)


const calculateNeighbors = (game: Game): Game => {
  const { grid, current } = game
  return {
    ...game,
    neighbors: neighbors(grid, current)
  }
}

export const startGame = (game: Game, synth: Synth, camera: (Game) => void) => {
  const tickGame = partial(tick, [ synth, camera ])
  const neighborFinder = partial(neighbors, [ game.grid ])

  let gameState = game

  const keyMap = {
    ArrowUp: pipe(move('up'), tickGame),
    ArrowDown: pipe(move('down'), tickGame),
    ArrowLeft: pipe(move('left'), tickGame),
    ArrowRight: pipe(move('right'), tickGame)
  }

  onKeyDown((keyPressed) => {
    const movement = keyMap[keyPressed] || (() => gameState)

    gameState = pipe(
      calculateNeighbors,
      movement,
      tickGame
    )(gameState)
  })

  tickGame(gameState)
}

async function setup() {
  const initialGrid = createGrid(width, height)
  const camera = createCamera(cameraSettings)

  const grid = Array.from(fillMaze(initialGrid)).pop()

  camera({ grid })

  const neighborFinder = partial(neighbors, [ grid ])
  const pathSteps = findPath(nodeSetFromGrid(grid), neighborFinder)

  const pathFinding = Array.from(pathSteps).pop()
  const optimalSteps = pathFinding.get('optimalPath')

  if (typeof optimalSteps !== 'undefined') {
    const synthGrid = createSynthGrid(
      Set(grid.cells),
      OrderedSet(optimalSteps)
    )

    const game = {
      grid,
      pathFinding,
      synthGrid,
      current: { x: 0, y: 0 },
      neighbors: Set()
    }

    startGame(game, createSynth(), camera)
  }
}

setup()
