# 构建 Lamina.js

本文档提供了从源代码构建 Lamina.js 的详细说明。

> 如果你想使用自定义插件，需要添加插件并自行从源代码构建 Lamina.js。

## 前置要求

### 必需软件

1. **Node.js** (>= 14.0.0)
   - 下载地址：https://nodejs.org/

2. **Emscripten SDK** (>= 3.1.0)
   - 安装指南：https://emscripten.org/docs/getting_started/downloads.html
   - 快速安装：
     ```bash
     # 克隆 Emscripten SDK
     git clone https://github.com/emscripten-core/emsdk.git
     cd emsdk

     # 安装并激活最新版本
     ./emsdk install latest
     ./emsdk activate latest

     # 添加到 PATH（或添加到 .bashrc/.zshrc）
     source ./emsdk_env.sh
     ```

3. **CMake** (>= 3.16.3)
   - 下载地址：https://cmake.org/download/

4. **Python** (>= 3.6)
   - Emscripten 需要
   - 下载地址：https://www.python.org/downloads/

### 验证安装

```bash
# 检查 Node.js
node --version

# 检查 Emscripten
emcc --version

# 检查 CMake
cmake --version
```

## 构建步骤

### 1. 克隆仓库

```bash
git clone https://github.com/Lamina-dev/Lamina.js.git
cd lamina.js
```

### 2. 初始化子模块

Lamina.js 使用 Lamina C++ 解释器作为子模块：

```bash
git submodule update --init --recursive
```

### 3. 安装 Node.js 依赖

```bash
npm install
# 或
yarn install
```

### 4. 构建 WebAssembly 模块

#### Debug 构建

用于开发，包含调试符号和断言：

```bash
npm run build:wasm:debug
```

这将：
- 使用 Debug 构建类型配置 CMake
- 使用 -O0 编译（无优化）
- 启用断言和安全堆
- 包含调试符号（-g）

#### Release 构建

用于生产环境，包含优化：

```bash
npm run build:wasm:release
```

这将：
- 使用 Release 构建类型配置 CMake
- 使用 -O3 编译（最大优化）
- 禁用断言
- 最小化 WASM 大小

### 5. 准备分发文件

```bash
npm run build:js
```

这会将 JavaScript 包装器和 WASM 文件复制到 `dist/` 目录。

### 6. 运行测试

```bash
npm test
```

## 构建输出

成功构建后，你应该会得到：

```
dist/
├── lamina.wasm      # WebAssembly 二进制文件
├── lamina.js        # Emscripten 胶水代码
└── index.js         # JavaScript 包装器
```

## 构建脚本参考

| 脚本 | 描述 |
|--------|-------------|
| `npm run build:wasm` | build:wasm:debug 的别名 |
| `npm run build:wasm:debug` | 以 debug 模式构建 WASM |
| `npm run build:wasm:release` | 以 release 模式构建 WASM |
| `npm run build:js` | 复制文件到 dist/ |
| `npm run build` | 完整构建（WASM release + JS） |
| `npm run clean` | 清理构建产物 |
| `npm test` | 运行测试 |

## 手动构建

如果你更喜欢手动构建：

```bash
# 使用 Emscripten 配置
emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release

# 构建
cmake --build build

# 复制输出文件
cp build/lamina.wasm dist/
cp build/lamina.js dist/
cp src/index.js dist/
```

## 故障排除

### 问题：找不到 emcmake

**解决方案**：确保 Emscripten 已正确安装并激活：

```bash
source /path/to/emsdk/emsdk_env.sh
```

将此命令添加到你的 `.bashrc` 或 `.zshrc` 以永久激活。

### 问题：CMake 版本过旧

**解决方案**：将 CMake 更新到 3.16.3 或更高版本：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install cmake

# macOS
brew install cmake

# 或从 https://cmake.org/download/ 下载
```

### 问题：子模块未初始化

**解决方案**：初始化 Lamina 子模块：

```bash
git submodule update --init --recursive
```

### 问题：构建失败并出现内存错误

**解决方案**：尝试使用更多内存进行构建：

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 问题：WASM 文件过大

**解决方案**：确保使用 release 构建：

```bash
npm run build:wasm:release
```

由于优化，release 构建会明显更小。

## 开发工作流

### 修改绑定代码

1. 编辑 `bindings/wasm_bindings.cpp`
2. 重新构建 WASM：`npm run build:wasm:debug`
3. 测试：`npm test`

### 修改 JavaScript 包装器

1. 编辑 `src/index.js`
2. 复制到 dist：`npm run build:js`
3. 测试：`npm test`

### 修改 Lamina 核心

1. 编辑 `Lamina/` 子模块中的文件
2. 重新构建 WASM：`npm run build:wasm:debug`
3. 测试：`npm test`

## 构建优化

### 大小优化

要获得更小的 WASM 文件，可以修改 `CMakeLists.txt`：

```cmake
# 添加这些标志
-s ELIMINATE_DUPLICATE_FUNCTIONS=1
-s AGGRESSIVE_VARIABLE_ELIMINATION=1
```

### 性能优化

要获得更快的执行速度：

```cmake
# 使用
-O3
-s ALLOW_MEMORY_GROWTH=0  # 如果内存需求已知
```

## 跨平台说明

### Windows

- 使用 Git Bash 或 WSL 运行 bash 脚本
- 或使用 CMD/PowerShell 等效命令：
  ```cmd
  npm run build:wasm:release
  npm run build:js
  ```

### Linux/macOS

- Bash 脚本应该可以直接使用
- 确保 `scripts/build.sh` 可执行：
  ```bash
  chmod +x scripts/build.sh
  ```

## CI/CD 集成

GitHub Actions 工作流示例：

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

## 更多资源

- [Emscripten 文档](https://emscripten.org/docs/)
- [CMake 文档](https://cmake.org/documentation/)
- [Lamina 语言文档](https://github.com/Lamina-dev/Lamina/wiki)
