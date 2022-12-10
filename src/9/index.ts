import fs from 'fs/promises'
import path from 'path'

const sample = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`

const sample2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

class Position {
  x
  y
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  toString() {
    return `${this.x},${this.y}`
  }
  clone() {
    return new Position(this.x, this.y)
  }
  distance(p: Position) {
    return Math.abs(p.x - this.x) + Math.abs(p.y - this.y)
  }
  getDiagonalCandidates() {
    return [
      new Position(this.x - 1, this.y - 1),
      new Position(this.x + 1, this.y + 1),
      new Position(this.x - 1, this.y + 1),
      new Position(this.x + 1, this.y - 1),
    ]
  }
  getStraightCandidates() {
    return [
      new Position(this.x - 1, this.y),
      new Position(this.x + 1, this.y),
      new Position(this.x, this.y + 1),
      new Position(this.x, this.y - 1),
    ]
  }
  isDiagonal(p: Position) {
    return p.x !== this.x && p.y !== this.y
  }
}

class Tail {
  history: Position[] = []
  head: Tail | undefined
  tail: Tail | undefined
  position: Position
  queueNextTailMove: Position | undefined
  name: string
  constructor(name: string = 'no-name') {
    this.position = new Position(0, 0)
    this.name = name
    this.save()
  }
  save() {
    this.history.push(this.position.clone())
  }
  move(direction: string, steps: number) {
    for (let i = 0; i < steps; i++) {
      switch (direction) {
        case 'U':
          ++this.position.y
          break
        case 'D':
          --this.position.y
          break
        case 'L':
          --this.position.x
          break
        case 'R':
          ++this.position.x
          break
      }

      this.save()
      this.tail?.follow()
    }
  }
  follow() {
    const HP = this.head?.position as Position

    const distance = this.position.distance(HP)
    const isDiagonal = HP.isDiagonal(this.position)

    if (distance === 0 || distance === 1 || (isDiagonal && distance === 2)) {
      this.save()
      this.tail?.follow()
      return
    }

    if (isDiagonal) {
      const candidates = this.position
        .getDiagonalCandidates()
        .sort((a, b) => a.distance(HP) - b.distance(HP))

      this.position = candidates[0]
    } else {
      const candidates = this.position
        .getStraightCandidates()
        .sort((a, b) => a.distance(HP) - b.distance(HP))

      this.position = candidates[0]
    }

    this.save()
    this.tail?.follow()
    return
  }

  get uniqPositions() {
    const set = new Set(this.history.map((p) => p.toString()))
    return set.size
  }
}

export const parse = (raw: string) => {
  return raw.split('\n')
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())
  // const data = parse(sample2)

  const ROPE: Tail[] = []
  for (let i = 0; i < 10; i++) {
    const t = new Tail(`tail-${i}`)
    ROPE.push(t)

    if (i > 0) {
      ROPE[i - 1].tail = t
      t.head = ROPE?.[i - 1]
    }
  }

  for (let line of data) {
    const [direction, steps] = line.split(' ')
    ROPE[0].move(direction, Number(steps))
  }
  console.log(ROPE[1].uniqPositions)
  console.log(ROPE[ROPE.length - 1].uniqPositions)

  // kreslenie samplov
  // const RENDER = ROPE[9]

  // const minX = Math.min(...RENDER.history.map((p) => p.x))
  // const minY = Math.min(...RENDER.history.map((p) => p.y))

  // const modified = RENDER.history.map(
  //   (p) => new Position(p.x + Math.abs(minX), p.y + Math.abs(minY))
  // )

  // const w = Math.max(...modified.map((p) => p.x)) + 1
  // const h = Math.max(...modified.map((p) => p.y)) + 1

  // const grid = Array.from(new Array(h), (x) => new Array(w).fill('.'))
  // console.log(minX, minY)

  // modified.forEach((p) => {
  //   if (grid[p.y][p.x] != null) {
  //     grid[p.y][p.x] = '#'
  //   }
  // })
  // grid[Math.abs(minY)][Math.abs(minX)] = 'S'
  // console.log(
  //   grid
  //     .reverse()
  //     .map((l) => l.join(' '))
  //     .join('\n')
  // )
}

export default main
