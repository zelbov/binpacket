import { IEventEmitterPolyfill } from "./Events";

export type BufferEncoding = 
| 'ascii' 
| 'utf8' 
| 'utf-8' 
| 'utf16le' 
| 'ucs2' 
| 'ucs-2' 
| 'base64' 
| 'base64url' 
| 'latin1' 
| 'binary' 
| 'hex'
;

export interface Abortable {
    signal?: AbortSignal | undefined;
}

export interface NodeStreamOptions<T extends NodeStream> extends Abortable {
    emitClose?: boolean | undefined;
    highWaterMark?: number | undefined;
    objectMode?: boolean | undefined;
    construct?(this: T, callback: (error?: Error | null) => void): void;
    destroy?(this: T, error: Error | null, callback: (error: Error | null) => void): void;
    autoDestroy?: boolean | undefined;
}

export interface NodeReadableOptions extends NodeStreamOptions<NodeReadable> {
    encoding?: BufferEncoding | undefined;
    read?(this: NodeReadable, size: number): void;
}

/**
 * Writable
 */

export interface NodeWritable extends IEventEmitterPolyfill, NodeStream {
    writable: boolean;
    write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void): boolean;
    write(str: string, encoding?: BufferEncoding, cb?: (err?: Error | null) => void): boolean;
    end(cb?: () => void): this;
    end(data: string | Uint8Array, cb?: () => void): this;
    end(str: string, encoding?: BufferEncoding, cb?: () => void): this;
}

export interface WebWritableStreamDefaultWriter<W = any> {
    readonly closed: Promise<undefined>;
    readonly desiredSize: number | null;
    readonly ready: Promise<undefined>;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    releaseLock(): void;
    write(chunk?: W): Promise<void>;
}

export type WritablePipeTarget<W = any> = NodeWritable | WebWritable<W>

export interface WebWritable<W = any> {
    readonly locked: boolean;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    getWriter(): WebWritableStreamDefaultWriter<W>;
}

export interface NodeStream {
    //new (opts?: NodeReadableOptions): NodeStream;
    pipe<T extends NodeWritable>(
        destination: T,
        options?: {
            end?: boolean | undefined;
        }
    ): T;
    pipe<T extends WebWritable>(
        destination: T,
        options?: {
            end?: boolean | undefined;
        }
    ): T;
}



/**
 * Readable
 */

// Node readable typings

export interface NodeReadable extends IEventEmitterPolyfill, NodeStream {
    readable: boolean;
    read(size?: number): string | Buffer;
    setEncoding(encoding: BufferEncoding): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    pipe<T extends WritablePipeTarget>(destination: T, options?: { end?: boolean | undefined; }): T;
    unpipe(destination?: WritablePipeTarget): this;
    unshift(chunk: string | Uint8Array, encoding?: BufferEncoding): void;
    wrap(oldStream: ReadableWrapTarget): this;
    //[Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
    //TODO: implement too?
}

// Web readable typings

export interface WebReadableDefaultReadValueResult<T> {
    done: false;
    value: T;
}

export interface WebReadableDefaultReadDoneResult {
    done: true;
    value?: undefined;
}

export type WebReadableDefaultReadResult<T> = WebReadableDefaultReadValueResult<T> | WebReadableDefaultReadDoneResult;

export interface WebReadableGenericReader {
    readonly closed: Promise<undefined>;
    cancel(reason?: any): Promise<void>;
}

export interface WebReadableDefaultReader<R = any> extends WebReadableGenericReader {
    read(): Promise<WebReadableDefaultReadResult<R>>;
    releaseLock(): void;
}

export interface WebStreamPipeOptions {
    preventAbort?: boolean;
    preventCancel?: boolean;
    preventClose?: boolean;
    signal?: AbortSignal;
}

export interface WebReadableWritablePair<R = any, W = any> {
    readable: WebReadable<R>;
    writable: WebWritable<W>;
}

export interface WebReadable<R = any> {
    readonly locked: boolean;
    cancel(reason?: any): Promise<void>;
    getReader(): WebReadableDefaultReader<R>;
    pipeThrough<T>(transform: WebReadableWritablePair<T, R>, options?: WebStreamPipeOptions): WebReadable<T>;
    pipeTo(destination: WebWritable<R>, options?: WebStreamPipeOptions): Promise<void>;
    tee(): [WebReadable<R>, WebReadable<R>];
}

export type ReadableWrapTarget = NodeReadable | WebReadable
