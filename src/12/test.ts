import { nextPossible } from './index'

describe('--- Day 12: Hill Climbing Algorithm ---', () => {
  test('next candidates', () => {
    let miniGrid = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]

    expect(nextPossible(miniGrid, [1, 1])).toHaveLength(3)

    miniGrid = [
      [1, 2],
      [1, 3],
      [1, 3],
    ]

    expect(nextPossible(miniGrid, [1, 0])).toHaveLength(2)
  })
})
