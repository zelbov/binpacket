if(!window.Buffer) {
    window.Buffer = require('buffer').Buffer
    require('./UIntEndiannessFix')
}

export default window.Buffer