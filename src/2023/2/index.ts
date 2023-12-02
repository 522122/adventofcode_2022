import { readInput } from '../../../utils'

const sample = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

interface Cube {
  color: string
  n: number
}

type Set = Cube[]

type Game = Set[]

type Cond = Record<string, number>

const CON1: Cond = {
  red: 12,
  green: 13,
  blue: 14,
}

const getGameId = (line: string): [number, string] => {
  const [game, sets] = line.split(': ')
  const id = game.match(/\d+/g)?.[0] ?? 0
  return [Number(id), sets]
}

const getSets = (setsStr: string) => {
  const setsRaw = setsStr.split('; ')
  const sets = []
  for (const s of setsRaw) {
    const cubesRaw = s.split(', ')
    const cubes = []
    for (const cube of cubesRaw) {
      const [n, color] = cube.split(' ')
      cubes.push({
        n: Number(n),
        color,
      })
    }
    sets.push(cubes)
  }
  return sets
}

const parse = (line: string): [number, Game] => {
  const [gameId, setsStr] = getGameId(line)
  const sets = getSets(setsStr)
  return [gameId, sets]
}

const getCubesForColor = (set: Set, color: string) => {
  let sum = 0

  for (const cube of set) {
    if (cube.color === color) {
      sum += cube.n
    }
  }
  return sum
}

const getMinCubes = (game: Game) => {
  const foo: Record<string, number[]> = {
    red: [],
    green: [],
    blue: [],
  }
  for (const color of Object.keys(foo)) {
    for (const set of game) {
      foo[color].push(getCubesForColor(set, color))
    }
  }

  return {
    red: Math.max(...foo.red),
    green: Math.max(...foo.green),
    blue: Math.max(...foo.blue),
  }
}

const isGamePossible = (game: Game, conditions: Cond) => {
  for (const color of Object.keys(conditions)) {
    for (const set of game) {
      const nrOfCubes = getCubesForColor(set, color)
      if (nrOfCubes > conditions[color]) return false
    }
  }
  return true
}

const main = async () => {
  const str = readInput()
  // const str = sample

  const lines = str.split('\n')

  let sum = 0
  for (const l of lines) {
    const [id, game] = parse(l)
    const isPossible = isGamePossible(game, CON1)
    if (isPossible) sum += id
  }
  console.log(sum)

  sum = 0
  for (const l of lines) {
    const [id, game] = parse(l)
    const min = getMinCubes(game)
    const power = min.red * min.green * min.blue
    sum += power
  }

  console.log(sum)
}

export default main
