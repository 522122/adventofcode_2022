import fs from 'fs/promises'
import path from 'path'

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))

  const data = buffer.toString()

  let substr = ''
  let substr2 = ''
  let pt1Done = false
  let pt2Done = false

  for (let i = 0; i < data.length; i++) {
    if (data[i] == null || (pt1Done && pt2Done)) break

    if (!pt1Done) {
      substr += data[i]

      if (substr.length > 4) {
        substr = substr.substring(1)
      }

      if (substr.length === 4 && [...new Set(substr)].length === 4) {
        console.log(`pt1: ${i + 1}`)
        pt1Done = true
      }
    }

    if (!pt2Done) {
      substr2 += data[i]

      if (substr2.length > 14) {
        substr2 = substr2.substring(1)
      }

      if (substr2.length === 14 && [...new Set(substr2)].length === 14) {
        console.log(`pt2: ${i + 1}`)
        pt2Done = true
      }
    }
  }

  const test = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'
  let subTest = ''
  for (let i = 0; i < test.length; i++) {
    subTest += test[i]

    if (subTest.length > 14) {
      subTest = subTest.substring(1)
    }

    if (subTest.length === 14 && [...new Set(subTest)].length === 14) {
      console.log(`pt2 test: ${i + 1}`)
      break
    }
  }
}

export default main
