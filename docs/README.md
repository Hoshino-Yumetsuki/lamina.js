# Lamina.js Documentation

Complete documentation for Lamina.js - WebAssembly bindings for the Lamina programming language.

## Documentation Index

### Getting Started

- **[Main README](../README.md)** - Project overview and quick start
- **[Usage Guide](./USAGE.md)** - Complete usage guide with examples
- **[Build Guide](./BUILD.md)** - Building from source

### API Documentation

- **[API Reference](./API_REFERENCE.md)** - Complete API reference for all functions

### Examples

See the [`examples/`](../examples/) directory for working code examples:

- `demo.js` - Quick demonstration of elegant API
- `elegant.js` - Complete elegant API examples
- `builtin.js` - All built-in functions demonstration
- `test.js` - Test suite
- `basic.js` - Basic usage examples

## Quick Links

### For Users

1. Start with the [Main README](../README.md) for installation and quick start
2. Read the [Usage Guide](./USAGE.md) for detailed examples
3. Check [API Reference](./API_REFERENCE.md) for complete API documentation
4. Run examples in [`examples/`](../examples/) directory

### For Developers

1. Read the [Build Guide](./BUILD.md) for build instructions
2. See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
3. Check the source code in [`src/`](../src/) directory

## API Overview

### Three Ways to Use Lamina.js

#### 1. **Global `lamina` Object** (Simplest)

```javascript
import { lamina } from 'lamina.js';
await lamina.init();
lamina.calc('2 + 3');
```

#### 2. **`LaminaContext` Class** (Isolated)

```javascript
import { LaminaContext } from 'lamina.js';
const ctx = await LaminaContext.create();
ctx.calc('2 + 3');
```

#### 3. **`LaminaMath` Class** (Extended)

```javascript
import { createMathContext } from 'lamina.js';
const math = await createMathContext();
math.sqrt(2);
```

## Features

-  Exact rational arithmetic
-  Symbolic mathematics
-  BigInt support
-  Vector/Matrix operations
-  Template tag syntax
-  TypeScript support
-  Multiple isolated contexts

## Support

- **Issues**: [GitHub Issues](https://github.com/Hoshino-Yumetsuki/lamina.js/issues)
- **License**: LGPL-2.1

---

For more information, visit the [main README](../README.md).
