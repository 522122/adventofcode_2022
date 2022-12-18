import { readInput } from '../../utils'

const sample = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`

type Coords = [number, number, number]

class Cube {
  x: number
  y: number
  z: number
  air: boolean
  constructor(x: number, y: number, z: number, air: boolean = false) {
    this.x = x
    this.y = y
    this.z = z
    this.air = air
  }
  getNeighborsCoordinates(): Coords[] {
    return [
      [this.x - 1, this.y, this.z],
      [this.x, this.y - 1, this.z],
      [this.x, this.y, this.z - 1],
      [this.x + 1, this.y, this.z],
      [this.x, this.y + 1, this.z],
      [this.x, this.y, this.z + 1],
    ]
  }

  hasCoords([x, y, z]: Coords) {
    return this.x === x && this.y === y && this.z === z
  }

  isTrapped(grid: Cube[]) {
    const { x, y, z } = getMinMax(grid)

    const trappedZ: any[] = [null, null]
    for (let i = this.z; i <= z[1]; i++) {
      if (grid.some((c) => c.hasCoords([this.x, this.y, i]))) {
        trappedZ[0] = i
        break
      }
    }

    for (let i = z[0]; i < this.z; i++) {
      if (grid.some((c) => c.hasCoords([this.x, this.y, i]))) {
        trappedZ[1] = i
        break
      }
    }

    const isTrappedZ = trappedZ[0] != null && trappedZ[1] != null
    if (!isTrappedZ) return false

    const trappedX: any[] = [null, null]
    for (let i = this.x; i <= x[1]; i++) {
      if (grid.some((c) => c.hasCoords([i, this.y, this.z]))) {
        trappedX[0] = i
        break
      }
    }

    for (let i = x[0]; i < this.x; i++) {
      if (grid.some((c) => c.hasCoords([i, this.y, this.z]))) {
        trappedX[1] = true
        break
      }
    }

    const isTrappedX = trappedX[0] != null && trappedX[1] != null
    if (!isTrappedX) return false

    const trappedY: any[] = [null, null]
    for (let i = this.y; i <= y[1]; i++) {
      if (grid.some((c) => c.hasCoords([this.x, i, this.z]))) {
        trappedY[0] = i
        break
      }
    }

    for (let i = y[0]; i < this.y; i++) {
      if (grid.some((c) => c.hasCoords([this.x, i, this.z]))) {
        trappedY[1] = i
        break
      }
    }

    const isTrappedY = trappedY[0] != null && trappedY[1] != null

    const isTrapped = isTrappedX && isTrappedY && isTrappedZ

    if (this.x === 6 && this.y === 7 && this.z === 3) {
      console.log(isTrappedX, isTrappedY, isTrappedZ)
    }

    return isTrapped
  }

  freeSides(grid: Cube[]) {
    return this.getNeighborsCoordinates().reduce((a: number, neigh) => {
      return a + Number(grid.every((c) => !c.hasCoords(neigh)))
    }, 0)
  }
}

const getMinMax = (grid: Cube[]) => {
  const x = grid.map((c) => c.x)
  const y = grid.map((c) => c.y)
  const z = grid.map((c) => c.z)

  const minX = Math.min(...x)
  const maxX = Math.max(...x)

  const minY = Math.min(...y)
  const maxY = Math.max(...y)

  const minZ = Math.min(...z)
  const maxZ = Math.max(...z)

  return {
    x: [minX, maxX],
    y: [minY, maxY],
    z: [minZ, maxZ],
  }
}

const getAirCubes = (grid: Cube[]) => {
  const { x, y, z } = getMinMax(grid)

  const airCubes: Cube[] = []

  for (let j = x[0]; j <= x[1]; j++) {
    for (let k = y[0]; k <= y[1]; k++) {
      for (let l = z[0]; l <= z[1]; l++) {
        if (grid.some((c) => c.hasCoords([j, k, l]))) continue
        airCubes.push(new Cube(j, k, l, true))
      }
    }
  }

  return airCubes
}

const main = async () => {
  // const str = sample
  const str = readInput()
  const grid = str
    .split('\n')
    .map((c) => c.split(',').map(Number) as [number, number, number])
    .map((c) => new Cube(...c))

  let fs = grid.reduce((fs, c) => {
    return fs + c.freeSides(grid)
  }, 0)

  console.log(fs)

  // isTrapped is kind of bad so need to filter leftovers airs with freeSides > 0
  const trappedAirCubes = getAirCubes(grid).filter((c) => c.isTrapped(grid))

  const finalGrid = [...grid, ...trappedAirCubes].filter((c, i, a) => {
    if (c.air && c.freeSides(a) > 0) {
      console.log(c)
      return false
    }
    return true
  })

  fs = finalGrid.reduce((fs, c, i, a) => {
    return fs + c.freeSides(a)
  }, 0)

  console.log(fs)
}

export default main

// 3326 your answer is too high
// 2834 your answer is too high

// 2048 your answer is too low
