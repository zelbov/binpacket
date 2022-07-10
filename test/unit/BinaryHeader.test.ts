import { expect } from 'chai'
import 'mocha'
import { Int8, BinaryHeader, parseBinary, serializeBinary, BinaryHeaderParser, BinaryHeaderSerializer } from 'binpacket'

describe('BinaryHeader unit tests', () => {

    const parse: BinaryHeaderParser = (serialized) => {

        // Get total data length from serialized structure header, and return data contained in specified range
        const lenHeader = serialized.subarray(0, 2) /*Buffer.from(serialized, 0, 2)*/,
            len = lenHeader.readUint16LE(0),
            headless = serialized.subarray(2, len + 2)
    
        return headless
    
    }
    
    const serialize : BinaryHeaderSerializer<HeadedFoo> = (source, serialized) => {
    
        // Assign header containing UIn16 value identifying data length & prepend to a 
        const lenHeader = Buffer.alloc(2)
    
        lenHeader.writeUInt16LE(serialized.length)
    
        return lenHeader
    
    }
    
    @BinaryHeader({ parse, serialize })
    class HeadedFoo {
    
        @Int8()
        foo!: number

        @Int8({ unsigned: true })
        bar!: number
    
    }

    let obj: HeadedFoo

    it('Transform buffer into object: should match values & valid data chunk with header cut off', () => {

        const buffer = Buffer.alloc(4)

        buffer.writeUInt16LE(2, 0)
        buffer.writeInt8(125, 2)
        buffer.writeUInt8(129, 3)

        const [result, len] = parseBinary(buffer, HeadedFoo)

        obj = result
        
        expect(obj.foo).eq(125)
        expect(obj.bar).eq(129)

    })

    it('Transform object back to binary: should match values & contain valid header', () => {

        const buffer = serializeBinary(obj)

        expect(buffer.length).eq(4)

        expect(buffer.readUInt16LE(0)).eq(2)
        expect(buffer.readInt8(2)).eq(125)
        expect(buffer.readUint8(3)).eq(129)

    })

})

