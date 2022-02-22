import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"


export const Int64 : BinpacketPropertyDecorator = 
(options) => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof ClassType

    let read : BinaryReadHandler<bigint>,
        write: BinaryWriteHandler<ClassType>

    switch(true) {

        case !!options.bigEndian && !!options.unsigned:
            read = (from, offset) => from.readBigUInt64BE(offset);
            write = (to, source, offset) => to.writeBigUint64BE(BigInt(''+source[propName]), offset);
            break;
        case !!options.bigEndian:
            read = (from, offset) => from.readBigInt64BE(offset);
            write = (to, source, offset) => to.writeBigInt64BE(BigInt(''+source[propName]), offset);
            break;
        case !!options.unsigned:
            read = (from, offset) => from.readBigUint64LE(offset);
            write = (to, source, offset) => to.writeBigUint64LE(BigInt(''+source[propName]), offset);
            break;
        default:
            read = (from, offset) => from.readBigInt64LE(offset);
            write = (to, source, offset) => to.writeBigInt64LE(BigInt(''+source[propName]), offset);
            break;

    }

    stack.push({
        propName, size: 8,
        read, write
    })

}