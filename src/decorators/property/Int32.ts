import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryTransformMetadata } from "../../types/TransformMetadata"


export const Int32 : BinpacketPropertyDecorator = 
() => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)

    if(!stack)
        throw new Error(
            'Class '+target.constructor.name+' has not been defined as binary data container. '+
            'Use @Packet() decorator to identify it so.'
        )

    const propName = propertyKey as keyof ClassType

    stack.push({
        propName, size: 4,
        read: (from, offset) => from.readInt32LE(offset),
        write: (to, source, offset) => {
            to.writeInt32LE(+source[propName], offset)
        }
    })

}