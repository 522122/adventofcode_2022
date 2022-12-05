import { parse, calcRoundPoints, PT1, PT2, totalScore } from './index'

const sampleData = `A Y
B X
C Z`

describe('--- Day 2: Rock Paper Scissors ---', () => {
  const data = parse(sampleData)

  test('part one', () => {
    expect(calcRoundPoints(data[0], PT1)).toBe(8)
    expect(calcRoundPoints(data[1], PT1)).toBe(1)
    expect(calcRoundPoints(data[2], PT1)).toBe(6)
    expect(totalScore(data, PT1)).toBe(15)
  })

  test('part two', () => {
    expect(calcRoundPoints(data[0], PT2)).toBe(4)
    expect(calcRoundPoints(data[1], PT2)).toBe(1)
    expect(calcRoundPoints(data[2], PT2)).toBe(7)
    expect(totalScore(data, PT2)).toBe(12)
  })
})
