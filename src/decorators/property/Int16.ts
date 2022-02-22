import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"


export const Int16 : BinpacketPropertyDecorator = 
(options) => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof ClassType

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<ClassType>

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