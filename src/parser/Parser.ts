import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

export const parseBinary = <ResultType = Function>(data: Buffer, asType: new() => ResultType) => {

    const stack : BinaryTransformMetadata<ResultType, any>[] = getBinpacketMetadata(asType.name)

    if(!stack)
        throw new Error(
            'Class '+asType.name+' has not been defined as binary data container. Use @Packet() decorator to identify it so.'
        )

    const obj = new asType()

    let offset = 0

    for(let meta of stack) {

        const propName : keyof ResultType = meta.propName

        const { size, read } = meta

        obj[propName] = read(data, offset)

        offset += size

    }

    return obj as ResultType

}

