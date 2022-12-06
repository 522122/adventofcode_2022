import fs from 'fs/promises'
import path from 'path'

const parse = (raw: string) => {
  return raw.split(',').map(Number)
}

const getFuelCost1 = (a: number, b: number) => {
  return Math.abs(a - b)
}

const getFuelCost2 = (a: number, b: number) => {
  const dist = Math.abs(a - b)
  let cost = 0
  for (let i = 1; i <= dist; i++) {
    cost += i
  }
  return cost
}

const brutForce = (
  pos: number[],
  costCalc: (a: number, b: number) => number
) => {
  const results: number[] = []
  const min = Math.min(...pos)
  const max = Math.max(...pos)

  for (let i = min; i < max; i++) {
    let dist = 0
    pos.forEach((p) => {
      dist += costCalc(i, p)
    })

    results.push(dist)
  }

  return results.sort((a, b) => a - b)
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))

  const data = parse(buffer.toString())

  console.log(brutForce(data, getFuelCost1))
  console.log(brutForce(data, getFuelCost2))
}

export default main
