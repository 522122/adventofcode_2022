import fs from 'fs/promises'
import path from 'path'

const sample = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`

type Axis = 'x' | 'y'

class Instruction {
  axis
  value
  constructor(axis: 'x' | 'y', value: number) {
    this.axis = axis
    this.value = value
  }
}

class Point {
  x
  y
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Drawer {
  points
  width
  height
  grid: string[][] = []
  constructor(points: Point[]) {
    this.points = points
    this.width = points.sort((a, b) => b.x - a.x)[0].x + 1
    this.height = points.sort((a, b) => b.y - a.y)[0].y + 1
    this.reset()
  }

  reset() {
    this.grid = []
    this.initEmptyGrid()
    this.fillGrid()
  }

  initEmptyGrid() {
    this.grid = Array.from(new Array(this.width), (x) =>
      new Array(this.width).fill('.')
    )
  }

  fillGrid() {
    this.points.forEach(({ x, y }) => {
      this.grid[y][x] = '#'
    })
  }

  traverse(
    fn: (li: number, ci: number, value: string) => any,
    customGrid?: string[][]
  ) {
    ;(customGrid ?? this.grid).forEach((line, li) => {
      line.forEach((col, ci) => {
        fn(li, ci, col)
      })
    })
  }

  rotate() {
    const tmpGrid = Array.from(
      new Array(this.grid[0].length),
      (x): string[] => []
    )
    this.traverse((li, ci, val) => {
      tmpGrid[ci][li] = val
    })

    this.grid = tmpGrid
  }

  foldY(instruction: Instruction) {
    const slice = this.grid.splice(instruction.value).reverse()
    this.traverse((li, ci, val) => {
      if (this.grid?.[li]?.[ci] === '.' && val === '#') {
        this.grid[li][ci] = '#'
      }
    }, slice)
  }

  foldX(instruction: Instruction) {
    this.rotate()
    this.foldY(instruction)
    this.rotate()
  }

  fold(instructions: Instruction[]) {
    instructions.forEach((i) => {
      if (i.axis === 'y') {
        this.foldY(i)
      } else {
        this.foldX(i)
      }
    })
  }

  getVisibleDots() {
    let n = 0
    this.traverse((li, ci, val) => {
      if (val === '#') n++
    })
    return n
  }

  draw() {
    this.grid.forEach((line) => {
      console.log(line.join(''))
    })
  }
}

export const parse = (raw: string): [Point[], Instruction[]] => {
  const [_points, _instructions] = raw.split('\n\n')

  const points = _points
    .split('\n')
    .map((p) => new Point(...(p.split(',').map(Number) as [number, number])))
  const instructions = _instructions.split('\n').map((i) => {
    const split = i.split('=')
    return new Instruction(
      split[0][split[0].length - 1] as Axis,
      Number(split[1])
    )
  })

  return [points, instructions]
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const [points, instructions] = parse(buffer.toString())
  // const [points, instructions] = parse(sample)

  const drawer = new Drawer(points)
  drawer.fold([instructions[0]])
  console.log(drawer.getVisibleDots())
  drawer.reset()
  drawer.fold(instructions)
  drawer.draw()
}

export default main
