import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

export interface Int64DecoratorOptions {

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

export const readInt64LEHandler : BinaryReadHandler<bigint> = 
(from, offset) => [from.readBigInt64LE(offset), 8]

export const readInt64BEHandler : BinaryReadHandler<bigint> = 
(from, offset) => [from.readBigInt64BE(offset), 8]

export const readUInt64LEHandler : BinaryReadHandler<bigint> = 
(from, offset) => [from.readBigUInt64LE(offset), 8]

export const readUInt64BEHandler : BinaryReadHandler<bigint> = 
(from, offset) => [from.readBigUInt64BE(offset), 8]

export const writeInt64LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeBigInt64LE(BigInt(''+(source[propName!] || 0)), offset) - offset

export const writeInt64BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeBigInt64BE(BigInt(''+(source[propName!] || 0)), offset) - offset

export const writeUInt64LEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeBigUint64LE(BigInt(''+(source[propName!] || 0)), offset) - offset

export const writeUInt64BEHandler : BinaryWriteHandler<Object> = 
(to, source, offset, propName) => to.writeBigUint64BE(BigInt(''+(source[propName!] || 0)), offset) - offset


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
                read = readUInt64BEHandler
                write = writeUInt64BEHandler
                break;
            case !!options.bigEndian:
                read = readInt64BEHandler
                write = writeInt64BEHandler
                break;
            case !!options.unsigned:
                read = readUInt64LEHandler
                write = writeUInt64LEHandler
                break;
            default:
                read = readInt64LEHandler
                write = writeInt64LEHandler
                break;
    
        }

    stack.push({
        propName,
        size: 8,
        read, write
    })

}