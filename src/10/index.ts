import fs from 'fs/promises'
import path from 'path'

const sample = `noop
addx 3
addx -5`

export const parse = (raw: string) => {
  return raw.split('\n')
}

class Instruction {
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

class Register {
  x: number = 1
  cycle: number = 0
  instructions: Instruction[] = []
  constructor(input: string[]) {
    for (let rawInstruction of input) {
      let i: Instruction
      if (rawInstruction === 'noop') {
        i = new Noop(rawInstruction)
      } else {
        i = new AddX(rawInstruction)
      }
      this.instructions.push(i)
    }
  }

  execute(outputs: number[]): [number[], string[][]] {
    const values = []
    let lineRef: string[] = []
    const crt: string[][] = [lineRef]
    while (this.instructions.length) {
      const i = this.instructions.shift() as Instruction

      while (i?.cycles) {
        ++this.cycle
        --i.cycles
        // part 1
        if (outputs.includes(this.cycle)) {
          values.push(this.x * this.cycle)
        }

        // part 2
        const pixel = (this.cycle - 1) % 40
        const sprite = [this.x - 1, this.x, this.x + 1]
        lineRef.push(sprite.includes(pixel) ? '#' : '.')

        if (this.cycle % 40 === 0) {
          lineRef = []
          crt.push(lineRef)
        }
      }

      this.x += i.add
    }

    return [values, crt]
  }
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  // const buffer = await fs.readFile(path.join(__dirname, 'data2'))

  const data = parse(buffer.toString())
  // const data = parse(sample)

  const REGISTER = new Register(data)

  const [values, crt] = REGISTER.execute([20, 60, 100, 140, 180, 220])

  console.log(values.reduce((a, c) => a + c, 0))

  console.log(crt.length, crt[0].length)
  for (let l of crt) {
    console.log(l.join(' '))
  }
}

export default main
