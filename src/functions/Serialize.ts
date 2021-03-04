import { BinaryObjectMetadata } from "../types/Common.types";
import { verifyMetadata } from "./Verify";

export const serializePacket = <T>(
    buffer: Buffer, 
    to: T
) : T => {

    let struct : any = to,
        proto: BinaryObjectMetadata = struct;

    verifyMetadata(struct);

    let bitOffset = 0, offset = 0;

    for(let meta of proto.__binmeta){

        let result = meta.reader(buffer, offset, bitOffset);
        bitOffset = result[1];
        offset += result[2];
        struct[meta.propertyKey] = result[0];

    }

    //TODO: apply property values to serialized object using prototype definitions

    return to;

}