import { expect } from 'chai'
import 'mocha'
import { Float32, parseBinary, serializeBinary } from '../../src'

describe('Float32 unit tests', () => {

    class Foo {

        @Float32()
        bar!: number

        @Float32({ bigEndian: true })
        baz!: number

    }

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(8)

        buffer.writeFloatLE(1.337, 0)
        buffer.writeFloatBE(1.377, 4)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        // Since provided numbers are the actual double-precision numbers (64bit) in JS,
        // we should compare their single-precision representation (32bit)
        // using Math.fround() for conversion
        expect(obj.bar).eq(Math.fround(1.337))
        expect(obj.baz).eq(Math.fround(1.377))

    })

    it('Transform object back to binary: should produce identical buffer of the same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(8)
        expect(buffer.readFloatLE(0)).eq(Math.fround(1.337))
        expect(buffer.readFloatBE(4)).eq(Math.fround(1.377))

    })

})