import { expect } from 'chai'
import 'mocha'
import { BinarySelector, identifyBinary, Int16, Int32, parseBinary, serializeBinary } from '../../src'

describe('BinarySelector unit tests', () => {

    const parse = (id: number, serialized: Buffer) => {
        // Cut out header containing ID value
        return serialized.subarray(2, serialized.length)
    }

    const serialize = (id: number, source: any, serialized: Buffer) => {
        // prepend ID header for binary selector identification
        const header = Buffer.alloc(2)
        header.writeUint16LE(id)
        return header
    }

    const FOO_STRUCT_ID = 1337
    const BAR_STRUCT_ID = 1338

    @BinarySelector({
        id: FOO_STRUCT_ID,
        minBufferSize: 2,
        parse, serialize
    })
    class Foo {

        @Int16()
        bar!: number

    }

    @BinarySelector({
        id: BAR_STRUCT_ID,
        minBufferSize: 2,
        parse, serialize
    })
    class Bar {

        @Int32()
        foo!: number

    }

    describe('Struct #1337 (Foo)', () => {

        let obj: Foo

        it('Identify & produce object from raw binary: should match defined structure', () => {

            const buffer = Buffer.alloc(4)

            buffer.writeUInt16LE(FOO_STRUCT_ID, 0)
            buffer.writeInt16LE(1313, 2)

            const template = identifyBinary(buffer, (raw) => raw.readUint16LE(0))!

            expect(template).not.undefined
            expect(template.name).eq('Foo')

            const [result, len] = parseBinary(buffer, template)

            obj = result

            expect(len).eq(4)
            expect(obj.bar).eq(1313)
            
        })

        it('Transform object back to binary & identify again: should match defined structure & byte order', () => {

            const buffer = serializeBinary(obj)

            expect(buffer.length).eq(4)

            expect(buffer.readUint16LE(0)).eq(FOO_STRUCT_ID)
            expect(buffer.readInt16LE(2)).eq(1313)

        })

    })

    describe('Struct #1338 (Bar)', () => {

        let obj: Bar

        it('Identify & produce object from raw binary: should match defined structure', () => {

            const buffer = Buffer.alloc(6)

            buffer.writeUInt16LE(BAR_STRUCT_ID, 0)
            buffer.writeInt32LE(1313, 2)

            const template = identifyBinary(buffer, (raw) => raw.readUint16LE(0))!

            expect(template).not.undefined
            expect(template.name).eq('Bar')

            const [result, len] = parseBinary(buffer, template)

            obj = result

            expect(len).eq(6)
            expect(obj.foo).eq(1313)
            
        })

        it('Transform object back to binary & identify again: should match defined structure & byte order', () => {

            const buffer = serializeBinary(obj)

            expect(buffer.length).eq(6)

            expect(buffer.readUint16LE(0)).eq(BAR_STRUCT_ID)
            expect(buffer.readInt32LE(2)).eq(1313)

        })

    })

})