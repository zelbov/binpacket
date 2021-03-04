
export type BitOffset = number;
export type BytesRead = number;

export type PropertyBuilderFunction<ValueType = any> = 
    (value: ValueType, bitOffset?: number) => 
    [Buffer, BitOffset];

export type PropertyReaderFunction<ValueType = any> =
    (buffer: Buffer, offset: number, bitOffset?: number) => 
    [ValueType, BitOffset, BytesRead];

export type PropertyBuilderInit<Options, ValueType = any> = 
    (options: Options) => PropertyBuilderFunction<ValueType>

export type PropertyReaderInit<Options, ValueType = any> =
    (options: Options) => PropertyReaderFunction<ValueType>;

export interface BinaryFieldMetadata<ValueType = any>{

    propertyKey: string
    builder: PropertyBuilderFunction<ValueType>;
    reader: PropertyReaderFunction<ValueType>;

}

export interface BinaryObjectMetadata {

    __binmeta: BinaryFieldMetadata<any>[]
    constructor: { name: string }

    [key: string]: any

}