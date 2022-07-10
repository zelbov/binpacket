import { expect } from 'chai'
import 'mocha'
import { Int16, parseBinary, serializeBinary } from 'binpacket'

describe('Int16 decorators testing', () => {

    class Foo {

        @Int16()
        int16!: number
    
        @Int16({ bigEndian: true })
        int16be!: number
    
        @Int16({ unsigned: true })
        uint16!: number
    
        @Int16({ unsigned: true, bigEndian: true })
        uint16be!: number
    
    }
    

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(8)

        buffer.writeInt16LE(42, 0)
        buffer.writeInt16BE(1337, 2)
        buffer.writeUint16LE(42, 4)
        buffer.writeUint16BE(1337, 6)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(obj.int16).eq(42)
        expect(obj.int16be).eq(1337)
        expect(obj.uint16).eq(42)
        expect(obj.uint16be).eq(1337)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(8)

        expect(buffer.readInt16LE(0)).eq(42)
        expect(buffer.readInt16BE(2)).eq(1337)
        expect(buffer.readUint16LE(4)).eq(42)
        expect(buffer.readUint16BE(6)).eq(1337)

    })

})