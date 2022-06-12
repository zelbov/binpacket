import { serializeBinary } from "../builder/Builder"
import { WriteableStreamPolyfill } from "../polyfills/WriteStream"

export class BinaryWriteStream extends WriteableStreamPolyfill {

    write(obj: Object){

        const binary = serializeBinary(obj)
        super.write(binary)
        return true

    }
    
}