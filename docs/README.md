# Lamina.js 文档

Lamina.js 的完整文档 - Lamina 编程语言的 WebAssembly 绑定。

## 文档索引

### 入门指南

- **[主 README](../README.md)** - 项目概述和快速开始
- **[使用指南](./USAGE.md)** - 包含示例的完整使用指南
- **[构建指南](./BUILD.md)** - 从源代码构建

### API 文档

- **[API 参考](./API_REFERENCE.md)** - 所有函数的完整 API 参考

### 示例

查看 [`examples/`](../examples/) 目录中的可运行代码示例：

- `demo.js` - 优雅 API 的快速演示
- `elegant.js` - 完整的优雅 API 示例
- `builtin.js` - 所有内置函数演示
- `test.js` - 测试套件
- `basic.js` - 基础使用示例

## 快速链接

### 用户指南

1. 从[主 README](../README.md) 开始了解安装和快速开始
2. 阅读[使用指南](./USAGE.md)获取详细示例
3. 查看 [API 参考](./API_REFERENCE.md)了解完整的 API 文档
4. 运行 [`examples/`](../examples/) 目录中的示例

### 开发者指南

1. 阅读[构建指南](./BUILD.md)了解构建说明
2. 查看 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解贡献指南
3. 查看 [`src/`](../src/) 目录中的源代码

## API 概览

### 使用 Lamina.js 的两种方式

#### 1. **全局 `lamina` 对象**（最简单）

```javascript
import { lamina } from 'lamina.js';
await lamina.init();
lamina.calc('2 + 3');
```

#### 2. **`LaminaContext` 类**（隔离）

```javascript
import { LaminaContext } from 'lamina.js';
const ctx = await LaminaContext.create();
ctx.calc('2 + 3');
```

## 特性

- 精确有理数运算
- 符号数学
- BigInt 支持
- 向量/矩阵运算
- 模板标签语法
- TypeScript 支持
- 多个隔离上下文

## 支持

- **问题反馈**：[GitHub Issues](https://github.com/Hoshino-Yumetsuki/lamina.js/issues)
- **许可证**：LGPL-2.1

---

更多信息请访问[主 README](../README.md)。
