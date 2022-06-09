import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

export interface StringDecoratorOptions {

    /**
     * Sets BigEndian encoding for a string
     * 
     * Default: `false`
     */
    bigEndian: boolean

    /**
     * 
     * Sets a static size for a string being written or read. Ignored for null-terminated strings as default
     * 
     * Default: `undefined`
     * 
     */
    size: number

    /**
     * 
     * Identifies string ass null-terminated. If set to true, `size` option is ignored
     * 
     * Default: `true`
     * 
     */
    nullTerminated: boolean 

    /**
     * 
     * Identifies strings encoding.
     * 
     * Default: `utf-8`
     * 
     */
    encoding: BufferEncoding

}

const STRING_ENDING_CONDITION_ERROR = 
    '@String decorator options should contain `size` value or `nullTerminated` set to `true`'

// Read handlers

const readNullTerminatedLE : (encoding?: BufferEncoding) => BinaryReadHandler<string>
= (encoding) => (from, offset) => {

    let readOffset = offset

    let termIdx = from.indexOf('\x00', readOffset),
        string = from.slice(readOffset, termIdx).toString(encoding || 'utf-8')

    return [string, string.length + 1];

}

const readNullTerminatedBE : (encoding?: BufferEncoding) => BinaryReadHandler<string>
= (encoding) => (from, offset) => {

    let readOffset = offset

    let termIdx = from.indexOf('\x00', readOffset),
        string = from.slice(readOffset, termIdx).reverse().toString(encoding || 'utf-8')

    return [string, string.length + 1];

}

const readStaticLE : (size: number, encoding?: BufferEncoding) => BinaryReadHandler<string>
= (size, encoding) => (from, offset) => {

    const str = from.toString(encoding || 'utf-8', offset, offset + size).replace(/\x00|\u0000$/g, '')

    return [ str, size ]

}

const readStaticBE : (size: number, encoding?: BufferEncoding) => BinaryReadHandler<string>
= (size, encoding) => (from, offset) => {

    const str = Buffer.from(
        from.toString(encoding || 'utf-8', offset, offset + size).replace(/\x00|\u0000$/g, '')
    ).reverse().toString()

    return [ str, size ]

}

// Write handlers

const writeNullTerminatedLE : <SourceType>(
    propName: keyof SourceType,
    encoding?: BufferEncoding
) => BinaryWriteHandler<SourceType> =
(propName, encoding) => (to, source, offset) => {

    return [to.write(''+source[propName]+'\x00', offset, encoding || 'utf-8'), to]

}

const writeNullTerminatedBE : <SourceType>(
    propName: keyof SourceType,
    encoding?: BufferEncoding
) => BinaryWriteHandler<SourceType> = 
(propName, encoding) => (to, source, offset) => {

    const rev = Buffer.from(''+source[propName]).reverse()

    return [to.write(rev.toString()+'\x00', offset, encoding || 'utf-8'), to]

}

const writeStaticLE : <SourceType>(
    propName: keyof SourceType,
    size: number,
    encoding?: BufferEncoding
) => BinaryWriteHandler<SourceType> = 
(propName, size, encoding) => (to, source, offset) => {

    to.write(''+source[propName], offset, size, encoding || 'utf-8')
    return [size, to]

}

const writeStaticBE : <SourceType>(
    propName: keyof SourceType,
    size: number,
    encoding?: BufferEncoding
) => BinaryWriteHandler<SourceType> = 
(propName, size, encoding) => (to, source, offset) => {

    const rev = Buffer.from(''+source[propName]).reverse()

    to.write(rev.toString(), offset, size, encoding || 'utf-8')
    return [size, to]

}

export const BinaryString : BinpacketPropertyDecorator<Partial<StringDecoratorOptions>> =
(options = { nullTerminated: true }) => (target, propertyKey) => {

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = { nullTerminated: true }
    if(!options.bigEndian) options.bigEndian = false;
    if(typeof(options.nullTerminated) == 'undefined' && !options.size) options.nullTerminated = true

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<string>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case !!options.nullTerminated:

            if(options.bigEndian === true) {

                read = readNullTerminatedBE(options.encoding)
                write = writeNullTerminatedBE(propName, options.encoding)

            } else {

                read = readNullTerminatedLE(options.encoding)
                write = writeNullTerminatedLE(propName, options.encoding)
            
            }
            
            break;

        case !!options.size:

            if(options.bigEndian === true) {

                read = readStaticBE(options.size!, options.encoding)
                write = writeStaticBE(propName, options.size!, options.encoding)

            } else {

                read = readStaticLE(options.size!, options.encoding)
                write = writeStaticLE(propName, options.size!, options.encoding)

            }
            break;

        default:

            throw new Error(STRING_ENDING_CONDITION_ERROR)

    }

    stack.push({
        propName,
        size: (source: typeof target) => (
            options.nullTerminated
                ? source[propertyKey as keyof typeof target].length as number + 1
                : options.size || source[propertyKey as keyof typeof target].length
        ) as number,
        read, write
    })

}