import fs from 'fs/promises'
import path from 'path'

const parse = (raw: string): [string, string[][]] => {
  const [template, _rules] = raw.split('\n\n')

  const rules = _rules.split('\n').map((r) => r.split(' -> '))

  return [template, rules]
}

const createMap = (template: string): Map<string, number> => {
  const map = new Map()
  for (let i = 0; i < template.length; i++) {
    const pair = template[i] + template[i + 1]
    map.set(pair, (map.get(pair) ?? 0) + 1)
  }
  return map
}

const createIterator = (template: string, rules: string[][]) => {
  const initialMap = createMap(template)
  return (n: number) => {
    let map = initialMap
    for (let i = 0; i < n; i++) {
      const m = new Map()
      map.forEach((value, key) => {
        const rule = rules.find((r) => r[0] === key)
        if (rule) {
          const np1 = key[0] + rule[1]
          const np2 = rule[1] + key[1]
          m.set(np1, (m.get(np1) ?? 0) + value)
          m.set(np2, (m.get(np2) ?? 0) + value)
        } else {
          m.set(key, value)
        }
      })
      map = m
    }

    return map
  }
}

const countElements = (map: Map<string, number>) => {
  const letterCount = new Map()
  map.forEach((value, key) => {
    letterCount.set(key[0], (letterCount.get(key[0]) ?? 0) + value)
  })

  return [Math.min(...letterCount.values()), Math.max(...letterCount.values())]
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data2'))

  const [template, rules] = parse(buffer.toString())

  const iterator = createIterator(template, rules)

  const [min, max] = countElements(iterator(10))
  console.log(max - min)

  const [min2, max2] = countElements(iterator(40))
  console.log(max2 - min2)
}

export default main
