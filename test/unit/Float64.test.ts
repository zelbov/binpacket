import { expect } from 'chai'
import 'mocha'
import { Float64, parseBinary, serializeBinary } from '../../src'

describe('Float64 unit tests', () => {

    class Foo {

        @Float64()
        bar!: number

        @Float64({ bigEndian: true })
        baz!: number

    }

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(16)

        buffer.writeDoubleLE(1.337, 0)
        buffer.writeDoubleBE(1.377, 8)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(obj.bar).eq(1.337)
        expect(obj.baz).eq(1.377)

    })

    it('Transform object back to binary: should produce identical buffer of the same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(16)
        expect(buffer.readDoubleLE(0)).eq(1.337)
        expect(buffer.readDoubleBE(8)).eq(1.377)

    })

})