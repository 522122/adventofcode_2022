import fs from 'fs/promises'
import path from 'path'

const sample = `noop
addx 3
addx -5`

export const parse = (raw: string) => {
  return raw.split('\n')
}

abstract class Instruction {
  cycles: number = 0
  add: number = 0
  constructor(input: string) {}
}

class AddX extends Instruction {
  cycles: number = 2
  constructor(input: string) {
    super(input)
    const parsed = input.split(' ')
    this.add = Number(parsed[1])
  }
}

class Noop extends Instruction {
  cycles: number = 1
}

abstract class FunctionalUnit {
  cycle(n: number, x: number) {}
}
class Part1 extends FunctionalUnit {
  signals: number[] = []
  cycles: number[]
  constructor(cycles: number[]) {
    super()
    this.cycles = cycles
  }

  cycle(n: number, x: number) {
    if (this.cycles.includes(n)) {
      this.signals.push(n * x)
    }
  }

  sum() {
    console.log(this.signals.reduce((a, c) => a + c, 0))
  }
}
class Crt extends FunctionalUnit {
  lines: string[][] = []
  WIDTH: number
  HEIGHT: number
  constructor(width: number, height: number) {
    super()
    this.WIDTH = width
    this.HEIGHT = height
    for (let i = 0; i < this.HEIGHT; i++) {
      this.lines.push([])
    }
  }

  cycle(n: number, x: number) {
    const sprite = [x - 1, x, x + 1]
    const line = Math.ceil(n / this.WIDTH) - 1
    const pixel = (n - 1) % this.WIDTH
    const ch = sprite.includes(pixel) ? '#' : '.'
    if (line < this.HEIGHT && pixel < this.WIDTH) {
      this.lines[line].push(ch)
    }
    return this
  }

  draw() {
    for (let line of this.lines) {
      console.log(line.join(' '))
    }
  }
}

class Cpu {
  x: number = 1
  cycle: number = 0
  _instructions: Instruction[] = []
  fus: FunctionalUnit[] = []
  constructor(l: any[]) {
    this.fus = [...l]
  }

  instructions(input: string[]) {
    for (let rawInstruction of input) {
      let i: Instruction
      if (rawInstruction === 'noop') {
        i = new Noop(rawInstruction)
      } else {
        i = new AddX(rawInstruction)
      }
      this._instructions.push(i)
    }
    return this
  }

  execute() {
    while (this._instructions.length) {
      const i = this._instructions.shift() as Instruction
      while (i?.cycles) {
        ++this.cycle
        --i.cycles
        this.fus.forEach((fu) => fu.cycle(this.cycle, this.x))
      }
      this.x += i.add
    }
  }
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  // const buffer = await fs.readFile(path.join(__dirname, 'data2'))

  const data = parse(buffer.toString())
  // const data = parse(sample)

  const part1 = new Part1([20, 60, 100, 140, 180, 220])
  const crt = new Crt(40, 6)
  const cpu = new Cpu([part1, crt])

  cpu.instructions(data).execute()

  part1.sum()
  crt.draw()
}

export default main
