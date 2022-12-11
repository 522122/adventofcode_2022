import fs from 'fs/promises'
import path from 'path'
import D from 'decimal.js'

// [23, 19, 13, 17]

const sample = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`

export const parse = (raw: string) => {
  return raw.split('\n\n')
}

class Monkey {
  id: string
  items: D[] = []
  operation: [string, 'add' | 'mul', string]
  inspectedItems: number = 0
  test: number
  throwTo: {
    true: string
    false: string
  } = {
    true: '',
    false: '',
  }
  constructor(input: string) {
    const raw = input.split('\n')
    this.id = raw[0].replace(':', '').toLocaleLowerCase()
    this.items = raw[1]
      .trim()
      .split('Starting items: ')[1]
      .split(', ')
      .map((n) => new D(n))
    this.operation = raw[2]
      .trim()
      .split('Operation: new = ')[1]
      .replace('+', 'add')
      .replace('*', 'mul')
      .split(' ') as [string, 'add' | 'mul', string]
    this.test = Number(raw[3].trim().split('Test: divisible by ')[1])
    this.throwTo.true = raw[4].trim().split('If true: throw to ')[1]
    this.throwTo.false = raw[5].trim().split('If false: throw to ')[1]
  }

  inspectItem(worryCalc: (n: D) => D): [D, string] {
    const item = this.items.shift() as D

    const worryLevel = worryCalc(
      new D(this.operation[0] === 'old' ? item : this.operation[0])[
        this.operation[1]
      ](this.operation[2] === 'old' ? item : this.operation[2])
    )

    const modulo = worryLevel.modulo(this.test)

    ++this.inspectedItems
    return [
      worryLevel,
      this.throwTo[modulo.eq(0).toString() as 'true' | 'false'],
    ]
  }
}

const play = (rounds: number, monkeys: Monkey[], worryCalc: (n: D) => D) => {
  while (rounds) {
    --rounds
    monkeys.forEach((M) => {
      while (M.items.length) {
        const ii = M.inspectItem(worryCalc)
        monkeys.find((m) => m.id === ii[1])?.items.push(ii[0])
      }
    })
  }
}

const part1 = (data: string[]) => {
  const MS = data.map((d) => new Monkey(d))

  play(20, MS, (n) => n.div(3).floor())

  const sortedByInspectedItems = [...MS]
    .map((m) => m.inspectedItems)
    .sort((a, b) => b - a)

  console.log(sortedByInspectedItems[0] * sortedByInspectedItems[1])
}

const part2 = (data: string[]) => {
  const MS = data.map((d) => new Monkey(d))

  const lcm = MS.reduce((a, c) => a.mul(c.test), new D(1))

  play(10000, MS, (n) => n.mod(lcm))

  const sortedByInspectedItems = [...MS]
    .map((m) => m.inspectedItems)
    .sort((a, b) => b - a)

  console.log(sortedByInspectedItems[0] * sortedByInspectedItems[1])
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())
  // const data = parse(sample)

  part1(data)
  part2(data)
}

export default main

// 2713310158
