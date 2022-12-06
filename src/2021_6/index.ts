import fs from 'fs/promises'
import path from 'path'

const sample = `3,4,3,1,2`

export const parse = (raw: string) => {
  return initMap(raw.split(',').map(Number))
}

const nextDay = (day: Map<number, number>) => {
  new Map(day).forEach((val, key) => {
    const nkey = key - 1
    if (val === 0) return
    if (key === 0) {
      day.set(8, (day.get(8) ?? 0) + val)
      day.set(6, (day.get(6) ?? 0) + val)
      day.set(0, (day.get(0) ?? 0) - val)
    } else {
      day.set(key, (day.get(key) ?? 0) - val)
      day.set(nkey, (day.get(nkey) ?? 0) + val)
    }
  })
}

const initMap = (day: number[]) => {
  const m = new Map()
  day.forEach((d) => {
    m.set(d, (m.get(d) ?? 0) + 1)
  })
  return m
}

const sumDay = (day: Map<number, number>) => {
  return [...day.values()].reduce((a, c) => a + c, 0)
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())

  // const data = parse(sample)

  for (let i = 0; i < 256; i++) {
    if (i === 80) {
      console.log(sumDay(data))
    }
    nextDay(data)
  }
  console.log(sumDay(data))
}

export default main
