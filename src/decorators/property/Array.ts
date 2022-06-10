import { getBinpacketMetadata } from "../../store/MetadataStore"
import { BinpacketPropertyDecorator } from "../../types/Decorators"
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata"
import { Float32DecoratorOptions, getFloat32Handlers } from "./Float32"
import { Float64DecoratorOptions, getFloat64Handers } from "./Float64"
import { getInt16Handlers, Int16DecoratorOptions } from "./Int16"
import { getInt32Handlers, Int32DecoratorOptions } from "./Int32"
import { getInt64Handlers, Int64DecoratorOptions } from "./Int64"
import { getInt8Handlers, Int8DecoratorOptions, readInt8Handler, readUInt8Handler, writeInt8Handler, writeUInt8Handler } from "./Int8"
import { getNestedHandlers, NestedDecoratorOptions } from "./Nested"
import { getStringHandlers, StringDecoratorOptions } from "./String"

type SupportedValueType =
| 'int8'
| 'int16'
| 'int32'
| 'int64'
| 'float32'
| 'float64'
| 'nested'
| 'string'

type SupportedTypeOptionsMapping =
| { type: 'int8', options?: Partial<Int8DecoratorOptions> }
| { type: 'int16', options?: Partial<Int16DecoratorOptions> }
| { type: 'int32', options?: Partial<Int32DecoratorOptions> }
| { type: 'int64', options?: Partial<Int64DecoratorOptions> }
| { type: 'float32', options?: Partial<Float32DecoratorOptions> }
| { type: 'float64', options?: Partial<Float64DecoratorOptions> }
| { type: 'string', options?: Partial<StringDecoratorOptions> }
| { type: 'nested', options: NestedDecoratorOptions }

type SizeOption = number | ((source: any) => number)

const supportedTypesHandlersMapping : {
    [valueType in SupportedValueType]: (options: any) => 
    {
        read: BinaryReadHandler<any>,
        write: BinaryWriteHandler<any>,
        size: number | ((source: any, propName: string | number | symbol) => number)
    }
} = {

    int8: (options: Partial<Int8DecoratorOptions>) => getInt8Handlers(options),
    int16: (options: Partial<Int16DecoratorOptions>) => getInt16Handlers(options),
    int32: (options: Partial<Int32DecoratorOptions>) => getInt32Handlers(options),
    int64: (options: Partial<Int64DecoratorOptions>) => getInt64Handlers(options),
    float32: (options: Partial<Float32DecoratorOptions>) => getFloat32Handlers(options),
    float64: (options: Partial<Float64DecoratorOptions>) => getFloat64Handers(options),
    string: (options: Partial<StringDecoratorOptions>) => getStringHandlers(options),
    nested: (options: NestedDecoratorOptions) => getNestedHandlers(options)

}

type ArrayDecoratorOptions = 
SupportedTypeOptionsMapping & Partial<{ size: SizeOption, nullTerminated: boolean }>

const MISSING_OPTIONS_ERROR = '@BinaryArray decorator must have options parameter provided'

const UNEXPECTED_DATA_TYPE_ERROR = 'Non-array value type passed into object property identified as BinaryArray'

const ARRAY_TERMINATION_CONDITION_MISSING = 'Missing termination condition for BinaryArray: '+
    'options object should contain static size or `nullTerminated` flag set to `true`'

export const BinaryArray : BinpacketPropertyDecorator<ArrayDecoratorOptions> =
(options) => (target, propertyKey) => {

    if(!options) throw new Error(MISSING_OPTIONS_ERROR)

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    const propName = propertyKey as keyof typeof target

    let readArray: BinaryReadHandler<Array<any>>,
        writeArray : BinaryWriteHandler<Object>,
        arraySize: (source: any, propName: string | number | symbol) => number

    const { read, write, size } = supportedTypesHandlersMapping[options.type](options.options)
    
    switch(true) {

        case typeof(options.size) == 'number' || typeof(options.size) == 'function':

            readArray = (from, offset, source) => {

                const sizeOpt = options.size === 0 ? 0 : +options.size! || (options.size as Function)(source)

                let result : any[] = [], totalLength = 0;

                for(let i = 0; i < sizeOpt; i++) {
                    const [value, length] = read(from, offset + totalLength, source)
                    totalLength += length 
                    result.push(value)
                }

                return [result, totalLength]

            }

            writeArray = (to, source, offset, propName) => {

                let writeOffset = offset

                const sizeOpt = options.size === 0 ? 0 : +options.size! || (options.size as Function)(source)

                const array : any[] = source[propName!] as unknown as any[]

                if(!Array.isArray(array)) throw new Error(UNEXPECTED_DATA_TYPE_ERROR)

                for(let i = 0; i < sizeOpt; i++) {

                    const [wrote] = write(to, array, writeOffset, i)
                    writeOffset += wrote

                }

                return [writeOffset - offset, to]

            }

            arraySize = (source, propName) => {

                const sizeOpt = options.size === 0 ? 0 : +options.size! || (options.size as Function)(source)

                const totalSize = (source[propName] as unknown[] as any[])
                    .slice(0, sizeOpt)
                    .reduce((prev, curr, idx) =>
                        prev + (size === 0 ? 0 : +size || (size as Function)(curr, idx)), 0
                    )

                return totalSize + 1

            }

            break;

        case !!options.nullTerminated:

            readArray = (from, offset, source) => {
        
                const endOffset = from.indexOf(0, offset),
                    totalLength = endOffset - offset;

                let i = 0, result: any[] = []
                while(i < totalLength) {
                    const [value, length] = read(from, offset + i, source)
                    i += length
                    result.push(value)
                }

                return [result, totalLength + 1]
        
            };

            writeArray = (to, source, offset, propName) => {

                let writeOffset = offset

                const array : any[] = source[propName!] as unknown as any[]

                if(!Array.isArray(array)) throw new Error(UNEXPECTED_DATA_TYPE_ERROR)

                array.map((_, idx) => {

                    const [wrote] = write(to, array, writeOffset, idx)
                    writeOffset += wrote

                })

                to.writeUInt8(0, writeOffset++)

                return [writeOffset - offset, to]

            }

            arraySize = (source, propName) => {

                const totalSize = (source[propName] as unknown[] as any[])
                    .reduce((prev, curr, idx) =>
                        prev + (size === 0 ? 0 : +size || (size as Function)(curr, idx)), 0
                    )

                return totalSize + 1

            }

            break;

        default:

            throw new Error(ARRAY_TERMINATION_CONDITION_MISSING);

    }

    stack.push({ propName, size: arraySize, read: readArray, write: writeArray })
    

    //TODO: pick up read & write handlers according to selected value type & its options
    //TODO: init array read & write handlers passing the one picked up earlier & repeat based on size or nullterm condition

}