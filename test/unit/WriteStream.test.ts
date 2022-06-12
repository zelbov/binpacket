import { expect } from 'chai'
import { createWriteStream, existsSync, readFileSync, unlinkSync } from 'fs'
import 'mocha'
import { join } from 'path'
import { BinaryWriteStream, Int16 } from '../../src'

describe('BinaryWriteStream unit tests', () => {

    class Foo {

        @Int16()
        bar!: number

    }

    describe('FS streams', () => {

        const filePath = join(process.cwd(), 'temp', 'writestream.bin')

        before(() => {
            if(existsSync(filePath)) unlinkSync(filePath)
        })

        it('Write binary representation of object into stream: should produce valid buffer on the other side', (done) => {
            
            const obj = new Foo()
            obj.bar = 1337;

            const binaryStream = new BinaryWriteStream(),
                recvStream = createWriteStream(filePath)

            binaryStream.pipe(recvStream)

            binaryStream.write(obj)

            binaryStream.close()

            recvStream.close(() => {

                const wrote = readFileSync(filePath)
                console.log(wrote)
                expect(wrote.readInt16LE(0)).eq(1337)
                done()

            })
    
        })

    })

    describe('Network streams', () => {

        it('Write binary representation of object into stream: should produce valud buffer on the other side')

    })

})