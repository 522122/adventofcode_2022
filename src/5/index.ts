import fs from 'fs/promises'
import path from 'path'
import cloneDeep from 'lodash/cloneDeep'

export const parse = (raw: string): [string[][], Instruction[]] => {
  const [crates, instructions] = raw.split('\n\n')

  const parsedInstructions = instructions.split('\n').map(parseInstruction)
  const parsedCrates = crates.split('\n').slice(0, -1).map(parseCrates)
  return [flip(parsedCrates), parsedInstructions]
}

export const flip = (lines: string[][]) => {
  const columnsCount = lines[0].length
  const columns: string[][] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    for (let j = 0; j < line.length; j++) {
      if (!Array.isArray(columns[j])) {
        columns[j] = []
      }
      if (line[j] !== '') {
        columns[j].push(line[j])
      }
    }
  }

  return columns
}

export const parseCrates = (line: string) => {
  const columns = Math.ceil(line.length / 4)
  const crates: string[] = []
  for (let i = 0; i < columns; i++) {
    crates.push(line.substring(i * 4, i * 4 + 4))
  }
  return crates.map((c) => c.trim())
}

export const parseInstruction = (line: string) => {
  const ns = (line.match(/\d+/g) ?? []).map((n) => Number(n))
  return {
    n: ns[0],
    from: ns[1] - 1,
    to: ns[2] - 1,
  }
}

interface Instruction {
  from: number
  to: number
  n: number
}

export const applyInstruction = (
  crates: string[][],
  instruction: Instruction
) => {
  for (let i = 0; i < instruction.n; i++) {
    crates[instruction.to].unshift(crates[instruction.from].shift() as string)
  }

  return crates
}

export const applyInstruction2 = (
  crates: string[][],
  instruction: Instruction
) => {
  const slice = crates[instruction.from].splice(0, instruction.n)
  crates[instruction.to].unshift(...slice)
  return crates
}

const toString = (crates: string[][]) =>
  crates.reduce((a, c) => a + c[0], '').replace(/\W/g, '')

export const partOne = (crates: string[][], instructions: Instruction[]) => {
  instructions.map((i) => applyInstruction(crates, i))
  return toString(crates)
}

export const partTwo = (crates: string[][], instructions: Instruction[]) => {
  instructions.map((i) => applyInstruction2(crates, i))
  return toString(crates)
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const [crates, instructions] = parse(buffer.toString())
  console.log(partOne(cloneDeep(crates), instructions))
  console.log(partTwo(cloneDeep(crates), instructions))
}

export default main
