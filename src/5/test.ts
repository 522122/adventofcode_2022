import { parseInstruction, parseCrates, partOne, partTwo, parse } from './index'
const sampleData = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

describe('--- Day 5: Supply Stacks ---', () => {
  let data: any
  beforeEach(() => {
    data = parse(sampleData)
  })
  test('parse instructions', () => {
    expect(parseInstruction('move 1 from 2 to 1')).toEqual({
      n: 1,
      from: 1,
      to: 0,
    })
    expect(parseInstruction('move 12 from 1 to 30')).toEqual({
      n: 12,
      from: 0,
      to: 29,
    })
  })

  test('parse crates', () => {
    expect(parseCrates('    [D]    ')).toEqual(['', '[D]', ''])
    expect(parseCrates('[N] [C]    ')).toEqual(['[N]', '[C]', ''])
  })

  test('part one', () => {
    expect(partOne(data[0], data[1])).toBe('CMZ')
  })
  test('part two', () => {
    expect(partTwo(data[0], data[1])).toBe('MCD')
  })
})
