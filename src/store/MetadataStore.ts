import { BinaryStructureMetadataStore } from "../types/Store";
import { BinaryTransformMetadata } from "../types/TransformMetadata";

const MetadataStore : BinaryStructureMetadataStore = {}

let storeIdx = 0

export const getBinpacketMetadata : 
<ClassType extends Object>(target: ClassType, upsert?: boolean) => BinaryTransformMetadata<ClassType, any>[] | undefined =
(target, upsert: boolean = true) => {

    let storeId = 
        target.constructor.prototype.__bin_id

    if(storeId === undefined)
        //@ts-ignore
        storeId = target.constructor.__bin_id

    if(typeof(storeId) != 'number')
        if(upsert) {

            storeId = storeIdx++

            Object.defineProperty(target.constructor.prototype, '__bin_id', {
                value: storeId,
                configurable: false,
                enumerable: false,
                writable: false,
            })
        }
        else {

            return undefined

        }

    if(!MetadataStore[storeId])
        MetadataStore[storeId] = []
    return MetadataStore[storeId]
}