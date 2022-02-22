import { parseBinary, serializeBinary } from "../..";
import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

export interface NestedDecoratorOptions {}

export const NestedBinary : BinpacketPropertyDecorator<NestedDecoratorOptions> =
(options, propertyType, templateArgs) => 
(target, propertyKey) => 
{

    if(!propertyType)
        throw new Error('Missing property type initializer in @Nested decorator arguments')

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    const propName = propertyKey as keyof typeof target

    if(!templateArgs) templateArgs = [] as ConstructorParameters<abstract new(...args: any) => typeof propertyType>

    const nestedStack = getBinpacketMetadata(new propertyType(...templateArgs!), false)

    if(!nestedStack)
        throw new Error(
            'Nested binary structure of type '+propertyType.name+' has no binary structure initializers'
        )
        
    const size = (source: typeof propertyType) => nestedStack.reduce<number>((prev, curr) => 
        prev + ((+curr.size) || (curr.size as Function)(source)), 0
    )

    let read : BinaryReadHandler<Object>,
        write: BinaryWriteHandler<typeof target>

    read = (from, offset) => {
        const [obj, len] = 
            parseBinary(
                from, propertyType,
                { sourceOffset: offset, args: templateArgs }
            )
        return [obj, len]
    }
    write = (to, source, offset) => {
        const sub = serializeBinary(source[propName])
        to.fill(sub, offset)
        return sub.length
    }

    stack.push({
        propName, size, read, write
    })

}