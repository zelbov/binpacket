
// Multi-platform support type polyfill for:
// - WritableStream from `node`
// - Stream.Writable from package `stream`
interface StaticContainedWriterStream {
    ready?: Promise<undefined>
    write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean | Promise<void>
}

// Multi-platform support type polyfill for:
// - WritableStream from `libdom`
interface CallableContainedWriterStream {
    getWriter(): StaticContainedWriterStream;
}

type PipeTarget = StaticContainedWriterStream | CallableContainedWriterStream

export class WriteableStreamPolyfill
implements StaticContainedWriterStream, CallableContainedWriterStream {

    protected _pipes: ((chunk: any) => void)[]

    constructor(){ this._pipes = [] }

    getWriter() { return { write: this.write.bind(this) } }

    write(chunk: any) {
        this._pipes.map(write => write(chunk))
        return true
    }

    pipe(to: PipeTarget) {
        if((to as CallableContainedWriterStream).getWriter) {
            const writer = (to as CallableContainedWriterStream).getWriter()
            this._pipes.push((chunk) => {
                (writer.ready ? writer.ready : new Promise<void>((r) => {r()}))
                .then(() => { writer.write(chunk) })
            })
        } else
            this._pipes.push((to as StaticContainedWriterStream).write.bind(to))
        return this
    }

    close() { this._pipes = [] }

}