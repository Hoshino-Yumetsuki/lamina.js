# Lamina.js

<div align="center">

**WebAssembly bindings for Lamina - A math-oriented programming language with precise calculations**

</div>

## Overview

Lamina.js brings the power of [Lamina](https://github.com/Lamina-dev/Lamina) - a precise mathematical programming language - to JavaScript and Node.js through WebAssembly.

### Key Features

- **Exact Rational Numbers** - No floating-point precision loss (`16/9` stays as `16/9`)
- **Symbolic Math** - Exact representation of √2, π, e, and other irrationals
- **BigInt Support** - Arbitrary precision integer arithmetic
- **Vector & Matrix** - Built-in support for linear algebra
- **Fast Execution** - Compiled to WebAssembly for near-native performance
- **Elegant API** - Simple, calculator-like syntax
- **Synchronous API** - No async/await after initialization

## Installation

```bash
npm install lamina.js
# or
yarn add lamina.js
```

## Quick Start

### Elegant API (Recommended)

The simplest way to use Lamina.js - like a calculator!

```javascript
import { lamina } from 'lamina.js';

// Use it directly!
console.log(lamina.calc('2 + 3'));           // 5
console.log(lamina.calc('16 / 9'));          // 16/9 (exact!)
console.log(lamina.calc('sqrt(16)'));        // 4

// Set variables
lamina.set('radius', 5);
console.log(lamina.calc('pi() * radius^2')); // 25π

// Template tag syntax
const x = 10;
const result = lamina.tag`${x} * 2 + 1`;
console.log(result); // 21

// Chain operations
lamina.set('a', 10).set('b', 20).exec('var sum = a + b;');
```

### Isolated Contexts

Create independent calculation environments:

```javascript
import { lamina } from 'lamina.js';

// Create isolated context
const ctx = await lamina.Context.create();
ctx.set('radius', 5).exec('var area = pi() * radius^2;');
console.log(ctx.get('area')); // 25π
ctx.destroy();
```

## Documentation

- [Complete Usage Guide](./docs/USAGE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Examples](./examples/)
- [Build Guide](./docs/BUILD.md)

## Examples

Run the included examples:

```bash
node examples/demo.js        # Quick demo
node examples/elegant.js     # Full elegant API examples
node examples/builtin.js     # All built-in functions
node examples/test.js        # Test suite
```

## TypeScript Support

Lamina.js is written in TypeScript and includes full type definitions:

```typescript
import { lamina } from 'lamina.js';

const result: string = lamina.calc('2 + 3');

// Create isolated contexts
const ctx = await lamina.Context.create();
```

## Building from Source

**You need cmake and emsdk to do this.**

```bash
# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test
```

See [BUILD.md](./docs/BUILD.md) for detailed build instructions.

## Related Projects

- [Lamina](https://github.com/Lamina-dev/Lamina) - The core Lamina programming language
