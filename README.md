# binpacket

Isomorphic binary data parser & serializer for JavaScript and Typescript

## Features

- Parses binary data into JavaScript object of a chosen structure
- Supports structure declaration with decorators
- Serializes objects into their binary representation according to given structure declaration
- Supports structures nesting
- Cross-platform (Node, Browser) zero-dependency, and lightweight (![binpacket.min.js size](https://img.badgesize.io/https://unpkg.com/binpacket@0.1.1/umd/binpacket.min.js))

## Installation

Node:

`npm i -S binpacket`

Browser (UMD)

```HTML

<!-- core package -->
<script type="text/javascript" src="https://unpkg.com/binpacket@0.1.1/umd/binpacket.min.js"></script>
<!-- will provide Binpacket UMD global -->

```

## Basic usage

JavaScript:

```JS
const { parseBinary, serializeBinary, Int16 } = require('binpacket')

class Foo {

    bar;

}

// a functional equivalent to TS decorator call
Int16() (Foo, 'bar')

const obj = new Foo()
obj.bar = 1337

const binary = serializeBinary(obj)

console.log(binary) // > <Buffer 39 05>

const [parsed, byteSize] = parseBinary(binary, Foo)

console.log(parsed) // > Foo { bar: 1337 }
console.log(byteSize) // > 2
```

TypeScript:

```TS
import { Int16, parseBinary, serializeBinary } from 'binpacket'

class Foo {

    @Int16()
    bar!: number

}

const obj = new Foo()
obj.bar = 1337

const binary = serializeBinary(obj)

console.log(binary) // > <Buffer 39 05>

const [parsed, byteSize] = parseBinary(binary, Foo)

console.log(parsed) // > Foo { bar: 1337 }
console.log(byteSize) // > 2
```

For extended usage examples and instructions please refer to [full documentation page](https://github.com/zelbov/binpacket/blob/main/doc/README.md) on GitHub.

## Requirements

### Node.JS

No additional requirements provided for Node runtime

### Typescript

In case of using Typescript, `experimentalDecorators` flag must be set to `true` in `compilerOptions` of `tsconfig.json`

This package has been created using Typescript ver. `4.7.4`. Support for lower versions has not yet been tested, so not guaranteed.

### Browser

When running in a browser, this package requires `buffer` polyfill. It is recommended to load it before `binpacket`, since this package applies additional patches over a standard polyfill, e.g. `UInt64` endiannes fixes.

Also, in certain use cases it might also require `stream-browserify`.

## License

This product is being distributed for free and without any warranty. Copying, redistribution and modification of this code are not subjects to regulations, but including original links to initial version of this product within any redistribution is highly appreciated.

## TBD

- Representing Int64 and UInt64 as BigInt (+tests)
- Extended documentation
- Partial binary structure load support (e.g. while streaming)
