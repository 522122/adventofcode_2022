import fs from 'fs/promises'
import path from 'path'

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
}

export default main
