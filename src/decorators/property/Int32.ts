import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

interface Int32DecoratorOptions {

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

export const Int32 : BinpacketPropertyDecorator<Partial<Int32DecoratorOptions>> = 
(options = {}) => (target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.bigEndian && !!options.unsigned:
            read = (from, offset) => [from.readUInt32BE(offset), 4];
            write = (to, source, offset) => to.writeUint32BE(+source[propName], offset) - offset;
            break;
        case !!options.bigEndian:
            read = (from, offset) => [from.readInt32BE(offset), 4];
            write = (to, source, offset) => to.writeInt32BE(+source[propName], offset) - offset;
            break;
        case !!options.unsigned:
            read = (from, offset) => [from.readUint32LE(offset), 4];
            write = (to, source, offset) => to.writeUint32LE(+source[propName], offset) - offset;
            break;
        default:
            read = (from, offset) => [from.readInt32LE(offset), 4];
            write = (to, source, offset) => to.writeInt32LE(+source[propName], offset) - offset;
            break;

    }

    stack.push({
        propName, size: 4,
        read, write
    })

}