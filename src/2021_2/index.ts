import fs from 'fs/promises'
import path from 'path'

const sample = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

export const parse = (raw: string) => {
  return raw.split('\n')
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())
  // const data = parse(sample)

  let x = 0,
    y = 0,
    aim = 0,
    depth = 0

  for (let line of data) {
    const [direction, _n] = line.split(' ')
    const n = Number(_n)

    switch (direction) {
      case 'up':
        y -= n
        aim -= n
        break
      case 'down':
        y += n
        aim += n
        break
      case 'forward':
        x += n
        depth += aim * n
        break
    }
  }
  console.log(x * y, x * depth)
}

export default main
