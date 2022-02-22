import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

interface Int16DecoratorOptions {

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

export const Int16 : BinpacketPropertyDecorator<Partial<Int16DecoratorOptions>> = 
(options = {}) => (target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.bigEndian && !!options.unsigned:
            read = (from, offset) => from.readUInt16BE(offset);
            write = (to, source, offset) => to.writeUint16BE(+source[propName], offset);
            break;
        case !!options.bigEndian:
            read = (from, offset) => from.readInt16BE(offset);
            write = (to, source, offset) => to.writeInt16BE(+source[propName], offset);
            break;
        case !!options.unsigned:
            read = (from, offset) => from.readUint16LE(offset);
            write = (to, source, offset) => to.writeUint16LE(+source[propName], offset);
            break;
        default:
            read = (from, offset) => from.readInt16LE(offset);
            write = (to, source, offset) => to.writeInt16LE(+source[propName], offset);
            break;

    }

    stack.push({
        propName, size: 2,
        read, write
    })

}