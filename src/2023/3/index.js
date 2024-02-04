const fs = require('fs');

const isNumber = (char) => {
    return !isNaN(char);
}

const isOnTheSameLine = (position, position2, lineLength) => {
    return Math.floor(position / lineLength) === Math.floor(position2 / lineLength);
}

const readInputFromFile = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n');
    const grid = lines.map(line => line.trim().split(''));
    return grid;
}

const parse = (grid, lineLength) => {

    const flatGrid = grid.flat();

    const symbols = []
    const numbers = []

    let start = null
    let end = null
    let value = ''

    for (const position in flatGrid) {

        const char = flatGrid[position];

        if (isNumber(char)) {
            if (start === null) {
                start = Number(position)
                value += char
            } else {
                if (isOnTheSameLine(start, position, lineLength)) {
                    value += char
                } else {
                    end = position - 1
                    numbers.push({ start, end, value })
                    start = Number(position)
                    end = null
                    value = char
                }
            }
        } else {
            if (start !== null) {
                end = position - 1
                numbers.push({ start, end, value })
                start = null
                end = null
                value = ''
            }
            if (char !== '.') {
                symbols.push({
                    start: Number(position),
                    end: Number(position),
                    value: char
                })
            }
        }
    }

    return [numbers, symbols]
}

const isAdjacentToSymbol = (number, symbols, lineLength) => {
    const { start, end } = number

    const line = Math.floor(start / lineLength)
    const columnRange = [start % lineLength, end % lineLength]

    for (const symbol of symbols) {
        const symbolLine = Math.floor(symbol.start / lineLength)
        const symbolColumn = symbol.start % lineLength

        // if there is more than 1 line difference, skip
        if (Math.abs(symbolLine - line) > 1) continue

        if (symbolLine === line) {
            // for same line just check left and right
            if (symbolColumn === columnRange[0] - 1 || symbolColumn === columnRange[1] + 1) {
                return true
            }
        } else {
            if (symbolColumn >= columnRange[0] - 1 && symbolColumn <= columnRange[1] + 1) {
                return true
            }
        }
    }

    return false
}

const isAdjacentTo2Numbers = (symbol, numbers, lineLength) => {
    
        const line = Math.floor(symbol.start / lineLength)
        const column = symbol.start % lineLength
    
        const adjacentNumbers = []

        for (const number of numbers) {
            const numberLine = Math.floor(number.start / lineLength)
            const numberColumnRange = [number.start % lineLength, number.end % lineLength]
    
            if (Math.abs(numberLine - line) > 1) continue

            if (numberLine === line) {
                if (column === numberColumnRange[0] - 1 || column === numberColumnRange[1] + 1) {
                    adjacentNumbers.push(number)
                }
            } else {
                if (column >= numberColumnRange[0] - 1 && column <= numberColumnRange[1] + 1) {
                    adjacentNumbers.push(number)
                }
            }
        }
    
        return [adjacentNumbers.length === 2, adjacentNumbers]
}

const calcGearRatio = (numbers) => {
    return Number(numbers[0].value) * Number(numbers[1].value);
}

function main() {
    const filename = 'data';
    const grid = readInputFromFile(filename);

    const lineLength = grid[0].length;

    const [numbers, symbols] = parse(grid, lineLength)

    let sum = 0

    for (const number of numbers) {
        console.log(number, isAdjacentToSymbol(number, symbols, lineLength))
        if (isAdjacentToSymbol(number, symbols, lineLength)) {
            sum += Number(number.value)
        }
    }

    console.log(sum)

    sum = 0

    for (const symbol of symbols) {
        const [isAdjacent, adjacentNumbers] = isAdjacentTo2Numbers(symbol, numbers, lineLength)
        if (isAdjacent) {
            sum += calcGearRatio(adjacentNumbers)
        }
    }

    console.log(sum)
}

main();
