import { BinaryObjectMetadata } from "../types/Common.types";
import { verifyMetadata } from "./Verify";

export const buildPacket = (obj: any) : Buffer => {

    let struct : BinaryObjectMetadata = obj;

    verifyMetadata(struct);

    let bitOffset = 0, data = Buffer.alloc(0);

    for(let meta of struct.__binmeta){

        let result = meta.builder(struct[meta.propertyKey], bitOffset);
        bitOffset = result[1];
        data = Buffer.concat([data, result[0]]);

    }

    return data;

}