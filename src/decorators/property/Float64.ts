import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"

interface Float64DecoratorOptions {

    /**
     * Whether byte order should be BigEndian.
     * 
     * Default: `false`
     * 
     */
    bigEndian: boolean

}

const readFloat64LEHandler : BinaryReadHandler<number> = (from, offset) => {

    return [from.readDoubleLE(offset), 8]

}

const readFloat64BEHandler : BinaryReadHandler<number> = (from, offset) => {

    return [from.readDoubleBE(offset), 8]

}

const writeFloat64LEHandler : BinaryWriteHandler<Object> = (to, source, offset, propName) => {

    return [to.writeDoubleLE(+source[propName!] || 0, offset) - offset, to]

}

const writeFloat64BEHandler : BinaryWriteHandler<Object> = (to, source, offset, propName) => {

    return [to.writeDoubleBE(+source[propName!] || 0, offset) - offset, to]

}

export const Float64 : BinpacketPropertyDecorator<Partial<Float64DecoratorOptions>> =
(options = {}) => (target, propertyKey) => {

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.bigEndian:
            read = readFloat64BEHandler;
            write = writeFloat64BEHandler;
            break;
        default:
            read = readFloat64LEHandler;
            write = writeFloat64LEHandler;
            break;

    }

    stack.push({
        propName, size: 8, read, write
    })

}