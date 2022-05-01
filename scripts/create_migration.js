const fs = require('fs')
const path = require('path')

const fileName = Date.now()

const template = `module.exports = [

];
`

const filePath = path.join(__dirname, `/../migrations/${fileName}.js`)

fs.writeFileSync(filePath, template);

process.exit(0);