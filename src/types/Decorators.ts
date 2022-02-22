
export type BinpacketClassDecorator = () => ClassDecorator

export type BinpacketPropertyDecorator<
    Options extends {
        [key: string] : any
    },
    ClassType extends Object = Object
> = 
(options?: Options) => 
(target: ClassType, propertyKey: string | symbol) => void

export type BinpacketPropertyTypedDecorator<
    Options extends {
        [key: string] : any
    },
    ClassType extends Object = Object
> = 
<
    PropertyType extends Object,
    ArgsList extends Array<any> = ConstructorParameters<abstract new(...args: any) => PropertyType>    
>(
    propType: new(...args: ArgsList) => PropertyType,
    options: Options,
    templateArgs: ArgsList
) => 
(target: ClassType, propertyKey: string | symbol) => void