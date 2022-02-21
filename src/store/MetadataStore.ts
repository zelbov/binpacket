import { BinaryStructureMetadataStore } from "../types/Store";
import { BinaryTransformMetadata } from "../types/TransformMetadata";

const MetadataStore : BinaryStructureMetadataStore = {}

export const getBinpacketMetadata : 
<ClassType extends Object>(target: string) => BinaryTransformMetadata<ClassType, any>[] =
(target) => {
    if(!MetadataStore[target])
        MetadataStore[target] = []
    return MetadataStore[target]
}