import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

interface ParseBinaryOptions<ArgsListType extends Array<any>> {
    sourceOffset: number 
    args: ArgsListType
}

export const parseBinary = <
    ResultType extends Object,
    ArgsList extends Array<any> = ConstructorParameters<abstract new(...args: any) => ResultType>
>(
    data: Buffer,
    asType: new(...args: ArgsList) => ResultType,
    options: Partial<ParseBinaryOptions<ArgsList>> = {}
) => {

    const args : ArgsList = options
        ? options.args
            ? options.args 
            : [] as unknown as ArgsList 
        : [] as unknown as ArgsList,
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

        const propName : keyof ResultType | undefined = meta.propName

        const { read } = meta,
            [value, length] = read(data, offset + sourceOffset, obj)

        propName ? obj[propName] = value : null

        offset += length

    }

    return [obj, offset] as [ResultType, number]

}

