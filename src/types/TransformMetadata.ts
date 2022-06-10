
export type BinaryReadHandler<ValueType> = (from: Buffer, offset: number) => [value: ValueType, length: number]

export type BinaryWriteHandler<ClassType> = (
    to: Buffer,
    source: ClassType,
    offset: number,
    propName: keyof ClassType | undefined
) => [number, Buffer]

export interface BinaryTransformMetadata<ClassType, ValueType>{

    propName?: keyof ClassType
    size: number | ((source: ValueType, propName: keyof ValueType) => number)
    read: BinaryReadHandler<ValueType>
    write: BinaryWriteHandler<ClassType>

}