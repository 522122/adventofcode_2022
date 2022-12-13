import { readInput } from '../../utils'

const sample = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`

const compare = (a: number | any[], b: number | any[]): any => {
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] === undefined) {
        return -1
      } else if (b[i] === undefined) {
        return 1
      } else {
        const c = compare(a[i], b[i])
        if (c === 0) continue
        return c
      }
    }
    return 0
  } else if (Array.isArray(a)) {
    return compare(a, [b])
  } else if (Array.isArray(b)) {
    return compare([a], b)
  } else {
    if (a === b) {
      return 0
    } else if (a < b) {
      return -1
    } else {
      return 1
    }
  }
}

const main = async () => {
  const str = readInput()
  // const str = sample

  const data = str
    .split('\n\n')
    .map((l) => l.split('\n').map((l) => JSON.parse(l)))

  let sum = 0
  for (let i = 0; i < data.length; i++) {
    const result = compare(data[i][0], data[i][1])
    sum += result === 1 ? i + 1 : 0
  }

  console.log(sum)

  //pt2

  const data2 = str
    .split('\n')
    .filter((l) => l != '')
    .map((l) => JSON.parse(l))

  const p1 = [[2]]
  const p2 = [[6]]
  data2.push(p1, p2)

  data2.sort(compare)

  let a: number | undefined, b: number | undefined
  for (let i in data2) {
    if (JSON.stringify(data2[i]) === JSON.stringify(p1)) {
      a = Number(i) + 1
      continue
    }
    if (JSON.stringify(data2[i]) === JSON.stringify(p2)) {
      b = Number(i) + 1
      continue
    }
    if (a !== undefined && b !== undefined) break
  }

  console.log(Number(a) * Number(b))
}

export default main
