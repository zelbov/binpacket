import { expect } from 'chai'
import 'mocha'
import { Int64, parseBinary, serializeBinary } from 'binpacket'

describe('Int64 decorators testing', () => {

    class Foo {

        @Int64()
        int64!: number
    
        @Int64({ bigEndian: true })
        int64be!: number
    
        @Int64({ unsigned: true })
        uint64!: number
    
        @Int64({ unsigned: true, bigEndian: true })
        uint64be!: number
    
    }

    let obj: Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(32)

        buffer.writeBigInt64LE(42n, 0)
        buffer.writeBigInt64BE(1337n, 8)
        buffer.writeBigUint64LE(42n, 16)
        buffer.writeBigUint64BE(1337n, 24)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(obj.int64).eq(42n)
        expect(obj.int64be).eq(1337n)
        expect(obj.uint64).eq(42n)
        expect(obj.uint64be).eq(1337n)

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(32)

        expect(buffer.readBigInt64LE(0)).eq(42n)
        expect(buffer.readBigInt64BE(8)).eq(1337n)
        expect(buffer.readBigUint64LE(16)).eq(42n)
        expect(buffer.readBigUint64BE(24)).eq(1337n)

    })

})