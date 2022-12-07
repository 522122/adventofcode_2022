import fs from 'fs/promises'
import path from 'path'

const sample = ``

type FileType = 'file' | 'directory'

class Node {
  type: FileType
  _size: number = 0
  name: string
  children: Node[] = []
  parent: Node | null = null

  constructor(raw: string) {
    const split = raw.split(' ')
    this.name = split[1]
    if (split[0] === 'dir') {
      this.type = 'directory'
    } else {
      this.type = 'file'
      this._size = Number(split[0])
    }
  }

  path(): string {
    if (this.parent) {
      return this.parent.path() + '/' + this.name
    } else {
      return ''
    }
  }

  addChild(n: Node) {
    n.parent = this
    this.children.push(n)
  }

  get size(): number {
    if (this.type === 'file') {
      return this._size
    } else {
      return this.children.reduce((a, c) => a + c.size, 0)
    }
  }
}

const isCommand = (raw: string) => {
  return raw[0] === '$'
}

export const parse = (raw: string): [Map<string, Node>, Node] => {
  const nodesFlat: Map<string, Node> = new Map()
  const root = new Node('dir /')
  let cd: Node | null = root

  const data = raw.split('\n')

  for (let stdout of data) {
    if (stdout === '$ cd /') continue

    if (isCommand(stdout)) {
      const split = stdout.split(' ')
      if (split[1] === 'cd') {
        if (split[2] === '..') {
          cd = cd ? cd.parent : root
        } else {
          // assuming we listed directory before
          cd = nodesFlat.get(cd?.path() + '/' + split[2]) as Node
        }
      } else if (split[1] === 'ls') {
        continue
      }
    } else {
      const n = new Node(stdout)
      cd?.addChild(n)
      const path = n.path()

      if (nodesFlat.has(path)) {
        console.log('DUPLICATE NODE', path)
      }
      nodesFlat.set(path, n)
    }
  }
  return [nodesFlat, root]
}

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const [flat, root] = parse(buffer.toString())

  const dirs = [...flat.values()].filter((n) => n.type === 'directory')

  const dirSizes = dirs
    .map((n) => n.size)
    .filter((size) => size <= 100000)
    .reduce((a, c) => a + c, 0)

  console.log(dirSizes)

  const TOTAL_DISK_SPACE = 70000000
  const NEEDED_SPACE = 30000000

  const totalUsedSpace = root.size

  const freeSpace = TOTAL_DISK_SPACE - totalUsedSpace
  const needToFree = NEEDED_SPACE - freeSpace

  const bigEnoughDirs = dirs
    .filter((d) => d.size >= needToFree)
    .map((d) => d.size)
    .sort((a, b) => a - b)

  console.log(bigEnoughDirs[0])
}

export default main
