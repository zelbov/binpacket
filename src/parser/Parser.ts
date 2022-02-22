import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

export const parseBinary = <ResultType = Function>(data: Buffer, asType: new() => ResultType) => {

    const obj = new asType()

    const stack : BinaryTransformMetadata<ResultType, any>[] = getBinpacketMetadata(obj)

    if(!stack)
        throw new Error(
            'Class '+asType.name+' has not been defined as binary data container. Use @Packet() decorator to identify it so.'
        )

    let offset = 0

    for(let meta of stack) {

        const propName : keyof ResultType = meta.propName

        const { size, read } = meta

        obj[propName] = read(data, offset)

        offset += size

    }

    return obj as ResultType

}

