import fs from 'fs/promises'
import path from 'path'

export const parse = (raw: string) => {
  return raw.split('\n').map(Number)
}

const createGroups = (data: number[]) => {
  return data.reduce((a: number[][], c, i, arr) => {
    const group = arr.slice(i, i + 3)
    if (group.length === 3) return [...a, group]
    return a
  }, [])
}

const sumReducer = (a: number, c: number, i: number) => {
  return a + c
}

const incReducer = (a: number[], c: number, i: number, arr: any[]) => {
  if (arr[i - 1] == null) return [...a, 0]
  return [...a, Number(arr[i - 1] < c)]
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())

  // pt1
  const incs = data.reduce(incReducer, [])
  console.log(incs.reduce(sumReducer, 0))

  //pt2
  const groups = createGroups(data)
  const sums = groups.map((g) => g.reduce(sumReducer, 0))
  const incs2 = sums.reduce(incReducer, [])
  console.log(incs2.reduce(sumReducer, 0))
}

export default main
