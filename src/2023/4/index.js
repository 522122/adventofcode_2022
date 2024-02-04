const fs = require('fs');

const readInputFromFile = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const lines = content.split('\n');
  
  const cards = new Map()
  let cardNumber = 1;
  const regex = /^Card\s*\d+:\s*/;

  for (const line of lines) {
    const cleanLine = line.replace(regex, '');
    const [winningNumbers, numbers] = cleanLine.split(' | ')
    cards.set(cardNumber, {
      winningNumbers: new Set(winningNumbers.split(/\s+/).map(Number)),
      numbers: new Set(numbers.split(/\s+/).map(Number))
    });

    cardNumber++
  
  }

  return cards;
}

const getMatchingWinningNumbers = (card) => {
  const matching = new Set()
  for (const number of card.winningNumbers.values()) {
    if (card.numbers.has(number)) {
      matching.add(number)
    }
  }
  return matching
}

const getCardWorth = (card) => {
  const matching = getMatchingWinningNumbers(card)
  return matching.size === 0 ? 0 : Math.pow(2, matching.size - 1)
}

const stringify = (set) => {
  return [...set.values()].join(', ')
}

const cache = new Map()

const repeat = (key, n, cards, start, tmpStart) => {
  let x = 0

  if (cache.has(`${start}:${tmpStart}`)) {
    return cache.get(`${start}:${tmpStart}`)
  }

  for (let i=1; i<n + 1; i++) {
    console.log('winning',  key + i, 'start', start, tmpStart)
    const tmpCard = cards.get(key + i)
     tmpWinning = getMatchingWinningNumbers(tmpCard).size
     x += 1
     x += repeat(key + i, tmpWinning, cards, start, key + i)
   }

   cache.set(`${start}:${tmpStart}`, x)
   return x
}

const part2 = (card, cards, start) => {
  const winning = getMatchingWinningNumbers(card[1]).size
  return repeat(Number(card[0]), winning, cards, start, start)
}

function main() {
  const filename = 'data';
  const cards = readInputFromFile(filename);

  let totalWorth = 0
  for (let [key, value] of cards) {
    console.log(`- Card ${key} is worth ${getCardWorth(value)} points. [${stringify(getMatchingWinningNumbers(value))}]`)
    totalWorth += getCardWorth(value)
  }
  console.log(totalWorth)

  let sum = 0
  for (let card of cards) {
    sum += part2(card, cards, card[0], card[0])
  }
  console.log(sum + cards.size)

  // 11827296

}

main();
