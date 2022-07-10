import 'mocha'
import { Int8, parseBinary, serializeBinary } from 'binpacket'

describe('Int8 benchmarking', () => {

    class Foo {

        @Int8()
        bar!: number

    }

    it('Serialize structure containing one Int8 million times', function(){

        const obj = new Foo()
        obj.bar = 42

        for(let i = 0; i < 1_000_000; i++) serializeBinary(obj)

    })

    it('Parse binary into object million times', function(){

        const obj = new Foo()
        obj.bar = 42

        const serialized = serializeBinary(obj)

        for(let i = 0; i < 1_000_000; i++) parseBinary(serialized, Foo)

    })

})