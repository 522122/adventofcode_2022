import {
  parse,
  commonItem,
  commonItem2,
  rateItem,
  partOne,
  partTwo,
} from './index'

const sampleData = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

describe('--- Day 3: Rucksack Reorganization ---', () => {
  const data = parse(sampleData)

  test('parsing bags', () => {
    expect(data[0][0]).toBe('vJrwpWtwJgWr')
    expect(data[0][1]).toBe('hcsFMMfFFhFp')
    expect(commonItem(data[0])).toBe('p')

    expect(data[1][0]).toBe('jqHRNqRjqzjGDLGL')
    expect(data[1][1]).toBe('rsFMfFZSrLrFZsSL')
    expect(commonItem(data[1])).toBe('L')
    expect(commonItem(data[2])).toBe('P')
    expect(commonItem(data[3])).toBe('v')

    expect(commonItem2([data[0], data[1], data[2]])).toBe('r')
    expect(commonItem2([data[3], data[4], data[5]])).toBe('Z')
  })

  test('scoring items', () => {
    expect(rateItem('a')).toBe(1)
    expect(rateItem('z')).toBe(26)
    expect(rateItem('A')).toBe(27)
    expect(rateItem('Z')).toBe(52)
  })

  test('part one', () => {
    expect(partOne(data)).toBe(157)
  })

  test('part two', () => {
    expect(partTwo(data)).toBe(70)
  })
})
