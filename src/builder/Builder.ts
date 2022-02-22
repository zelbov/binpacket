import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"


export const serializeBinary = <ClassType extends Object>(from: ClassType) => {

    const stack : BinaryTransformMetadata<ClassType, any>[] | undefined = getBinpacketMetadata<ClassType>(from, false)

    if(!stack)
        throw new Error(
            'Class '+from.constructor.name+' has not been defined as binary data container. '+
            'Use at least one binary structure decorator to identify it so.'
        )

    const allocateTotal = stack.reduce<number>((prev, curr) => {
        return prev + (typeof(curr.size) == 'function' ? curr.size() : curr.size)
    }, 0)

    const buffer = Buffer.alloc(allocateTotal)

    let offset = 0

    stack.map(t => {
        t.write(buffer, from, offset)
        offset += (typeof(t.size) == 'function' ? t.size() : t.size)
    })

    return buffer

}