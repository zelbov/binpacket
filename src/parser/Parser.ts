import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

interface ParseBinaryOptions<ArgsListType extends Array<any>> {
    sourceOffset: number 
    args: ArgsListType
}

export const parseBinary = <ResultType = Function, ArgsListType extends Array<any> = any[]>(
    data: Buffer,
    asType: new(...args: ArgsListType) => ResultType,
    options: Partial<ParseBinaryOptions<ArgsListType>> = {}
) => {

    const args : ArgsListType = options
        ? options.args
            ? options.args 
            : [] as unknown as ArgsListType 
        : [] as unknown as ArgsListType,
        sourceOffset = options ? options.sourceOffset || 0 : 0

    const obj = new asType(...args)

    const stack : BinaryTransformMetadata<ResultType, any>[] | undefined = getBinpacketMetadata(obj, false)

    if(!stack)
        throw new Error(
            'Class '+asType.constructor.name+' has not been defined as binary data container. '+
            'Use at least one binary structure decorator to identify it so.'
        )

    let offset = 0

    for(let meta of stack) {

        const propName : keyof ResultType = meta.propName

        const { size, read } = meta

        obj[propName] = read(data, offset + sourceOffset)

        offset += typeof(size) == 'function' ? size() : size

    }

    return obj as ResultType

}

