# Lamina.js

<div align="center">

**Lamina 的 WebAssembly 绑定 - 一个面向数学的精确计算编程语言**

</div>

## 概述

Lamina.js 通过 WebAssembly 将 [Lamina](https://github.com/Lamina-dev/Lamina)（一个精确的数学编程语言）的强大功能带到 JavaScript 和 Node.js。

### 主要特性

- **精确有理数** - 无浮点精度损失（`16/9` 保持为 `16/9`）
- **符号数学** - √2、π、e 和其他无理数的精确表示
- **BigInt 支持** - 任意精度整数运算
- **向量和矩阵** - 内置线性代数支持
- **快速执行** - 编译为 WebAssembly 以获得接近原生的性能
- **优雅的 API** - 简单的计算器式语法
- **同步 API** - 初始化后无需 async/await

## 安装

```bash
npm install lamina.js
# 或
yarn add lamina.js
```

## 快速开始

### 优雅 API（推荐）

使用 Lamina.js 最简单的方式 - 就像计算器一样！

```javascript
import { lamina } from 'lamina.js';

// 直接使用！
console.log(lamina.calc('2 + 3'));           // 5
console.log(lamina.calc('16 / 9'));          // 16/9 (精确！)
console.log(lamina.calc('sqrt(16)'));        // 4

// 设置变量
lamina.set('radius', 5);
console.log(lamina.calc('pi() * radius^2')); // 25π

// 模板标签语法
const x = 10;
const result = lamina.tag`${x} * 2 + 1`;
console.log(result); // 21

// 链式操作
lamina.set('a', 10).set('b', 20).exec('var sum = a + b;');
```

### 隔离上下文

创建独立的计算环境：

```javascript
import { lamina } from 'lamina.js';

// 创建隔离上下文
const ctx = await lamina.Context.create();
ctx.set('radius', 5).exec('var area = pi() * radius^2;');
console.log(ctx.get('area')); // 25π
ctx.destroy();
```

### 从 Buffer 执行

直接从文件缓冲区执行 Lamina 代码：

```javascript
import { lamina } from 'lamina.js';
import fs from 'fs';

// 读取 .lm 文件为 buffer
const buffer = fs.readFileSync('script.lm');

// 从 buffer 执行
await lamina.init();
lamina.execBuffer(buffer);

// 或使用上下文
const ctx = await lamina.createContext();
ctx.execBuffer(buffer, 'utf-8');
ctx.destroy();
```

## 文档

- [完整使用指南](./docs/USAGE.md)
- [API 参考](./docs/API_REFERENCE.md)
- [示例](./examples/)
- [构建指南](./docs/BUILD.md)

## 示例

运行包含的示例：

```bash
node examples/demo.js        # 快速演示
node examples/elegant.js     # 完整优雅 API 示例
node examples/builtin.js     # 所有内置函数
node examples/test.js        # 测试套件
node examples/test-buffer.js # Buffer 执行测试
```

## TypeScript 支持

Lamina.js 使用 TypeScript 编写，包含完整的类型定义：

```typescript
import { lamina } from 'lamina.js';

const result: string = lamina.calc('2 + 3');

// 创建隔离上下文
const ctx = await lamina.Context.create();
```

## 从源代码构建

**你需要 cmake 和 emsdk 来完成此操作。**

```bash
# 安装依赖
yarn install

# 构建
yarn build

# 运行测试
yarn test
```

详细构建说明请参阅 [BUILD.md](./docs/BUILD.md)。

## 相关项目

- [Lamina](https://github.com/Lamina-dev/Lamina) - Lamina 核心编程语言
