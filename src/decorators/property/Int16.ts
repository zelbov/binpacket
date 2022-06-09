import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

export interface Int16DecoratorOptions {

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

export const readInt16LEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readInt16LE(offset), 2]

export const readInt16BEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readInt16BE(offset), 2]

export const readUInt16LEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readUInt16LE(offset), 2]

export const readUInt16BEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readUInt16BE(offset), 2]

export const writeInt16LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeInt16LE(+source[propName!] || 0, offset) - offset

export const writeInt16BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeInt16BE(+source[propName!] || 0, offset) - offset

export const writeUInt16LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeUint16LE(+source[propName!] || 0, offset) - offset

export const writeUInt16BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeUint16BE(+source[propName!] || 0, offset) - offset

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
            read = readUInt16BEHandler
            write = writeUInt16BEHandler
            break;
        case !!options.bigEndian:
            read = readInt16BEHandler
            write = writeInt16BEHandler
            break;
        case !!options.unsigned:
            read = readUInt16LEHandler
            write = writeUInt16LEHandler
            break;
        default:
            read = readInt16LEHandler
            write = writeInt16LEHandler
            break;

    }

    stack.push({
        propName, size: 2,
        read, write
    })

}