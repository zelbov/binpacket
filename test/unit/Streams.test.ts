import { expect } from 'chai'
//import { createReadStream, createWriteStream, existsSync, readFileSync, unlinkSync } from 'fs'
import 'mocha'
//import { join } from 'path'
import { BinaryReadStream, BinarySelector, BinaryWriteStream, Int16 } from 'binpacket'

describe('BinaryStreams unit tests', () => {

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

    const STRUCT_ID = 9000

    @BinarySelector({
        id: STRUCT_ID,
        minBufferSize: 2,
        parse, serialize
    })
    class Foo {

        @Int16()
        bar!: number

    }

    describe('Native streams pipes', () => {

        it('Write binary representation of object into stream using BinaryWriteStream pipe: should produce valid buffer on the other side')
        it('Read binary representation of object from stream using BinaryReadStream pipe: should read deserialized object')

        //TODO: test BinaryReadStream behavior when parsing fragmented or incomplete data

    })

    //TODO: remove "path" and "fs" usage since this test is being ported into browsers aswell
    /*
    describe('FS streams', () => {

        const filePath = join(process.cwd(), 'temp', 'writestream.bin')

        before(() => {
            if(existsSync(filePath)) unlinkSync(filePath)
        })

        it('Write binary representation of object into file using BinaryWriteStream: should produce valid buffer on the other side', (done) => {
            
            const obj = new Foo()
            obj.bar = 1337;

            const binaryStream = new BinaryWriteStream(),
                recvStream = createWriteStream(filePath)

            binaryStream.pipe(recvStream)

            binaryStream.write(obj)

            binaryStream.end()

            recvStream.close(() => {

                const wrote = readFileSync(filePath)
                expect(wrote.readUint16LE(0)).eq(STRUCT_ID)
                expect(wrote.readInt16LE(2)).eq(1337)
                done()

            })
    
        })

        it('Read binary representation of object from file using BinaryReadStream: should read deserialized object', async () => {

            const binaryStream = new BinaryReadStream((raw) => raw.readUint16LE(0)),
                fsStream = createReadStream(filePath)

            fsStream.pipe(binaryStream)

            await Promise.all([

                // check raw buffer transform
                new Promise<void>((resolve) => {

                    binaryStream
                    .on('data', (chunk: Buffer) => {
                        expect(chunk.readUint16LE(0)).eq(STRUCT_ID)
                        expect(chunk.readInt16LE(2)).eq(1337)
                        resolve()
                    })

                }),
                // check parsed data transform
                new Promise<void>((resolve) => {

                    binaryStream
                    .when(Foo)
                    .on('data', ([result, len]) => {
                        expect(Object.getPrototypeOf(result).constructor.name).eq('Foo')
                        expect(result.bar).eq(1337)
                        resolve()
                    })

                })
                
            ])

        })

        

    })

    describe('Network streams', () => {

        it('Write binary representation of object into socket using BinaryWriteStream: should produce valud buffer on the other side')
        it('Read binary representation of object from socket using BinaryReadStream: should read deserialized object')

    })
    */

})