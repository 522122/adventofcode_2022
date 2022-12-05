import { parse, contains, partOne, partTwo, overlap } from './index'

const sampleData = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`

describe('--- Day 4: Camp Cleanup ---', () => {
  const data = parse(sampleData)

  test('part one', () => {
    expect(contains(data[0])).toBeFalsy()
    expect(contains(data[1])).toBeFalsy()
    expect(contains(data[2])).toBeFalsy()
    expect(contains(data[3])).toBeTruthy()
    expect(contains(data[4])).toBeTruthy()
    expect(contains(data[5])).toBeFalsy()

    expect(partOne(data)).toBe(2)
  })

  test('part two', () => {
    expect(overlap(data[0])).toBeFalsy()
    expect(overlap(data[1])).toBeFalsy()
    expect(overlap(data[2])).toBeTruthy()
    expect(overlap(data[3])).toBeTruthy()
    expect(overlap(data[4])).toBeTruthy()
    expect(overlap(data[5])).toBeTruthy()

    expect(overlap([1, 3, 2, 4])).toBeTruthy()
    expect(overlap([2, 4, 1, 3])).toBeTruthy()

    expect(partTwo(data)).toBe(4)
  })
})
