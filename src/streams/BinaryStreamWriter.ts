import { serializeBinary } from "../builder/Builder"
import { Transform, TransformCallback } from 'stream'

export class BinaryWriteStream extends Transform {

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            callback(null, chunk)
        } catch (ex) {
            callback(ex as Error)
        }
    }

    write(obj: Object){

        const binary = serializeBinary(obj)
        super.write(binary)
        return true

    }
    
}