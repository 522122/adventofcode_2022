import fs from 'fs/promises'
import { forEach, split } from 'lodash'
import path from 'path'

const sample = `30373
25512
65332
33549
35390`

export const parse = (raw: string) => {
  return raw.split('\n').map((l) => l.split('').map(Number))
}

const createComparator = (i: number) => (j: number) => j < i

const createViewCalc = (current: number) => (trees: number[]) => {
  let dist = 0
  for (let tree of trees) {
    dist++
    if (tree >= current) break
  }
  return dist
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())
  // const data = parse(sample)

  const visible = new Map()
  const scores = new Map<any, number>()

  data.forEach((line, li) => {
    line.forEach((col, ci) => {
      // left slice
      const ls = line.slice(0, ci).reverse()

      // right slice
      const rs = [...line]
        .reverse()
        .slice(0, line.length - 1 - ci)
        .reverse()

      // up slice
      const us = data
        .slice(0, li)
        .map((l) => l[ci])
        .reverse()

      // down slice
      const ds = [...data]
        .reverse()
        .slice(0, data.length - 1 - li)
        .map((l) => l[ci])
        .reverse()

      const compare = createComparator(col)
      const viewCalc = createViewCalc(col)

      // pt1
      if (
        ls.every(compare) ||
        rs.every(compare) ||
        us.every(compare) ||
        ds.every(compare)
      ) {
        visible.set([li, ci], col)
      }

      // pt2
      scores.set(
        [li, ci],
        viewCalc(ls) * viewCalc(rs) * viewCalc(ds) * viewCalc(us)
      )
    })
  })

  console.log(visible.size)
  console.log(Math.max(...scores.values()))
}

export default main
