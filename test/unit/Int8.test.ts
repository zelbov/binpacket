import { expect } from 'chai'
import 'mocha'
import { Int8, parseBinary, serializeBinary } from '../../src'

describe('Int8 decorators testing', () => {

    class Foo {

        @Int8()
        int8!: number
    
        @Int8({ unsigned: true })
        uint8!: number
    
    }    

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(2)

        buffer.writeInt8(42, 0)
        buffer.writeUint8(255, 1)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(obj.int8).eq(42)
        expect(obj.uint8).eq(255)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(2)

        expect(buffer.readInt8(0)).eq(42)
        expect(buffer.readUint8(1)).eq(255)

    })

})