/**
 * Writable
 */

import { EventEmitterPolyfill } from "./Events";
import {
    NodeReadableOptions,
    NodeWritable,
    WebWritable,
    WebWritableStreamDefaultWriter,
    WritablePipeTarget
} from "./Streams";

type WritableEventType =
| 'write'
| 'pipe'
| 'end'
| 'abort'
| 'close'

export class WritableStreamPolyfill<W = any>
extends EventEmitterPolyfill<WritableEventType>
implements 
NodeWritable,
WebWritable<W>,
WebWritableStreamDefaultWriter<W>
{

    private _closeHandlers!: {
        close: () => void, error: (err?: any) => void
    }

    private _closed : Promise<undefined>

    public get closed() { return this._closed }

    private _readyHandlers!: {
        ready: () => void, error: (err?: any) => void
    }

    private _ready: Promise<undefined>

    public get ready() { return this._ready }

    public get desiredSize() { return null }

    constructor(opts?: NodeReadableOptions){
        //TODO: implement options processing
        super()
        this._closed = new Promise<undefined>((resolve, reject) => {

            this._closeHandlers.close = () => resolve(undefined)
            this._closeHandlers.error = (err?: any) => reject(err)

        })
        this._ready = new Promise<undefined>((resolve, reject) => {

            this._readyHandlers.ready = () => resolve(undefined)
            this._readyHandlers.error = (err?: any) => reject(err)

        })
        this._writable = true
        this._pipeTargets = []
    }

    private _pipeTargets: WritablePipeTarget[]

    pipe<T extends WritablePipeTarget<any>>(destination: T, options?: { end?: boolean | undefined; }): T {
        this._pipeTargets.push(destination)
        this.emit('pipe') //TODO: specify correct parameters
        return destination
    }

    write(
        ...args: 
        | [buffer: Uint8Array | string, cb?: (err?: Error | null) => void] 
        | [str: string, encoding?: BufferEncoding, cb?: (err?: Error | null) => void]
        | [chunk?: W]
    ): any /* boolean | Promise<void> */ {
        const [bufferOrChunk, callbackOrEncoding, callbackIfEncoding] = args
        this._pipeTargets.map(
            $ => ($ as NodeWritable).writable ?
                ($ as NodeWritable).write(
                    (bufferOrChunk as any),
                    callbackOrEncoding as (BufferEncoding | undefined), callbackIfEncoding
                ) :
                ($ as WebWritable).getWriter
                ? ($ as WebWritable).getWriter().write(bufferOrChunk as W)
                : null
        )
        this.emit('write', bufferOrChunk) //TODO: specify correct parameters
    }

    private _writable: boolean

    public get writable() { return this._writable }

    end(
        ...args:
        | [cb?: () => void]
        | [data: string | Uint8Array, cb?: () => void]
        | [str: string, encoding?: BufferEncoding, cb?: () => void]
    ) : this {
        
        //...
        this.emit('end') //TODO: specify correct parameters
        return this;

    }

    async abort(reason?: any): Promise<void> {
        this.emit('abort') //TODO: specify correct parameters
        this._closeHandlers.error(reason)
        this._readyHandlers.error(reason)
        this._writable = false
    }

    async close(): Promise<void> {
        this.emit('close')
        this._closeHandlers.close()
        this._readyHandlers.error('Stream closed')
        this._writable = false
    }

    releaseLock(): void {
        //NO-OP since this polyfill does not lock a stream to a single writer unlike web version does
    }

    public get locked() { return false }

    getWriter() {

        return this

    }

}