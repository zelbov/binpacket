import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

export interface Float32DecoratorOptions {

    /**
     * Whether byte order should be BigEndian.
     * 
     * Default: `false`
     * 
     */
    bigEndian: boolean

}

export const readFloat32LEHandler : BinaryReadHandler<number> = (from, offset) => {

    return [from.readFloatLE(offset), 4]

}

export const readFloat32BEHandler : BinaryReadHandler<number> = (from, offset) => {

    return [from.readFloatBE(offset), 4]

}

export const writeFloat32LEHandler : BinaryWriteHandler<Object> = (to, source, offset, propName) => {

    return [to.writeFloatLE(+source[propName!] || 0, offset) - offset, to]

}

export const writeFloat32BEHandler : BinaryWriteHandler<Object> = (to, source, offset, propName) => {

    return [to.writeFloatBE(+source[propName!] || 0, offset) - offset, to]

}

export const getFloat32Handlers 
: (options: Partial<Float32DecoratorOptions>) 
=> { read: BinaryReadHandler<number>, write: BinaryWriteHandler<any>, size: number }
= (options) => {

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<any>

    switch(true) {

        case !!options.bigEndian:
            read = readFloat32BEHandler;
            write = writeFloat32BEHandler;
            break;
        default:
            read = readFloat32LEHandler;
            write = writeFloat32LEHandler;
            break;

    }

    return { read, write, size: 4 }

}

export const Float32 : BinpacketPropertyDecorator<Partial<Float32DecoratorOptions>> =
(options = {}) => (target, propertyKey) => {

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target,
        { read, write, size } = getFloat32Handlers(options)

    stack.push({
        propName, size, read, write
    })

}