import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

interface Int64DecoratorOptions {

    /**
     * Whether byte order should be BigEndian.
     * 
     * Default: `false`
     * 
     */
     bigEndian: boolean

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

export const Int64 : BinpacketPropertyDecorator<Partial<Int64DecoratorOptions>> = 
(options = {}) => (target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<bigint>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.bigEndian && !!options.unsigned:
            read = (from, offset) => [from.readBigUInt64BE(offset), 8];
            write = (to, source, offset) => to.writeBigUint64BE(BigInt(''+source[propName]), offset) - offset
            break;
        case !!options.bigEndian:
            read = (from, offset) => [from.readBigInt64BE(offset), 8];
            write = (to, source, offset) => to.writeBigInt64BE(BigInt(''+source[propName]), offset) - offset;
            break;
        case !!options.unsigned:
            read = (from, offset) => [from.readBigUint64LE(offset), 8];
            write = (to, source, offset) => to.writeBigUint64LE(BigInt(''+source[propName]), offset) - offset;
            break;
        default:
            read = (from, offset) => [from.readBigInt64LE(offset), 8];
            write = (to, source, offset) => to.writeBigInt64LE(BigInt(''+source[propName]), offset) - offset;
            break;

    }

    stack.push({
        propName,
        size: 8,
        read, write
    })

}