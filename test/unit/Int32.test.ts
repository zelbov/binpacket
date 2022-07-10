import { expect } from 'chai'
import 'mocha'
import { Int32, parseBinary, serializeBinary } from 'binpacket'

describe('Int32 decorators testing', () => {

    class Foo {

        @Int32()
        int32!: number
    
        @Int32({ bigEndian: true })
        int32be!: number
    
        @Int32({ unsigned: true })
        uint32!: number
    
        @Int32({ unsigned: true, bigEndian: true })
        uint32be!: number
    
    }

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(16)

        buffer.writeInt32LE(42, 0)
        buffer.writeInt32BE(1337, 4)
        buffer.writeUint32LE(42, 8)
        buffer.writeUint32BE(1337, 12)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(obj.int32).eq(42)
        expect(obj.int32be).eq(1337)
        expect(obj.uint32).eq(42)
        expect(obj.uint32be).eq(1337)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(16)

        expect(buffer.readInt32LE(0)).eq(42)
        expect(buffer.readInt32BE(4)).eq(1337)
        expect(buffer.readUint32LE(8)).eq(42)
        expect(buffer.readUint32BE(12)).eq(1337)

    })

})