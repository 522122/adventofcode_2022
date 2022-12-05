import { parse, partOne, partTwo } from './index'

const sampleData = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

describe('--- Day 1: Calorie Counting ---', () => {
  const data = parse(sampleData)

  test('part one', () => {
    expect(data[0].calories).toBe(6000)
    expect(data[1].calories).toBe(4000)
    expect(data[2].calories).toBe(11000)
    expect(data[3].calories).toBe(24000)
    expect(data[4].calories).toBe(10000)
    expect(partOne(data).calories).toBe(24000)
  })

  test('part two', () => {
    expect(partTwo(data).total).toBe(45000)
  })
})
