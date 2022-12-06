import fs from 'fs/promises'
import path from 'path'

const sample = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

type Position = [number, number]
type Queue = [number, Position]

const parse = (raw: string, part2: boolean) => {
  const matrix = raw.split('\n').map((l) => l.split('').map(Number))
  if (!part2) {
    return matrix
  } else {
    return enlargeForFree(matrix)
  }
}

const enlargeForFree = (matrix: number[][]) => {
  const large: number[][] = Array.from(matrix)

  for (let n = 0; n < 4; n++) {
    for (let i in matrix) {
      for (let j in matrix) {
        large[i].push(incRisk(matrix[i][j], n))
      }
    }
  }

  for (let n = 0; n < 4; n++) {
    for (let i in matrix) {
      const nl = large[i].map((r) => incRisk(r, n))
      large.push(nl)
    }
  }

  return large
}

const isSame = (p1: Position, p2: Position) =>
  p1[0] === p2[0] && p1[1] === p2[1]

const newPosition = (x: number, y: number): Position => [x, y]

const queuePop = (queue: Queue[]) => {
  return queue.pop()
}

const queuePush = (queue: Queue[], q: Queue) => {
  queue.push(q)
  queue.sort((a, b) => b[0] - a[0])
}

const incRisk = (risk: number, idx: number) => {
  const n = risk + idx + 1
  return n > 9 ? n - 9 : n
}

const toString = (p: Position) => `${p[0]}${p[1]}`

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))

  const matrix = parse(buffer.toString(), true)

  // const matrix = parse(sample, true)

  const queue: Queue[] = [[0, [0, 0]]]

  const END = newPosition(matrix.length - 1, matrix[0].length - 1)
  const locked = new Set()
  console.time('queue test')
  while (queue.length) {
    const [risk, pos] = queuePop(queue) as Queue
    const [x, y] = pos

    if (locked.has(toString(pos))) continue

    locked.add(toString(pos))

    if (isSame(pos, END)) {
      console.log(risk)
      break
    }

    const neigh = [
      newPosition(x + 1, y),
      newPosition(x - 1, y),
      newPosition(x, y + 1),
      newPosition(x, y - 1),
    ].filter((p) => {
      if (p[0] < 0 || p[1] < 0) return false
      if (p[0] > END[0] || p[1] > END[1]) return false
      return true
    })

    for (let n of neigh) {
      queuePush(queue, [risk + matrix[n[0]][n[1]], n])
    }
  }
  console.timeEnd('queue test')
}

export default main
