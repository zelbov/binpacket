import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

interface Int8DecoratorOptions {

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

export const Int8 : BinpacketPropertyDecorator<Partial<Int8DecoratorOptions>> = 
(options = {}) => (target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.unsigned:
            read = (from, offset) => [from.readUInt8(offset), 1];
            write = (to, source, offset) => to.writeUint8(+source[propName], offset) - offset;
            break;
        default:
            read = (from, offset) => [from.readInt8(offset), 1];
            write = (to, source, offset) => to.writeInt8(+source[propName], offset) - offset;
            break;

    }

    stack.push({
        propName, size: 1,
        read, write
    })

}