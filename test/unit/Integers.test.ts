import { expect } from 'chai'
import 'mocha'
import { Int32, parseBinary, serializeBinary } from '../../src'

class Foo {

    @Int32()
    bar!: number

    @Int32()
    baz!: number

}

describe('Integers decorators testing', () => {

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(8)

        buffer.writeInt32LE(42, 0)
        buffer.writeInt32LE(1337, 4)

        console.log(buffer)

        obj = parseBinary(buffer, Foo)

        console.log(obj)

        expect(obj.bar).eq(42)
        expect(obj.baz).eq(1337)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        console.log(obj)

        const buffer = serializeBinary(obj)

        console.log(buffer)

        expect(buffer.length).eq(8)
        expect(buffer.readInt32LE(0)).eq(42)
        expect(buffer.readInt32LE(4)).eq(1337)

    })

})