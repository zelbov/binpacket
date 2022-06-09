import { Int8 } from "./decorators/property/Int8";
import { Int16 } from "./decorators/property/Int16";
import { Int32 } from "./decorators/property/Int32";
import { Int64 } from "./decorators/property/Int64";
import { parseBinary } from "./parser/Parser";
import { serializeBinary } from "./builder/Builder";
import { NestedBinary } from "./decorators/property/Nested";
import { BinaryString } from './decorators/property/String'
import { BinaryHeader, BinaryHeaderParser, BinaryHeaderSerializer } from "./decorators/class/BinaryHeader";

export {

    // Class decorators
    //...
    
    // Property decorators
    Int8,
    Int16,
    Int32,
    Int64,

    BinaryString,

    NestedBinary,

    BinaryHeader,

    // Common functions
    parseBinary,
    serializeBinary,

    // Types
    BinaryHeaderParser,
    BinaryHeaderSerializer

}