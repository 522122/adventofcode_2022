import fs from 'fs/promises'
import path from 'path'

const createChecker = (str: string) => (size: number) => {
  for (let i = 0; i < str.length; i++) {
    if ([...new Set(str.substring(i, i + size))].length === size) {
      return i + size
    }
  }
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))

  const check = createChecker(buffer.toString())

  console.log(check(4))
  console.log(check(14))
}

export default main
