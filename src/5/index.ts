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
  const columns: string[][] = Array.from(lines[0], (x) => [])
  lines.forEach((line) => {
    line.forEach((c, ci) => {
      if (c !== '') {
        columns[ci].push(c)
      }
    })
  })
  return columns
}

export const parseCrates = (line: string) => {
  const MAX_C_LENGTH = 4
  const columns = Math.ceil(line.length / MAX_C_LENGTH)
  const crates: string[] = []
  for (let i = 0; i < columns; i++) {
    crates.push(
      line.substring(i * MAX_C_LENGTH, i * MAX_C_LENGTH + MAX_C_LENGTH).trim()
    )
  }
  return crates
}

export const parseInstruction = (line: string) => {
  const ns = (line.match(/\d+/g) ?? []).map(Number)
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
  instructions.forEach((i) => applyInstruction(crates, i))
  return toString(crates)
}

export const partTwo = (crates: string[][], instructions: Instruction[]) => {
  instructions.forEach((i) => applyInstruction2(crates, i))
  return toString(crates)
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const [crates, instructions] = parse(buffer.toString())
  console.log(partOne(cloneDeep(crates), instructions))
  console.log(partTwo(cloneDeep(crates), instructions))
}

export default main
