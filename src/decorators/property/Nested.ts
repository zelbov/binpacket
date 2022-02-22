import { parseBinary, serializeBinary } from "../..";
import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";


export const NestedBinary : BinpacketPropertyDecorator =
(options) => <ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options || !options.type) throw new Error(
        'Missing nested type initializer in `@Nested` decorator options'
    )

    const propName = propertyKey as keyof ClassType

    const nestedStack = getBinpacketMetadata(new options.type(), false)

    if(!nestedStack)
        throw new Error(
            'Nested binary structure of type '+options.type.name+' has no binary structure initializers'
        )
        
    const size = nestedStack.reduce<number>((prev, curr) => 
        prev + (typeof(curr.size) == 'function' ? curr.size() : curr.size), 0
    )

    let read : BinaryReadHandler<Object>,
        write: BinaryWriteHandler<ClassType>

    read = (from, offset) => parseBinary(
        from, options.type!, 
        { sourceOffset: offset, args: options.templateArgs || [] }
    )
    write = (to, source, offset) => to.fill(serializeBinary(source[propName]), offset)

    stack.push({
        propName, size, read, write
    })

}