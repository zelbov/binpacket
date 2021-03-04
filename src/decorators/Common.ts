import { BinaryFieldMetadata, BinaryObjectMetadata } from "../types/Common.types";

export const ApplyPrototypeMetadata = (
    target: any,
    metadata: BinaryFieldMetadata<any>
) => {

    let { __binmeta } : BinaryObjectMetadata = 
        target.prototype ? target.prototype : target;

    if(!__binmeta) __binmeta = [];

    __binmeta.push(metadata);

    Object.assign(target.prototype ? target.prototype : target, { __binmeta });

}