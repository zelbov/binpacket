
export interface BinpacketDecoratorInitOptions {

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

}

export type BinpacketClassDecorator = () => ClassDecorator

export type BinpacketPropertyDecorator = (options?: Partial<BinpacketDecoratorInitOptions>) => 
<ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => void