import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"

export const serializeBinary = <ClassType extends Object>(from: ClassType) => {

    const stack : BinaryTransformMetadata<ClassType, any>[] | undefined = getBinpacketMetadata<ClassType>(from, false)

    if(!stack)
        throw new Error(
            'Class '+from.constructor.name+' has not been defined as binary data container. '+
            'Use at least one binary structure decorator to identify it so.'
        )

    const allocateTotal = stack.reduce<number>((prev, curr) => 
        prev + ((+curr.size) || curr.propName && (curr.size as Function)(from[curr.propName] || 0)), 0
    )

    let buffer = Buffer.alloc(allocateTotal)

    let offset = 0

    stack.map(t => {
        const wrote = t.write(buffer, from, offset, t.propName)
        offset += wrote
    })

    return buffer

}