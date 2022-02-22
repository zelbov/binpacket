
export interface BinpacketDecoratorInitOptions<ArgsListType extends Array<any> = any[]>{

    [key: string]: any 

    /**
     * Whether byte order should be BigEndian.
     * 
     * Default: `false`
     * 
     */
    bigEndian: boolean

    /**
     * 
     * Whether a value representation should be unsigned.
     * 
     * Works with numeric values only
     * 
     * Default: `false`
     * 
     */
    unsigned: boolean

    /**
     * 
     * Property type initializer for `@Nested` properties
     * Used to identify a type of nested class containing binary structure definitions
     * 
     * Default: `Object`
     * 
     */
    type: new(...args: ArgsListType) => Object

    /**
     * 
     * Default arguments used to instantiate template class instance
     * Should be provided for classes with non-zero arguments count in constructor
     * to instantiate a template class before further calculations of their binary structures
     * 
     * Default: `[]`
     * 
     */
    templateArgs: ArgsListType

}

export type BinpacketClassDecorator = () => ClassDecorator

export type BinpacketPropertyDecorator = (options?: Partial<BinpacketDecoratorInitOptions>) => 
<ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => void