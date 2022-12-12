import fs from 'fs/promises'
import path from 'path'

const sample = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

export const parse = (raw: string) => {
  let endC: Coords = [0, 0],
    startC: Coords = [0, 0]

  const grid = raw.split('\n').map((l, li) =>
    l.split('').map((ch, ci) => {
      if (ch === 'E') {
        endC = [li, ci]
        ch = 'z'
      }
      if (ch === 'S') {
        startC = [li, ci]
        ch = 'a'
      }
      return ch.charCodeAt(0) - 97
    })
  )

  return [grid, startC, endC]
}

interface QueueItem {
  priority: number
  coords: [number, number]
}

type Coords = [number, number]
type Grid = number[][]

class Queue {
  state: QueueItem[] = []
  constructor() {}

  push(p: number, c: Coords) {
    this.state.sort((a, b) => b.priority - a.priority)
    return this.state.push({ priority: p, coords: c })
  }

  pop() {
    return this.state.pop()
  }

  get length() {
    return this.state.length
  }
}

const coordsToString = (c: Coords) => c.join(',')
const getGridValue = (grid: Grid, c: Coords) => grid[c[0]]?.[c[1]]

export const nextPossible = (grid: Grid, coords: Coords) => {
  const value = getGridValue(grid, coords)
  const candidates = (
    [
      [coords[0] + 1, coords[1]],
      [coords[0] - 1, coords[1]],
      [coords[0], coords[1] + 1],
      [coords[0], coords[1] - 1],
    ] as Coords[]
  )
    .filter((c) => getGridValue(grid, c) != null)
    .filter((c) => getGridValue(grid, c) - value <= 1)

  return candidates
}

const findPath = (grid: Grid, START: Coords, END: Coords) => {
  const seen: Set<string> = new Set()

  const Q = new Queue()
  Q.push(0, START)

  while (Q.length) {
    const q = Q.pop() as QueueItem
    if (seen.has(coordsToString(q.coords))) continue
    seen.add(coordsToString(q.coords))
    const nb = nextPossible(grid, q.coords)

    if (coordsToString(END) === coordsToString(q.coords)) {
      return q
    }

    for (let n of nb) {
      Q.push(q.priority + 1, n)
    }
  }
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))

  const [grid, START, END] = parse(buffer.toString()) as [Grid, Coords, Coords]
  // const [grid, START, END] = parse(sample) as [Grid, Coords, Coords]

  // part 1
  console.log(findPath(grid, START, END))

  // part 2
  const possibleStart: Coords[] = []

  for (let li in grid) {
    for (let ci in grid) {
      if (getGridValue(grid, [Number(li), Number(ci)]) === 0) {
        possibleStart.push([Number(li), Number(ci)])
      }
    }
  }
  const results: QueueItem[] = []
  for (let ps of possibleStart) {
    const p = findPath(grid, ps, END)
    if (p) {
      results.push(p)
    }
  }

  results.sort((a, b) => a.priority - b.priority)

  console.log(results[0])
}

export default main
