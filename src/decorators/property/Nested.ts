import { parseBinary, serializeBinary } from "../..";
import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyTypedDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

interface NestedDecoratorOptions {}

export const NestedBinary : BinpacketPropertyTypedDecorator<NestedDecoratorOptions> =
(propertyType, options, templateArgs) => 
(target, propertyKey) => 
{

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    const propName = propertyKey as keyof typeof target

    const nestedStack = getBinpacketMetadata(new propertyType(...templateArgs), false)

    if(!nestedStack)
        throw new Error(
            'Nested binary structure of type '+propertyType.name+' has no binary structure initializers'
        )
        
    const size = nestedStack.reduce<number>((prev, curr) => 
        prev + (typeof(curr.size) == 'function' ? curr.size() : curr.size), 0
    )

    let read : BinaryReadHandler<Object>,
        write: BinaryWriteHandler<typeof target>

    read = (from, offset) => parseBinary(
        from, propertyType,
        { sourceOffset: offset, args: templateArgs }
    )
    write = (to, source, offset) => to.fill(serializeBinary(source[propName]), offset)

    stack.push({
        propName, size, read, write
    })

}