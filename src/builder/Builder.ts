import { getBinpacketMetadata } from "../store/MetadataStore"
import { BinaryTransformMetadata } from "../types/TransformMetadata"


export const serializeBinary = <ClassType extends Object>(from: ClassType) => {

    const stack : BinaryTransformMetadata<ClassType, any>[] = getBinpacketMetadata<ClassType>(from)


    let allocateTotal = stack.reduce<number>((prev, curr) => {
        return prev + curr.size
    }, 0)

    const buffer = Buffer.alloc(allocateTotal)

    let offset = 0

    stack.map(t => {
        t.write(buffer, from, offset)
        offset += t.size
    })

    return buffer

}