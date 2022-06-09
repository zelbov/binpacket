import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketClassDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

/**
 * A function that accepts serialized binary with header and produces headless chunk of packet 
 */
 export type BinaryHeaderParser = (serialized: Buffer) => Buffer

/**
 * A function that accepts object and a buffer allocated for binary representation (including space for header)
 * and produces a buffer that represents serialized header
 */
export type BinaryHeaderSerializer<SourceType extends Object = any> = 
    (source: SourceType, serialized: Buffer) => Buffer

type BinaryHeaderDecoratorOptions = {
    parse: BinaryHeaderParser,
    serialize: BinaryHeaderSerializer
}

export const BinaryHeader : BinpacketClassDecorator<[BinaryHeaderDecoratorOptions]> = 
(options) => (target) => {

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target.prototype)!

    const read: BinaryReadHandler<number> = (from) => {

        const header = options.parse(from)

        return [0, from.length - header.length]

    }

    const write : BinaryWriteHandler<typeof target> = (buffer, from) => {

        const header = options.serialize(from, buffer),
            len = header.length,
            result = Buffer.concat([header, buffer])

        return [len, result]

    }

    stack.unshift({
        size: 0,
        read, write: (buffer) => [0, buffer]
    })

    stack.push({
        size: 0, read: () => [0, 0],
        write
    })

}