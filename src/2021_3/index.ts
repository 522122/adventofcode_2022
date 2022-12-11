import fs from 'fs/promises'
import path from 'path'

import unzip from 'lodash/unzip'

const sample = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

export const parse = (raw: string) => {
  return raw.split('\n').map((l) => l.split('').map(Number))
}

// 0: min, 1: max, 2: same
const minMax = (l: number[]): [number, number, boolean] => {
  const sums = l.reduce(
    (a: [number, number], c) => {
      a[c] += 1
      return a
    },
    [0, 0]
  )

  if (sums[0] > sums[1]) {
    return [0, 1, false]
  } else if (sums[1] > sums[0]) {
    return [1, 0, false]
  } else {
    return [1, 0, true]
  }
}

const co2Check = (sums: [number, number, boolean], value: number) =>
  sums[2] === true ? value === 1 : value === sums[0]

const oCheck = (sums: [number, number, boolean], value: number) =>
  sums[2] === true ? value === 0 : value === sums[1]

const checkMap = {
  co2: co2Check,
  o: oCheck,
}

const createFilter = (position: number, type: 'co2' | 'o', arr: number[][]) => {
  const sums = unzip(arr).map(minMax)

  return (b: number[], i: number) => {
    if (arr.length === 1) return true
    return checkMap[type](sums[position], b[position])
  }
}

const toInt = (arr: number[]) => parseInt(arr.join(''), 2)

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  // const data = parse(sample)
  const data = parse(buffer.toString())

  // PT1
  const trans = unzip(data)
  const sums = trans.map(minMax)

  const most = toInt(sums.map((s) => s[0]))
  const least = toInt(sums.map((s) => s[1]))

  console.log(most * least)

  // PT2

  const co2 = data[0].reduce((a: number[][], c, i) => {
    return a.filter(createFilter(i, 'co2', a))
  }, data)

  const o = data[0].reduce((a: number[][], c, i) => {
    return a.filter(createFilter(i, 'o', a))
  }, data)

  const s1 = toInt(co2[0])
  const s2 = toInt(o[0])

  console.log(s1 * s2)
}

export default main
