# Building Lamina.js

This document provides detailed instructions for building Lamina.js from source.

> If you want to use your custom plugin, you should add your plugin and build Lamina.js from source by yourself.
## Prerequisites

### Required Software

1. **Node.js** (>= 14.0.0)
   - Download: https://nodejs.org/

2. **Emscripten SDK** (>= 3.1.0)
   - Installation guide: https://emscripten.org/docs/getting_started/downloads.html
   - Quick install:
     ```bash
     # Clone Emscripten SDK
     git clone https://github.com/emscripten-core/emsdk.git
     cd emsdk

     # Install and activate latest version
     ./emsdk install latest
     ./emsdk activate latest

     # Add to PATH (or add to .bashrc/.zshrc)
     source ./emsdk_env.sh
     ```

3. **CMake** (>= 3.16.3)
   - Download: https://cmake.org/download/

4. **Python** (>= 3.6)
   - Required by Emscripten
   - Download: https://www.python.org/downloads/

### Verify Installation

```bash
# Check Node.js
node --version

# Check Emscripten
emcc --version

# Check CMake
cmake --version
```

## Building Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Lamina-dev/Lamina.js.git
cd lamina.js
```

### 2. Initialize Submodules

Lamina.js uses the Lamina C++ interpreter as a submodule:

```bash
git submodule update --init --recursive
```

### 3. Install Node.js Dependencies

```bash
npm install
# or
yarn install
```

### 4. Build WebAssembly Module

#### Debug Build

For development with debug symbols and assertions:

```bash
npm run build:wasm:debug
```

This will:
- Configure CMake with Debug build type
- Compile with -O0 (no optimization)
- Enable assertions and safe heap
- Include debug symbols (-g)

#### Release Build

For production with optimizations:

```bash
npm run build:wasm:release
```

This will:
- Configure CMake with Release build type
- Compile with -O3 (maximum optimization)
- Disable assertions
- Minimize WASM size

### 5. Prepare Distribution Files

```bash
npm run build:js
```

This copies the JavaScript wrapper and WASM files to `dist/`.

### 6. Run Tests

```bash
npm test
```

## Build Output

After a successful build, you should have:

```
dist/
├── lamina.wasm      # WebAssembly binary
├── lamina.js        # Emscripten glue code
└── index.js         # JavaScript wrapper
```

## Build Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build:wasm` | Alias for build:wasm:debug |
| `npm run build:wasm:debug` | Build WASM in debug mode |
| `npm run build:wasm:release` | Build WASM in release mode |
| `npm run build:js` | Copy files to dist/ |
| `npm run build` | Full build (WASM release + JS) |
| `npm run clean` | Clean build artifacts |
| `npm test` | Run tests |

## Manual Build

If you prefer to build manually:

```bash
# Configure with Emscripten
emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build

# Copy output files
cp build/lamina.wasm dist/
cp build/lamina.js dist/
cp src/index.js dist/
```

## Troubleshooting

### Issue: emcmake not found

**Solution**: Make sure Emscripten is properly installed and activated:

```bash
source /path/to/emsdk/emsdk_env.sh
```

Add this to your `.bashrc` or `.zshrc` for permanent activation.

### Issue: CMake version too old

**Solution**: Update CMake to version 3.16.3 or later:

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install cmake

# On macOS
brew install cmake

# Or download from https://cmake.org/download/
```

### Issue: Submodule not initialized

**Solution**: Initialize the Lamina submodule:

```bash
git submodule update --init --recursive
```

### Issue: Build fails with memory errors

**Solution**: Try building with more memory:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: WASM file too large

**Solution**: Make sure you're using release build:

```bash
npm run build:wasm:release
```

Release builds are significantly smaller due to optimizations.

## Development Workflow

### Making Changes to Bindings

1. Edit `bindings/wasm_bindings.cpp`
2. Rebuild WASM: `npm run build:wasm:debug`
3. Test: `npm test`

### Making Changes to JavaScript Wrapper

1. Edit `src/index.js`
2. Copy to dist: `npm run build:js`
3. Test: `npm test`

### Making Changes to Lamina Core

1. Edit files in `Lamina/` submodule
2. Rebuild WASM: `npm run build:wasm:debug`
3. Test: `npm test`

## Build Optimization

### Size Optimization

For smaller WASM files, you can modify `CMakeLists.txt`:

```cmake
# Add these flags
-s ELIMINATE_DUPLICATE_FUNCTIONS=1
-s AGGRESSIVE_VARIABLE_ELIMINATION=1
```

### Performance Optimization

For faster execution:

```cmake
# Use
-O3
-s ALLOW_MEMORY_GROWTH=0  # If memory requirements are known
```

## Cross-Platform Notes

### Windows

- Use Git Bash or WSL for bash scripts
- Or use CMD/PowerShell equivalents:
  ```cmd
  npm run build:wasm:release
  npm run build:js
  ```

### Linux/macOS

- Bash scripts should work out of the box
- Make sure `scripts/build.sh` is executable:
  ```bash
  chmod +x scripts/build.sh
  ```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
      with:
        submodules: recursive

    - uses: mymindstorm/setup-emsdk@v12

    - uses: actions/setup-node@v3
      with:
        node-version: '16'

    - run: npm install
    - run: npm run build
    - run: npm test
```

## Further Resources

- [Emscripten Documentation](https://emscripten.org/docs/)
- [CMake Documentation](https://cmake.org/documentation/)
- [Lamina Language Documentation](https://github.com/Lamina-dev/Lamina/wiki)
