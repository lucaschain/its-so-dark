// @flow
import { partial, unfold } from 'ramda'
import { OrderedSet, Set, Map } from 'immutable'
import { type Node, findNode } from './node'
import { type Vertex } from '../common/vertex'

type PathTimeline = OrderedSet<Map<string, any>>
type PathFinder = Generator<Map<string, any>, void, void>
type NodeSet = Set<Node>
type OpenClosedNodeSet = { openSet: NodeSet, closedSet: NodeSet }
type NeighborFinder = Node => Set<Vertex>

const heuristic = (nodeA: Node, nodeB: Node): number => (
  Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y)
)

const nodeFromVertex = (nodes: NodeSet, vertex: Vertex): Node => (
  findNode(nodes, vertex.x, vertex.y).value
)

const includes = (nodes: NodeSet, node: Node): boolean => {
  return !!findNode(nodes, node.x, node.y).value
}

const pathToNode = (current: Node): NodeSet => (
  unfold((node: Node) => {
    const hasPrevious = !!node.previous
    const isLastOne = node && !hasPrevious

    if (isLastOne) {
      return [node, false]
    } else if (hasPrevious)  {
      return [node, node.previous]
    }

    return false
  }, current)
)

const updateSets = (
  current: Node,
  openSet: NodeSet,
  closedSet: NodeSet,
  nodes: NodeSet,
  finalNode: Node,
  neighbors: NeighborFinder
): OpenClosedNodeSet  => {
  openSet = openSet.remove(current)
  closedSet = closedSet.add(current)

  const currentNeighborFinder = neighbors(current).map(partial(nodeFromVertex, [nodes]))
  const openNeighborFinder = currentNeighborFinder.filter(
    (neighbor) => !includes(closedSet, neighbor)
  )
  openNeighborFinder.forEach((neighbor: Node) => {
    const tentativeGCost = current.gCost + 1
    neighbor = neighbor.updateFCost(
      heuristic(neighbor, finalNode)
    )

    if (!includes(openSet, neighbor)) {
      openSet = openSet.add(neighbor)
    }

    if (tentativeGCost < neighbor.gCost) {
      const updatedNeighbor: Node = neighbor
        .updateGCost(tentativeGCost)
        .updatePrevious(current)

      openSet = openSet
        .remove(neighbor)
        .add(updatedNeighbor)
      closedSet = closedSet
        .remove(neighbor)
        .add(updatedNeighbor)
    }
  })

  return { openSet, closedSet }
}

const findStartAndEndNodes = (nodes: NodeSet): { start: Node, end: Node } => {
  const end = findNode(
    nodes, Math.sqrt(nodes.size) - 1, Math.sqrt(nodes.size) - 1
  ).value
  const start: Node = findNode(nodes, 0, 0)
    .updateGCost(0)
    .updateFCost(
      heuristic(nodes.first(), end)
    ).value

  return { start, end }
}

const explore = (
  neighborFinder: NeighborFinder,
  current: Node,
  end: Node,
  allNodes: NodeSet,
  openSet: NodeSet,
  closedSet: NodeSet,
  timeline: PathTimeline = OrderedSet()
) => {
  const nextNode = openSet.minBy((node: Node) => node.fCost + node.gCost)
  const newSets = updateSets(
    nextNode,
    openSet,
    closedSet,
    allNodes,
    end,
    neighborFinder
  )

  const newOpenSet = newSets.openSet
  const newClosedSet = newSets.closedSet
  const pathToNextNode = pathToNode(nextNode)
  const newTimeline = timeline.add(Map({
    optimalPath: pathToNextNode,
    current: nextNode
  }))

  if (newOpenSet.size < 1 || nextNode.equals(end)) {
    return newTimeline
  }

  return explore(neighborFinder, nextNode, end, allNodes, newOpenSet, newClosedSet, newTimeline)
}

const pathFinderTimeline = (
  allNodes: NodeSet,
  neighborFinder: NeighborFinder,
): PathTimeline => {
  const { start, end } = findStartAndEndNodes(allNodes)
  let openSet: NodeSet = Set([start])
  let closedSet = Set()

  return explore(neighborFinder, start, end, allNodes, openSet, closedSet)
}

export function* findPath(allNodes: NodeSet, neighborFinder: NeighborFinder): PathFinder {
  const timeline = pathFinderTimeline(allNodes, neighborFinder)

  for (const frame of timeline) {
    yield frame
  }
}
