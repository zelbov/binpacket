import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"


export const Int8 : BinpacketPropertyDecorator = 
(options) => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = {}

    const propName = propertyKey as keyof ClassType

    let read : BinaryReadHandler<number>,
        write: BinaryWriteHandler<ClassType>

    switch(true) {

        case !!options.unsigned:
            read = (from, offset) => from.readUInt8(offset);
            write = (to, source, offset) => to.writeUint8(+source[propName], offset);
            break;
        default:
            read = (from, offset) => from.readInt8(offset);
            write = (to, source, offset) => to.writeInt8(+source[propName], offset);
            break;

    }

    stack.push({
        propName, size: 1,
        read, write
    })

}