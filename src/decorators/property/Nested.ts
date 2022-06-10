import { parseBinary, serializeBinary } from "../..";
import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

const MISSING_PROP_INIT_ERROR = 
    'Missing property initializer detected when tried to handle nested object binary reading';

const MISSING_PROP_TYPE_INIT_ERROR = 
    'Missing property type initializer in @NestedBinary decorator arguments';

export interface NestedDecoratorOptions {
    type: (new (...args: ConstructorParameters<abstract new(...args: any) => any>) => any),
    templateArgs?: ConstructorParameters<abstract new(...args: any) => any>
}

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
    return [sub.length, to]
}

export const getNestedHandlers
: (options: NestedDecoratorOptions) => 
{ read: BinaryReadHandler<Object>, write: BinaryWriteHandler<any>, size: (source: any) => number }
= (options) => {

    const nestedStack = getBinpacketMetadata(new options.type(...options.templateArgs!), false)

    if(!nestedStack)
        throw new Error(
            'Nested binary structure of type '+options.type.name+' has no binary structure initializers'
        )

    const read : BinaryReadHandler<Object> = readBinaryNestedObjectHandler({ type: options.type, init: options.templateArgs }),
        write: BinaryWriteHandler<any> = writeBinaryNestedObjectHandler,
        size = (source: any) => nestedStack.reduce<number>((prev, curr) => 
            prev + ((+curr.size) || (curr.size as Function)(source)), 0
        )

    return { read, write, size }

}

const MISSING_OPTIONS_ERROR = '@NestedBinary decorator must have options parameter provided'

export const NestedBinary : BinpacketPropertyDecorator<NestedDecoratorOptions> =
(options) => 
(target, propertyKey) => 
{

    if(!options) throw new Error(MISSING_OPTIONS_ERROR)

    if(!options.type)
        throw new Error(MISSING_PROP_TYPE_INIT_ERROR)

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    const propName = propertyKey as keyof typeof target

    if(!options.templateArgs) options.templateArgs = [] as ConstructorParameters<abstract new(...args: any) => any>

    const { read, write, size } = getNestedHandlers(options)

    stack.push({
        propName, size, read, write
    })

}