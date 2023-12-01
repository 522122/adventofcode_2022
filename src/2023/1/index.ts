import { readInput } from '../../../utils'

const sample = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

const M: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
}

const getDigits = (line: string) => {
  const indexes = []

  for (const lookingFor of Object.keys(M)) {
    const firstIndex = line.indexOf(lookingFor)
    const lastIndex = line.lastIndexOf(lookingFor)
    if (firstIndex !== -1) {
      indexes.push({
        value: M[lookingFor],
        index: firstIndex,
      })
      if (firstIndex !== lastIndex) {
        indexes.push({
          value: M[lookingFor],
          index: lastIndex,
        })
      }
    }
  }

  indexes.sort((a, b) => a.index - b.index)

  return Number(`${indexes.at(0)?.value}${indexes.at(-1)?.value}`)
}

const main = async () => {
  const str = readInput()
  // const str = sample

  const lines = str.split('\n')

  const numbers = lines.map(getDigits)

  console.log(numbers.reduce((sum, c) => sum + c, 0))
}

export default main
