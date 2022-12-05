import fs from 'fs/promises'
import path from 'path'

export const parse = (raw: string) => {
  return raw
    .toString()
    .split('\n')
    .map((l) => (l.match(/\d+/g) ?? []).map((n) => Number(n)))
}

export const contains = (p: number[]) => {
  if (p[0] < p[2]) {
    return p[1] >= p[3]
  } else if (p[0] > p[2]) {
    return p[3] >= p[1]
  } else {
    return true
  }
}

export const overlap = (p: number[]) => {
  if (p[0] < p[2]) {
    return p[1] >= p[2]
  } else if (p[0] > p[2]) {
    return p[3] >= p[0]
  } else {
    return true
  }
}

export const partOne = (data: number[][]) =>
  data.reduce((a, c) => a + Number(contains(c)), 0)

export const partTwo = (data: number[][]) =>
  data.reduce((a, c) => a + Number(overlap(c)), 0)

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())

  console.log(partOne(data))
  console.log(partTwo(data))
}

export default main
