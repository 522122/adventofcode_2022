import fs from 'fs/promises'
import path from 'path'

interface Elf {
  id: number
  food: number[]
  calories: number
}

const createElf = (id = 0): Elf => {
  return {
    id,
    food: [],
    calories: 0,
  }
}

const sortFn = (a: Elf, b: Elf) => {
  return b.calories - a.calories
}

export const partOne = (elfs: Elf[]) => {
  const elf = [...elfs].sort(sortFn)[0]
  return elf
}

export const partTwo = (elfs: Elf[]) => {
  const topElfs = [...elfs].sort(sortFn).slice(0, 3)

  return {
    elfs: topElfs,
    total: topElfs.reduce((a, c) => {
      return a + c.calories
    }, 0),
  }
}

export const parse = (raw: string) => {
  const data = raw.split('\n')

  let elfRef = createElf()
  const elfs = [elfRef]

  for (let line of data) {
    if (line === '') {
      elfRef = createElf(elfRef.id + 1)
      elfs.push(elfRef)
      continue
    }

    const calories = Number(line)

    elfRef.food.push(calories)
    elfRef.calories += calories
  }

  return elfs
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const elfs = parse(buffer.toString())

  console.log(partOne(elfs))
  console.log(partTwo(elfs))
}

export default main
