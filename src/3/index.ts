import fs from 'fs/promises'
import path from 'path'

type Bag = [string, string]
type Group = [Bag, Bag, Bag]

export const commonItem = (bag: Bag) => {
  for (let i = 0; i < bag[0].length; i++) {
    if (bag[1].includes(bag[0][i])) return bag[0][i]
  }
}

export const commonItem2 = (group: Group) => {
  const charSet = [...new Set([...group.flat().join('')])]

  for (let i = 0; i < charSet.length; i++) {
    if (
      group[0].join('').includes(charSet[i]) &&
      group[1].join('').includes(charSet[i]) &&
      group[2].join('').includes(charSet[i])
    ) {
      return charSet[i]
    }
  }
}

export const rateItem = (item: string | undefined) => {
  if (item == null) return 0
  const rate = item.charCodeAt(0) - 96
  if (rate > 0) return rate
  return rate + 58
}

export const parse = (raw: string): Bag[] => {
  return raw
    .toString()
    .split('\n')
    .map((l) => [l.substring(0, l.length / 2), l.substring(l.length / 2)])
}

export const rateCommonItem = (bag: Bag) => rateItem(commonItem(bag))
export const rateCommonItem2 = (group: Group) => rateItem(commonItem2(group))

const breakGroups = (bags: Bag[]) => {
  const groups: Group[] = []
  for (let groupIndex = 0; groupIndex < bags.length / 3; groupIndex++) {
    const index = groupIndex * 3
    groups.push([bags[index], bags[index + 1], bags[index + 2]])
  }
  return groups
}

export const partOne = (bags: Bag[]) =>
  bags.reduce((a, c) => a + rateCommonItem(c), 0)

export const partTwo = (bags: Bag[]) =>
  breakGroups(bags).reduce((a, c) => a + rateCommonItem2(c), 0)

const main = async () => {
  const buffer = await fs.readFile(path.join(__dirname, 'data'))
  const data = parse(buffer.toString())

  console.log(partOne(data))
  console.log(partTwo(data))
}

export default main
