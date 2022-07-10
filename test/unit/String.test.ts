import { expect } from 'chai'
import 'mocha'
import { BinaryString, parseBinary, serializeBinary } from 'binpacket'

describe('String decorators support', () => {

    class Foo {

        @BinaryString()
        bar!: string 

        @BinaryString({ size: 8 })
        baz!: string

        @BinaryString({ bigEndian: true })
        bax!: string

        @BinaryString({ size: 8, bigEndian: true })
        bazz!: string

    }

    let obj : Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(24)

        buffer.write('bar\x00', 'utf-8') // 3-character string plus zero byte terminator -> 4 bytes
        buffer.write('baz', 4, 8, 'utf-8') // 8-character static size string
        buffer.write('xab\x00', 12, 'utf-8') // 3-character big endian string plus zero byte terminator -> 4 bytes
        buffer.write('zzab', 16, 8, 'utf-8') // 8-character big endian static size string
        // total: 12 bytes

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        expect(len).eq(24)

        expect(obj.bar).eq('bar')
        expect(obj.baz).eq('baz')
        expect(obj.bax).eq('bax')
        expect(obj.bazz).eq('bazz')

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(24)
        
        expect(buffer.toString('utf-8', 0, 3)).eq('bar')
        expect(buffer.readUInt8(3)).eq(0)
        expect(buffer.toString('utf-8', 4, 7)).eq('baz')

        // check whether remaining bytes are zeroes since the actual string is shorter than its static size
        for(let i = 8; i < 12; i++)
            expect(buffer.readUint8(i)).eq(0)
        
        expect(buffer.toString('utf-8', 12, 15)).eq('xab')
        expect(buffer.toString('utf-8', 16, 20)).eq('zzab')

        // check whether remaining bytes are zeroes since the actual string is shorter than its static size
        for(let i = 20; i < 24; i++)
            expect(buffer.readUint8(i)).eq(0)

    })


})