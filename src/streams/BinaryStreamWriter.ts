import { serializeBinary } from "../builder/Builder"
import { WritableStreamPolyfill } from "../polyfills/WritableStream"

export class BinaryWriteStream extends WritableStreamPolyfill<Object> {

    write(obj: Object){

        const binary = serializeBinary(obj)
        super.write(binary)
        return true

    }
    
}