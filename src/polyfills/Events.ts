/**
 * Events
 */

export interface IEventEmitterPolyfill {
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(eventName: string | symbol): Function[];
    rawListeners(eventName: string | symbol): Function[];
    emit(eventName: string | symbol, ...args: any[]): boolean;
    listenerCount(eventName: string | symbol): number;
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    eventNames(): Array<string | symbol>;
}

export class EventEmitterPolyfill<EventType extends (string | symbol) = string | symbol> {

    constructor() {
        this._listeners = {}
        this._onceListeners = {}
    }

    private _listeners: { [event: string | symbol] : ((...args: any[]) => void)[] }
    private _onceListeners: { [event: string | symbol]: ((...args: any[]) => void)[] }
    private _maxListeners = 11;

    addListener(eventName: EventType, listener: (...args: any[]) => void): this {
        
        !this._listeners[eventName] ?
        this._listeners[eventName] = [] : null
        this._listeners[eventName].push(listener)
        return this;
    }

    removeListener(eventName: EventType, listener: (...args: any[]) => void): this {
        
        this._listeners[eventName] ?
        this._listeners[eventName] =
        this._listeners[eventName].filter($ => $ !== listener) :
        null

        this._onceListeners[eventName] ?
        this._onceListeners[eventName] =
        this._onceListeners[eventName].filter($ => $ !== listener) :
        null

        return this;
    }

    on(eventName: EventType, listener: (...args: any[]) => void): this {
        return this.addListener(eventName, listener)
    }

    once(eventName: EventType, listener: (...args: any[]) => void): this {
        !this._onceListeners[eventName] ?
        this._onceListeners[eventName] = [] : null
        this._onceListeners[eventName].push(listener)
        return this;
    }

    off(eventName: EventType, listener: (...args: any[]) => void): this {
        return this.removeListener(eventName, listener)
    }

    removeAllListeners(event?: EventType): this {
        if(event) {
            this._listeners[event] = []
            this._onceListeners[event] = []
        } else {
            this._listeners = {}
            this._onceListeners = {}
        }
        return this;
    }

    setMaxListeners(n: number): this {
        this._maxListeners = n;
        return this;
    }

    getMaxListeners(): number {
        return this._maxListeners;
    }

    listeners(eventName: EventType): Function[] {
        return [...this._listeners[eventName]]
    }

    rawListeners(eventName: EventType): Function[] {
        return [...this._listeners[eventName], ...this._onceListeners[eventName]]
    }

    emit(eventName: EventType, ...args: any[]): boolean {
        let caught = false
        if(this._listeners[eventName]) {
            this._listeners[eventName].map($ => $(...args))
            caught = true
        }
        if(this._onceListeners[eventName]) {
            this._onceListeners[eventName].map($ => $(...args))
            this._onceListeners[eventName] = []
            caught = true
        }
        return caught
    }

    listenerCount(eventName: EventType): number {
        return this._listeners[eventName] ?
            this._listeners[eventName].length : 0
    }

    prependListener(eventName: EventType, listener: (...args: any[]) => void): this {
        !this._listeners[eventName] ?
        this._listeners[eventName] = [] : null
        this._listeners[eventName].unshift(listener)
        return this;
    }

    prependOnceListener(eventName: EventType, listener: (...args: any[]) => void): this {
        !this._onceListeners[eventName] ?
        this._onceListeners[eventName] = [] : null
        this._onceListeners[eventName].unshift(listener)
        return this;
    }

    eventNames(): (EventType)[] {
        return [
            ...new Set([
                ...(Object.keys(this._listeners) as EventType[]),
                ...(Object.keys(this._onceListeners) as EventType[])
            ])
        ]
    }

}