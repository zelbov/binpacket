import { BinaryStructureMetadataStore } from "../types/Store";
import { BinaryTransformMetadata } from "../types/TransformMetadata";

const MetadataStore : BinaryStructureMetadataStore = {}

let storeIdx = 0

export const getBinpacketMetadata : 
<ClassType extends Object>(target: ClassType) => BinaryTransformMetadata<ClassType, any>[] =
(target) => {

    const proto = Object.getPrototypeOf(target)

    if(!proto.__bin_id) Object.defineProperty(proto, '__bin_id', {
        value: (storeIdx++).toString(),
        configurable: false,
        enumerable: false,
        writable: false,
    })

    if(!MetadataStore[proto.__bin_id])
        MetadataStore[proto.__bin_id] = []
    return MetadataStore[proto.__bin_id]
}