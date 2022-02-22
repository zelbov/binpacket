
export type BinaryReadHandler<ValueType> = (from: Buffer, offset: number) => ValueType

export type BinaryWriteHandler<ClassType> = (to: Buffer, source: ClassType, offset: number) => void

export interface BinaryTransformMetadata<ClassType, ValueType>{

    propName: keyof ClassType
    size: number | (() => number)
    read: BinaryReadHandler<ValueType>
    write: BinaryWriteHandler<ClassType>

}