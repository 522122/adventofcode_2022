import fs from 'fs'
import path from 'path'

export const readInput = (name: string = 'data') => {
  return fs
    .readFileSync(path.join(__dirname, 'src', process.argv[2], name))
    .toString()
}

type TraverseCallback<T> = (value: T, i: number, j: number) => void
export const traverse = <T>(arr: T[][], callback: TraverseCallback<T>) => {
  for (let i in arr) {
    for (let j in arr[i]) {
      callback(arr[i][j], Number(i), Number(j))
    }
  }
}

export const debugLog = (...val: any) => {
  if (process.env.DEBUG) {
    console.log(...val)
  }
}
