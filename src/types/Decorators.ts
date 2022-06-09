
export type BinpacketClassDecorator<ArgsListType extends Array<any> = []> = (...args: ArgsListType) => ClassDecorator

export type BinpacketPropertyDecorator<
    Options extends {
        [key: string] : any
    },
    ClassType extends Object = Object
> = 
<
    PropertyType extends Object,
    ArgsList extends Array<any> = ConstructorParameters<abstract new(...args: any) => PropertyType>    
>(
    options?: Options,
    propType?: new(...args: ArgsList) => PropertyType,
    initArgs?: ArgsList
) => 
(target: ClassType, propertyKey: string | symbol) => void