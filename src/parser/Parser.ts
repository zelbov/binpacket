import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

export const parseBinary = <ResultType = Function>(data: Buffer, asType: new() => ResultType, sourceOffset = 0) => {

    const obj = new asType()

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

