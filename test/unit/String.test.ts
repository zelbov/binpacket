import { expect } from 'chai'
import 'mocha'
import { BinaryString, parseBinary, serializeBinary } from '../../src'

describe('String decorators support', () => {

    class Foo {

        @BinaryString()
        bar!: string 

        @BinaryString({ size: 8 })
        baz!: string

    }

    let obj : Foo

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(12)

        buffer.write('bar\x00', 'utf-8') // 3-character string plus zero byte terminator -> 4 bytes
        buffer.write('baz', 4, 8, 'utf-8') // 8-character static size string
        // total: 12 bytes

        console.log(buffer)

        const [result, len] = parseBinary(buffer, Foo)

        obj = result

        console.log(obj)

        expect(len).eq(12)

        expect(obj.bar).eq('bar')
        expect(obj.baz).eq('baz')

    })

    it('Transform object back to binary: should produce identical buffer of same order', () => {

        console.log(obj)

        const buffer = serializeBinary(obj)

        console.log(buffer)

        expect(buffer.length).eq(12)
        
        expect(buffer.toString('utf-8', 0, 3)).eq('bar')
        expect(buffer.readUInt8(3)).eq(0)
        expect(buffer.toString('utf-8', 4, 7)).eq('baz')
        for(let i = 8; i < 12; i++)
            expect(buffer.readUint8(i)).eq(0)

    })


})