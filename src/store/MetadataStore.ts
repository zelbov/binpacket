import { BinaryStructureMetadataStore } from "../types/Store";
import { BinaryTransformMetadata } from "../types/TransformMetadata";

const MetadataStore : BinaryStructureMetadataStore = {}

let storeIdx = 0

export const getBinpacketMetadata : 
<ClassType extends Object>(target: ClassType, upsert?: boolean) => BinaryTransformMetadata<ClassType, any>[] | undefined =
(target, upsert: boolean = true) => {

    const proto = target.constructor.prototype

    if(!proto.__bin_id) 
        if(upsert)
            Object.defineProperty(proto, '__bin_id', {
                value: (storeIdx++).toString(),
                configurable: false,
                enumerable: false,
                writable: false,
            })
        else return undefined

    if(!MetadataStore[proto.__bin_id])
        MetadataStore[proto.__bin_id] = []
    return MetadataStore[proto.__bin_id]
}