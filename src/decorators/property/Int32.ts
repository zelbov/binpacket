import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"


export const Int32 : BinpacketPropertyDecorator = 
(options) => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)

    if(!options) options = {}

    if(!stack)
        throw new Error(
            'Class '+target.constructor.name+' has not been defined as binary data container. '+
            'Use at least one binary structure decorator to identify it so.'
        )

    const propName = propertyKey as keyof ClassType

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<ClassType>

    switch(true) {

        case !!options.bigEndian && !!options.unsigned:
            read = (from, offset) => from.readUInt32BE(offset);
            write = (to, source, offset) => to.writeUint32BE(+source[propName], offset);
            break;
        case !!options.bigEndian:
            read = (from, offset) => from.readInt32BE(offset);
            write = (to, source, offset) => to.writeInt32BE(+source[propName], offset);
            break;
        case !!options.unsigned:
            read = (from, offset) => from.readUint32LE(offset);
            write = (to, source, offset) => to.writeUint32LE(+source[propName], offset);
            break;
        default:
            read = (from, offset) => from.readInt32LE(offset);
            write = (to, source, offset) => to.writeInt32LE(+source[propName], offset);
            break;

    }

    stack.push({
        propName, size: 4,
        read, write
    })

}