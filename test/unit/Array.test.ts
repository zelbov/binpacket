import { expect } from 'chai';
import 'mocha'
import { BinaryArray, Int8, parseBinary, serializeBinary } from '../../src'

describe('BinaryArray unit tests', () => {

    class Bar {

        @Int8({ unsigned: true })
        prop!: number

    }

    class Foo {

        @Int8({ unsigned: true })
        barsize!: number;

        @BinaryArray({
            type: 'int8',
            size: (source: Foo) => source.barsize
        })
        bar!: number[]

        @BinaryArray({
            type: 'int16',
            options: { unsigned: true },
            nullTerminated: true 
        })
        baz!: number[]

        @BinaryArray({
            type: 'nested',
            options: { type: Bar },
            size: 1 
        })
        nest!: Bar[]

    }

    let obj: Foo 

    it('Transform buffer into object: should match values & their order', () => {

        const buffer = Buffer.alloc(11) // 1x int8 (size: 2) + 2x int8 + 3x int16 + nullterminator + nested 1 byte = 11 bytes

        buffer.writeUInt8(2, 0)

        buffer.writeInt8(13, 1)
        buffer.writeInt8(37, 2)

        buffer.writeUint16LE(1337, 3)
        buffer.writeUint16LE(1377, 5)
        buffer.writeUint16LE(1313, 7)
        buffer.writeUint8(0, 9)

        buffer.writeUint8(250, 10)

        console.log(buffer)

        const [result, len] = parseBinary(buffer, Foo)

        console.log(result, len)

        expect(len).eq(11)

        obj = result 

        expect(obj.barsize).eq(2)

        expect(obj.bar[0]).eq(13)
        expect(obj.bar[1]).eq(37)

        expect(obj.baz[0]).eq(1337)
        expect(obj.baz[1]).eq(1377)
        expect(obj.baz[2]).eq(1313)

        expect(obj.nest[0].prop).eq(250)

    })

    it('Transform object back to binary: should produce identical buffer of the same order', () => {

        const buffer = serializeBinary(obj)

        console.log(buffer)

        expect(buffer.readUint8(0)).eq(2)
        
        expect(buffer.readInt8(1)).eq(13)
        expect(buffer.readInt8(2)).eq(37)

        expect(buffer.readUint16LE(3)).eq(1337)
        expect(buffer.readUint16LE(5)).eq(1377)
        expect(buffer.readUint16LE(7)).eq(1313)

        expect(buffer.readUint8(9)).eq(0)

        expect(buffer.readUint8(10)).eq(250)

        expect(buffer.length).eq(11)

    })

})