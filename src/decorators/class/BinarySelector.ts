import { BinpacketClassDecorator } from "../../types/Decorators"
import { BinaryHeader, BinaryHeaderParser } from "./BinaryHeader"

type SelectedStructure = new (...args: any) => any

type BinarySelectorHeaderSerializer<SourceType extends Object = any> = 
(id: number, source: SourceType, serialized: Buffer) => Buffer

type BinarySelectorHeaderParser = (id: number, serialized: Buffer) => Buffer

type BinarySelectorOptions = {

    //TODO: id should be of type string | number | symbol
    id: number
    minBufferSize: number
    parse: BinarySelectorHeaderParser
    serialize: BinarySelectorHeaderSerializer

}

type BinarySelectorStoreEntry  = {

    type: SelectedStructure
    minBufferSize: number

}

const selectorStore : {
    [storeIdx: number]: BinarySelectorStoreEntry
} = {}

export const BinarySelector : BinpacketClassDecorator<[BinarySelectorOptions]>
= (options) => (target) => {

    selectorStore[options.id] = { minBufferSize: options.minBufferSize, type: target.prototype.constructor }
    const { parse, serialize } = options;

    BinaryHeader({
        parse: (source) => parse(options.id, source),
        serialize: (source, serialized) => serialize(options.id, source, serialized)
    })(target)

}

export const identifyBinary : (source: Buffer, getId: (source: Buffer) => number) => SelectedStructure | undefined
= (source, getId) => {

    const id = getId(source),
        { type, minBufferSize } = selectorStore[id]

    if(minBufferSize > source.length) return undefined;
    else return type;
    
}