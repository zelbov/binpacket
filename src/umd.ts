// buffer UInt64 fixes for browser for ESM module
import './browserhooks/UIntEndiannessFix'

import { Int8 } from "./decorators/property/Int8";
import { Int16 } from "./decorators/property/Int16";
import { Int32 } from "./decorators/property/Int32";
import { Int64 } from "./decorators/property/Int64";
import { parseBinary } from "./parser/Parser";
import { serializeBinary } from "./builder/Builder";
import { NestedBinary } from "./decorators/property/Nested";
import { BinaryString } from './decorators/property/String'
import { BinaryHeader } from "./decorators/class/BinaryHeader";
import { Float32 } from "./decorators/property/Float32";
import { Float64 } from "./decorators/property/Float64";
import { BinaryArray } from "./decorators/property/Array";
import { BinarySelector, identifyBinary } from "./decorators/class/BinarySelector";

const exports = {
    Int8, Int16, Int32, Int64,
    Float32, Float64,
    BinaryArray, NestedBinary, BinaryString,
    BinaryHeader, BinarySelector,
    parseBinary, serializeBinary, identifyBinary,
}

//@ts-ignore
global.Binpacket = exports;