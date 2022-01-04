const path = require('path')
 
require('ts-node').register()
module.exports = require(path.resolve(__dirname, './server.ts'))
