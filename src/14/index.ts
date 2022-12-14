import { readInput, traverse, debugLog } from '../../utils'

const sample = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

type Coords = [number, number]

const getMaxX = (rp: RockPath[]) => Math.max(...rp.map((r) => r.maxX))
const getMaxY = (rp: RockPath[]) => Math.max(...rp.map((r) => r.maxY))

class RockPath {
  path: Coords[]
  constructor(line: string) {
    this.path = line
      .split(' -> ')
      .map((p) => p.split(',').map(Number) as Coords)
  }

  get maxX() {
    return Math.max(...this.path.map((p) => p[0]))
  }

  get maxY() {
    return Math.max(...this.path.map((p) => p[1]))
  }
}

class Cave {
  map: string[][]
  part2: boolean
  floor: number
  constructor(rockPaths: RockPath[], part2: boolean = false) {
    this.map = this.initMap(rockPaths)
    this.floor = this.map.length + 1
    this.part2 = part2

    if (part2) {
      this.addFloor()
    }
  }

  addFloor() {
    this.map.push(new Array(this.map[0].length).fill('.'))
    this.map.push(new Array(this.map[0].length).fill('#'))
  }

  addColumnRight() {
    this.map = this.map.map((l, i) => [...l, i === this.floor ? '#' : '.'])
  }

  addColumnLeft() {
    this.map = this.map.map((l, i) => [i === this.floor ? '#' : '.', ...l])
  }

  initMap(rockPaths: RockPath[]): string[][] {
    const maxX = getMaxX(rockPaths) + 1
    const maxY = getMaxY(rockPaths) + 1
    const cave = Array.from(new Array(maxY), () => new Array(maxX).fill('.'))

    for (let rockPath of rockPaths) {
      let x: number = 0
      let y: number = 0
      for (let i in rockPath.path) {
        if (i === '0') {
          x = rockPath.path[i][0]
          y = rockPath.path[i][1]
          debugLog('putting rock', x, y)
          cave[y][x] = '#'
        } else {
          const endX = rockPath.path[i][0]
          const endY = rockPath.path[i][1]
          const diffX = x - endX
          const diffY = y - endY
          let step = 0
          if (diffX === 0) {
            // moving up/down
            let step = 0
            while (step < Math.abs(diffY)) {
              ++step
              y += diffY < 0 ? 1 : -1
              debugLog('putting rock', x, y)
              cave[y][x] = '#'
            }
          } else {
            // moving left/right
            while (step < Math.abs(diffX)) {
              ++step
              x += diffX < 0 ? 1 : -1
              debugLog('putting rock', x, y)
              cave[y][x] = '#'
            }
          }
        }
      }
    }

    return cave
  }

  dropSand() {
    const start: Coords = [500, 0]
    const current: Coords = [...start]

    while (true) {
      let [x, y] = current

      if (this.part2) {
        if (this.map?.[y + 1]?.[x - 1] === undefined) this.addColumnLeft()
        if (this.map?.[y + 1]?.[x + 1] === undefined) this.addColumnRight()
      }

      const candidates = [
        [x, y + 1],
        [x - 1, y + 1],
        [x + 1, y + 1],
      ]

      const possiblePath = candidates.find(
        ([x, y]) => this.map?.[y]?.[x] === '.'
      )

      if (!possiblePath) {
        if (
          candidates.every(
            ([x, y]) => this.map?.[y]?.[x] === '#' || this.map?.[y]?.[x] === 'o'
          )
        ) {
          this.map[current[1]][current[0]] = 'o'
          debugLog('sand entering resting state: ', current[0], current[1])
        } else if (
          candidates.some(
            ([x, y]) =>
              this.map?.[y]?.[x] === undefined || this.map?.[y]?.[x] === '~'
          )
        ) {
          debugLog('sand dropping to void: ', current[0], current[1])
          this.map[current[1]][current[0]] = '~'
        } else {
          debugLog('THIS SHOULD NOT HAPPEN')
        }
        break
      }

      current[0] = possiblePath[0]
      current[1] = possiblePath[1]
      debugLog('sand following path: ', current[0], current[1])
    }
    return [current, this.map[current[1]][current[0]]]
  }

  count(symbol: string) {
    let sum = 0
    traverse(this.map, (value) => {
      if (value === symbol) {
        sum += 1
      }
    })
    return sum
  }
}

const main = async () => {
  const str = readInput()
  // const str = sample
  const rockPaths = str.split('\n').map((l) => new RockPath(l))

  // pt1
  const cave = new Cave(rockPaths)
  debugLog(cave.map[0].length, cave.map.length)
  debugLog('total rocks:', cave.count('#'))
  do {} while (cave.dropSand()[1] != '~')
  console.log('resting sands part1:', cave.count('o'))

  // pt2
  const cave2 = new Cave(rockPaths, true)
  debugLog(cave2.map[0].length, cave2.map.length)
  debugLog('total rocks:', cave2.count('#'))
  do {} while (JSON.stringify(cave2.dropSand()[0]) !== JSON.stringify([500, 0]))
  console.log('resting sands part2:', cave2.count('o'))
}

export default main
