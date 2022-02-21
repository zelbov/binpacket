

export interface BinaryTransformMetadata<ClassType, ValueType>{

    propName: keyof ClassType
    size: number
    read: (from: Buffer, offset: number) => ValueType
    write: (to: Buffer, source: ClassType, offset: number) => void

}