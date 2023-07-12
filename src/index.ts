//buffer browser polyfill with UInt64 fixes
if(typeof(window) != 'undefined') require('./polyfills/BufferPolyfill')

export { Int8 } from "./decorators/property/Int8";
export { Int16 } from "./decorators/property/Int16";
export { Int32 } from "./decorators/property/Int32";
export { Int64 } from "./decorators/property/Int64";
export { parseBinary } from "./parser/Parser";
export { serializeBinary } from "./builder/Builder";
export { NestedBinary } from "./decorators/property/Nested";
export { BinaryString } from './decorators/property/String'
export { BinaryHeader, BinaryHeaderParser, BinaryHeaderSerializer } from "./decorators/class/BinaryHeader";
export { Float32 } from "./decorators/property/Float32";
export { Float64 } from "./decorators/property/Float64";
export { BinaryArray } from "./decorators/property/Array";
export { BinarySelector, identifyBinary } from "./decorators/class/BinarySelector";
export { BinaryWriteStream } from "./streams/BinaryStreamWriter";
export { BinaryReadStream } from "./streams/BinaryStreamReader";
