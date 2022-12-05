import fs from 'fs/promises'
import path from 'path'

enum OUTCOME {
  LOST = 0,
  DRAW = 3,
  WON = 6,
}

enum SHAPE {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

// const OP: { [key: string]: SHAPE } = {
//   A: SHAPE.ROCK,
//   B: SHAPE.PAPER,
//   C: SHAPE.SCISSORS,
// };

interface GameConfig {
  ME: (round: string) => SHAPE
  GAME_CONDITIONS: { [key: string]: OUTCOME }
}

export const PT1: GameConfig = {
  ME(round: string) {
    switch (round[2]) {
      case 'X':
        return SHAPE.ROCK
      case 'Y':
        return SHAPE.PAPER
      case 'Z':
        return SHAPE.SCISSORS
      default:
        return SHAPE.PAPER
    }
  },

  GAME_CONDITIONS: {
    'A X': OUTCOME.DRAW,
    'B Y': OUTCOME.DRAW,
    'C Z': OUTCOME.DRAW,
    'A Z': OUTCOME.LOST,
    'B X': OUTCOME.LOST,
    'C Y': OUTCOME.LOST,
    'A Y': OUTCOME.WON,
    'B Z': OUTCOME.WON,
    'C X': OUTCOME.WON,
  },
}

export const PT2: GameConfig = {
  ME(round: string) {
    switch (round[2]) {
      case 'X':
        if (round[0] === 'A') return SHAPE.SCISSORS
        if (round[0] === 'B') return SHAPE.ROCK
        if (round[0] === 'C') return SHAPE.PAPER
      case 'Y':
        if (round[0] === 'A') return SHAPE.ROCK
        if (round[0] === 'B') return SHAPE.PAPER
        if (round[0] === 'C') return SHAPE.SCISSORS
      case 'Z':
        if (round[0] === 'A') return SHAPE.PAPER
        if (round[0] === 'B') return SHAPE.SCISSORS
        if (round[0] === 'C') return SHAPE.ROCK
      default:
        return SHAPE.PAPER
    }
  },

  GAME_CONDITIONS: {
    'A Z': OUTCOME.WON,
    'B Z': OUTCOME.WON,
    'C Z': OUTCOME.WON,

    'A X': OUTCOME.LOST,
    'B X': OUTCOME.LOST,
    'C X': OUTCOME.LOST,

    'A Y': OUTCOME.DRAW,
    'B Y': OUTCOME.DRAW,
    'C Y': OUTCOME.DRAW,
  },
}

export const calcRoundPoints = (round: string, gameConfig: GameConfig) => {
  return gameConfig.GAME_CONDITIONS[round] + gameConfig.ME(round)
}

export const totalScore = (data: string[], gameConfig: GameConfig) => {
  return data.reduce((a, c) => {
    return a + calcRoundPoints(c, gameConfig)
  }, 0)
}

export const parse = (raw: string) => {
  return raw.toString().split('\n')
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())

  console.log(totalScore(data, PT1))
  console.log(totalScore(data, PT2))
}

export default main
