//@ts-ignore pass argv from karma into execution context
process.argv = __karma__.config.args

// load UMD module for using in a browser
require('../../umd/binpacket.js')

const req = require.context('../unit', true, /\.test\.ts$/)
req.keys().forEach(req);