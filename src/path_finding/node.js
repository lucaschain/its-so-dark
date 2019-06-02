// @flow
import { Set } from 'immutable'
import { type Grid } from '../maze/grid'
import { type Cell } from '../maze/cell'

type NodeMapper = (Node) => Node

export class NodeMonad {
  values: Set<Node>

  constructor(nodes: Set<Node>) {
    this.values = nodes
  }

  get value(): Node {
    return this.values.first()
  }

  map(mapper: NodeMapper) {
    return this.values.map(mapper)
  }

  updateFCost(gCost: number) {
    this.values = this.map((node) => (
      node.updateFCost(gCost)
    ))

    return this
  }

  updateGCost(gCost: number) {
    this.values = this.map((node) => (
      node.updateGCost(gCost)
    ))

    return this
  }
}

export class Node {
  x: number
  y: number
  gCost: number
  fCost: number
  previous: ?Node

  constructor(x: number, y: number, gCost: number = Infinity, fCost: number = Infinity, previous: ?Node) {
    this.x = x
    this.y = y
    this.gCost = gCost
    this.fCost = fCost
    this.previous = previous
  }

  updateGCost(gCost: number) {
    return new Node(this.x, this.y, gCost, this.fCost, this.previous)
  }

  updateFCost(fCost: number) {
    return new Node(this.x, this.y, this.gCost, fCost, this.previous)
  }

  updatePrevious(previous: Node) {
    return new Node(this.x, this.y, this.gCost, this.fCost, previous)
  }

  equals(node: Node) {
    return node.x === this.x && node.y === this.y
  }
}

export const findNode = (nodes: Set<Node>, x: number, y: number): NodeMonad => {
  return new NodeMonad(
    Set(nodes.filter((node: Node) => node.x === x && node.y === y))
  )
}

export const nodeSetFromGrid = (grid: Grid): Set<Node> => (
  Set(grid.cells.map((cell: Cell): Node => (
    new Node(cell.x, cell.y)
  )))
)
