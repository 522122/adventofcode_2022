import path from 'path'
if (process.argv[3] === 'debug') {
  process.env.DEBUG = 'true'
}
const m = require(path.join(__dirname, 'src', process.argv[2], 'index.ts'))
m.default()
