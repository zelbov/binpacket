import { expect } from 'chai'
import 'mocha'
import { Int16, Int32, NestedBinary, parseBinary, serializeBinary } from '../../src'

describe('NestedBinary unit testing', () => {

    class Bar {

        @Int16()
        value!: number
    
    }
    
    class Foo {
    
        @Int32()
        baz!: number
    
        @NestedBinary({ type: Bar })
        bar!: Bar
    
    }

    let obj : Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(6)

        buffer.writeInt32LE(42, 0)
        buffer.writeInt16LE(1337, 4)

        console.log(buffer)

        obj = parseBinary(buffer, Foo)

        console.log(obj)

        expect(obj.baz).eq(42)
        expect(obj.bar).not.undefined
        expect(obj.bar.value).eq(1337)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        console.log(obj)

        const buffer = serializeBinary(obj)

        console.log(buffer)

        expect(buffer.readInt32LE(0)).eq(42)
        expect(buffer.readInt16LE(4)).eq(1337)

    })

})

