import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

export interface Int32DecoratorOptions {

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

export const readInt32LEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readInt32LE(offset), 4]

export const readInt32BEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readInt32BE(offset), 4]

export const readUInt32LEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readUInt32LE(offset), 4]

export const readUInt32BEHandler : BinaryReadHandler<number> = 
(from, offset) => [from.readUInt32BE(offset), 4]

export const writeInt32LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => [to.writeInt32LE(+source[propName!] || 0, offset) - offset, to]

export const writeInt32BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => [to.writeInt32BE(+source[propName!] || 0, offset) - offset, to]

export const writeUInt32LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => [to.writeUint32LE(+source[propName!] || 0, offset) - offset, to]

export const writeUInt32BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => [to.writeUint32BE(+source[propName!] || 0, offset) - offset, to]





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
                read = readUInt32BEHandler
                write = writeUInt32BEHandler
                break;
            case !!options.bigEndian:
                read = readInt32BEHandler
                write = writeInt32BEHandler
                break;
            case !!options.unsigned:
                read = readUInt32LEHandler
                write = writeUInt32LEHandler
                break;
            default:
                read = readInt32LEHandler
                write = writeInt32LEHandler
                break;
    
        }

    stack.push({
        propName, size: 4,
        read, write
    })

}