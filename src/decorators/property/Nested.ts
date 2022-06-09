import { parseBinary, serializeBinary } from "../..";
import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

const MISSING_PROP_INIT_ERROR = 
    'Missing property initializer detected when tried to handle nested object binary reading';

const MISSING_PROP_TYPE_INIT_ERROR = 
    'Missing property type initializer in @NestedBinary decorator arguments';

export interface NestedDecoratorOptions {}

export const readBinaryNestedObjectHandler : 
<PropertyType, ArgsList = ConstructorParameters<abstract new(...args: any) => PropertyType>>(
    prop: {
        type: new(...args: any) => PropertyType,
        init?: ArgsList
    }) => BinaryReadHandler<Object> = 
(
    prop
) => {

    return <PropertyType>(from: Buffer, offset: number) => {

        if(!prop)
            throw new Error(MISSING_PROP_INIT_ERROR)

        const [obj, len] = 
            parseBinary(
                from, prop.type,
                {
                    sourceOffset: offset,
                    args: (prop.init || []) as ConstructorParameters<abstract new(...args: any) => PropertyType>
                }
            )
        return [obj, len]

    }
    
}

const NESTED_PROPERTY_DESCRIPTOR_ERROR = 'Nested property descriptor is undefined'

export const writeBinaryNestedObjectHandler : BinaryWriteHandler<Object> =
(to, source, offset, propName) => {
    if(!propName) throw new Error(NESTED_PROPERTY_DESCRIPTOR_ERROR)
    const sub = serializeBinary(source[propName])
    to.fill(sub, offset)
    return sub.length
}

export const NestedBinary : BinpacketPropertyDecorator<NestedDecoratorOptions> =
(options, propertyType, templateArgs) => 
(target, propertyKey) => 
{

    if(!propertyType)
        throw new Error(MISSING_PROP_TYPE_INIT_ERROR)

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

    let read : BinaryReadHandler<Object> = readBinaryNestedObjectHandler({ type: propertyType, init: templateArgs }),
        write: BinaryWriteHandler<typeof target> = writeBinaryNestedObjectHandler

    stack.push({
        propName, size, read, write
    })

}