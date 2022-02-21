

export type BinpacketClassDecorator = () => ClassDecorator

export type BinpacketPropertyDecorator = () => 
<ClassType extends Object>(target: ClassType, propertyKey: string | symbol) => void