import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

export interface Int8DecoratorOptions {

     /**
      * 
      * Whether a value representation should be unsigned.
      * 
      * Works with numeric values only
      * 
      * Default: `false`
      * 
      */
     unsigned: boolean

}

export const readInt8Handler : BinaryReadHandler<number> = (from, offset) => [from.readInt8(offset), 1]

export const readUInt8Handler : BinaryReadHandler<number> = (from, offset) => [from.readUInt8(offset), 1]

export const writeInt8Handler : BinaryWriteHandler<any> = 
(to, source, offset, propName) => [to.writeInt8(+source[propName!] || 0, offset) - offset, to]

export const writeUInt8Handler : BinaryWriteHandler<any> = 
(to, source, offset, propName) => [to.writeUInt8(+source[propName!] || 0, offset) - offset, to]

export const getInt8Handlers 
: (options: Partial<Int8DecoratorOptions>) => { read: BinaryReadHandler<number>, write: BinaryWriteHandler<any>, size: number }
= (options) => {

    if(!options) options = {};

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<any>

    switch(true) {

        case !!options.unsigned:
            read = readUInt8Handler;
            write = writeUInt8Handler;
            break;
        default:
            read = readInt8Handler;
            write = writeInt8Handler;
            break;

    }

    return { read, write, size: 1 }

}

export const Int8 : BinpacketPropertyDecorator<Partial<Int8DecoratorOptions>> = 
(options = {}) => (target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    const { read, write, size } = getInt8Handlers(options)

    stack.push({
        propName, size,
        read, write
    })

}