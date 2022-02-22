import { getBinpacketMetadata } from "../../store/MetadataStore";
import { BinpacketPropertyDecorator } from "../../types/Decorators";
import { BinaryReadHandler, BinaryTransformMetadata, BinaryWriteHandler } from "../../types/TransformMetadata";

//TODO: BE/LE
interface StringDecoratorOptions {

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

export const BinaryString : BinpacketPropertyDecorator<Partial<StringDecoratorOptions>> =
(options = { nullTerminated: true, encoding: 'utf-8' }) => (target, propertyKey) => {

    const stack : BinaryTransformMetadata<any, any>[] = getBinpacketMetadata(target)!

    if(!options) options = { nullTerminated: true, encoding: 'utf-8' }

    const propName = propertyKey as keyof typeof target

    let read : BinaryReadHandler<string>,
        write: BinaryWriteHandler<typeof target>

    switch(true) {

        case options.nullTerminated:

            read = (from, offset) => {

                let readOffset = offset

                let string = '', char = from.toString(options.encoding || 'utf-8', readOffset, readOffset + 1)

                while(char != '\x00') {
                    string += char
                    readOffset += 1
                    char = from.toString(options.encoding || 'utf-8', readOffset, readOffset + 1)
                }

                return [string, string.length + 1];

            }

            write = (to, source, offset) => {

                return to.write(''+source[propName]+'\x00', offset, options.encoding || 'utf-8')

            }
            break;

        case !!options.size:

            read = (from, offset) => {

                const str = from.toString(options.encoding || 'utf-8', offset, offset + options.size!)

                return [ str.replace(/\x00|\u0000$/g, ''), options.size! ]

            }

            write = (to, source, offset) => {

                return to.write(''+source[propName], offset, options.size!, options.encoding || 'utf-8')

            }

            break;

        default:

            throw new Error(
                '@String decorator options should contain `size` value or `nullTerminated` set to `true`'
            )

    }

    stack.push({
        propName,
        size: (source: string) => options.nullTerminated ? source.length + 1 : options.size || source.length,
        read, write
    })

}