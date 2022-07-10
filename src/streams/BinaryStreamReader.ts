import { EventEmitter } from "events";
import { Transform, TransformCallback } from "stream"
import { identifyBinary } from "../decorators/class/BinarySelector"
import { parseBinary } from "../parser/Parser"

declare interface ParsedStructureEmitter<ObjectType> {

    on(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    once(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    addListener(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    removeListener(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    off(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    prependListener(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    prependOnceListener(eventName: 'data', listener: (data: [result: ObjectType, len: number]) => void): this;
    emit(eventName: 'data', data: [result: ObjectType, len: number]): boolean;

}

class ParsedStructureEmitter<ObjectType> extends EventEmitter {}

export class BinaryReadStream
extends Transform
{

    private _identifier: (source: Buffer) => number

    constructor(getId: (source: Buffer) => number) {
        super()
        this._conditionalEmitters = {}
        this._identifier = getId
    }

    private _conditionalEmitters : {[binId: string]: ParsedStructureEmitter<any>}

    when<ObjectType = Object>(type: new(...args: any) => ObjectType) : ParsedStructureEmitter<ObjectType> {
        const proto = type.prototype,
            name = proto.constructor.name,
            binId = proto.__bin_id
        if(typeof(binId) !== 'string') throw new Error('Conditional type '+name+' does not have registered binary metadata')
        if(!this._conditionalEmitters[binId])
            this._conditionalEmitters[binId] = new ParsedStructureEmitter<ObjectType>()
        return this._conditionalEmitters[binId] as ParsedStructureEmitter<ObjectType>
    }

    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        try {
            const template = identifyBinary(chunk, this._identifier)
            if(!template) {
                //TODO: specify correct behavior when unidentified/incomplete data arrives
                //this.unshift(chunk)
            } else {
                const [result, len] = parseBinary<typeof template>(chunk, template)
                this.when(template).emit('data', [result, len])
                if(len < chunk.length) this.unshift(chunk.slice(len))
            }
            callback(null, chunk)
        } catch(ex) {
            //TODO: specify correct behavior when unidentified/incomplete data arrives
            //this.unshift(chunk)
            callback(ex as Error)
        }
    }

}