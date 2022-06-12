import { Int8 } from "./decorators/property/Int8";
import { Int16 } from "./decorators/property/Int16";
import { Int32 } from "./decorators/property/Int32";
import { Int64 } from "./decorators/property/Int64";
import { parseBinary } from "./parser/Parser";
import { serializeBinary } from "./builder/Builder";
import { NestedBinary } from "./decorators/property/Nested";
import { BinaryString } from './decorators/property/String'
import { BinaryHeader, BinaryHeaderParser, BinaryHeaderSerializer } from "./decorators/class/BinaryHeader";
import { Float32 } from "./decorators/property/Float32";
import { Float64 } from "./decorators/property/Float64";
import { BinaryArray } from "./decorators/property/Array";
import { BinarySelector, identifyBinary } from "./decorators/class/BinarySelector";
import { BinaryWriteStream } from "./streams/BinaryStreamWriter";

export {

    // Class decorators
    BinaryHeader,
    BinarySelector,
    
    // Property decorators
    Int8,
    Int16,
    Int32,
    Int64,
    Float32,
    Float64,

    BinaryString,

    NestedBinary,

    BinaryArray,

    // Common functions
    parseBinary,
    serializeBinary,
    identifyBinary,

    // Streams
    BinaryWriteStream,

    // Types
    BinaryHeaderParser,
    BinaryHeaderSerializer

}