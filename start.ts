import path from 'path'
const m = require(path.join(__dirname, 'src', process.argv[2], 'index.ts'))
m.default()
