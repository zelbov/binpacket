import { Int16 } from "./decorators/property/Int16";
import { Int32 } from "./decorators/property/Int32";
import { parseBinary } from "./parser/Parser";
import { serializeBinary } from "./builder/Builder";
import { Int8 } from "./decorators/property/Int8";

export {

    // Class decorators
    //...
    
    // Property decorators
    Int8,
    Int16,
    Int32,

    // Common functions
    parseBinary,
    serializeBinary,

}