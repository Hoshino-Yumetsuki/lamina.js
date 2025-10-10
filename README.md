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

// Initialize once
await lamina.init();

// Use it like a calculator!
console.log(lamina.calc('2 + 3'));           // 5
console.log(lamina.calc('16 / 9'));          // 16/9 (exact!)
console.log(lamina.calc('sqrt(2) * sqrt(2)')); // 2 (no rounding!)

// Set variables
lamina.set('radius', 5);
console.log(lamina.calc('pi() * radius^2')); // 25π

// Template tag syntax
const x = 10;
const result = lamina.tag`${x} * 2 + 1`;
console.log(result); // 21

// Chain operations
lamina
  .set('a', 10)
  .set('b', 20)
  .exec('var sum = a + b;');
```

### Core API

For more control and isolated contexts:

```javascript
import { createInterpreter, LaminaContext } from 'lamina.js';

// Create interpreter instance
const interpreter = await createInterpreter();
interpreter.setVariable('x', 42);
console.log(interpreter.getVariable('x')); // 42
interpreter.destroy();

// Or use isolated context
const ctx = await LaminaContext.create();
ctx.set('radius', 5).exec('var area = pi() * radius^2;');
console.log(ctx.get('area')); // 25π
ctx.destroy();
```

## Examples

### Exact Arithmetic

```javascript
// No floating-point errors!
lamina.calc('1/3 + 1/6');        // 1/2 (exact)
lamina.calc('0.1 + 0.2');        // 0.3 (exact)
lamina.calc('sqrt(8)');          // 2√2 (simplified)
```

### Vector Operations

```javascript
lamina.exec('var v1 = [1, 2, 3];');
lamina.exec('var v2 = [4, 5, 6];');
lamina.calc('v1 + v2');          // [5, 7, 9]
lamina.calc('dot(v1, v2)');      // 32
```

### Custom Functions

```javascript
const ctx = await LaminaContext.create();
ctx.define(`
  func fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
`);
console.log(ctx.call('fibonacci', 10)); // 55
```

## API Overview

### `lamina` Object

Global singleton for simple calculations:

```javascript
await lamina.init()                    // Initialize (call once)
lamina.calc(expression)                // Calculate expression
lamina.set(name, value)                // Set variable (chainable)
lamina.get(name)                       // Get variable
lamina.exec(code)                      // Execute code (chainable)
lamina.tag`expression`                 // Template tag
lamina.cleanup()                       // Clean up
```

### `LaminaContext` Class

Isolated calculation context:

```javascript
const ctx = await LaminaContext.create()
ctx.calc(expression)                   // Calculate
ctx.set(name, value)                   // Set variable (chainable)
ctx.get(name)                          // Get variable
ctx.exec(code)                         // Execute code (chainable)
ctx.define(functionCode)               // Define function
ctx.call(name, ...args)                // Call function
ctx.reset()                            // Reset context
ctx.destroy()                          // Clean up
```

### `LaminaMath` Class

Extended math API with all built-in functions:

```javascript
const math = await createMathContext()
math.sqrt(x), math.pi(), math.e()      // Math functions
math.dot(v1, v2), math.cross(v1, v2)   // Vector operations
math.rand(), math.randint(min, max)    // Random functions
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
import { lamina, LaminaContext, LaminaMath } from 'lamina.js';

await lamina.init();
const result: string = lamina.calc('2 + 3');

const ctx: LaminaContext = await LaminaContext.create();
const math: LaminaMath = await createMathContext();
```

## Building from Source

> You need cmake and emsdk to do this.

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
