# Lamina.js - Complete API Reference

## API Coverage Status

 **完整实现** - Lamina.js完全支持Lamina语言的所有功能！

## 核心API

### 基本操作

| API | 描述 | 状态 |
|-----|------|------|
| `execute(code)` | 执行Lamina代码 |  已实现 |
| `eval(expression)` | 求值表达式 |  已实现 |
| `setVariable(name, value)` | 设置数值变量 |  已实现 |
| `setStringVariable(name, value)` | 设置字符串变量 |  已实现 |
| `getVariable(name)` | 获取变量 |  已实现 |
| `reset()` | 重置解释器 |  已实现 |

## Lamina内建函数

### 数学函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `sqrt(x)` | 平方根（精确无理数） | `math.sqrt(x)` |  可用 |
| `pi()` | 圆周率常数 | `math.pi()` |  可用 |
| `e()` | 自然常数 | `math.e()` |  可用 |
| `abs(x)` | 绝对值 | `math.abs(x)` |  可用 |
| `sin(x)` | 正弦 | `math.sin(x)` |  可用 |
| `cos(x)` | 余弦 | `math.cos(x)` |  可用 |
| `log(x)` | 自然对数 | `math.log(x)` |  可用 |

### 向量/矩阵函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `dot(v1, v2)` | 向量点积 | `math.dot(v1, v2)` |  可用 |
| `cross(v1, v2)` | 三维向量叉积 | `math.cross(v1, v2)` |  可用 |
| `norm(v)` | 向量模长 | `math.norm(v)` |  可用 |
| `det(m)` | 矩阵行列式 | `math.det(m)` |  可用 |

### 工具函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `print(...)` | 打印输出 | `lamina.exec('print(...)')` |  可用 |
| `input(prompt)` | 获取输入 | `lamina.calc('input("prompt")')` |  可用 |
| `size(x)` | 获取大小 | `math.size(x)` |  可用 |
| `fraction(x)` | 小数转分数 | `math.fraction(x)` |  可用 |
| `decimal(x)` | 分数转小数 | `math.decimal(x)` |  可用 |
| `range(start, end, step)` | 生成数组 | `math.range(start, end, step)` |  可用 |
| `assert(cond, msg)` | 断言 | `lamina.exec('assert(...)')` |  可用 |

### 随机函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `rand()` | 随机浮点数(0-1) | `math.rand()` |  可用 |
| `randint(start, end)` | 随机整数 | `math.randint(start, end)` |  可用 |
| `randstr(str)` | 随机字符 | `math.randstr(str)` |  可用 |

### 时间函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `get_time()` | 获取时间 | `lamina.calc('get_time()')` |  可用 |
| `get_date()` | 获取日期 | `lamina.calc('get_date()')` |  可用 |
| `format_date(date)` | 格式化日期 | `lamina.calc('format_date(...)')` |  可用 |

### 字符串函数

| 函数 | 描述 | JavaScript API | 状态 |
|------|------|----------------|------|
| `string_concat(...)` | 拼接字符串 | `math.stringConcat(...)` |  可用 |
| `string_char_at(str, index)` | 获取字符 | `math.stringCharAt(str, index)` |  可用 |
| `string_length(str)` | 字符串长度 | `math.stringLength(str)` |  可用 |
| `string_find(str, start, sub)` | 查找子串 | `math.stringFind(str, start, sub)` |  可用 |
| `string_sub_string(str, start, len)` | 截取子串 | `math.stringSubString(str, start, len)` |  可用 |
| `string_replace_by_index(str, start, sub)` | 替换字符串 | `math.stringReplaceByIndex(str, start, sub)` |  可用 |

## 语言特性

### 数据类型

| 类型 | 描述 | 支持状态 |
|------|------|----------|
| `int` | 整数 |  完全支持 |
| `float` | 浮点数 |  完全支持 |
| `rational` | 有理数（精确分数） |  完全支持 |
| `irrational` | 无理数（精确符号） |  完全支持 |
| `bool` | 布尔值 |  完全支持 |
| `string` | 字符串 |  完全支持 |
| `null` | 空值 |  完全支持 |
| `bigint` | 大整数 |  完全支持 |
| `array` | 数组 |  完全支持 |
| `matrix` | 矩阵 |  完全支持 |
| `struct` | 结构体 |  完全支持 |

### 运算符

| 运算符 | 描述 | 支持状态 |
|--------|------|----------|
| `+` | 加法 |  完全支持 |
| `-` | 减法 |  完全支持 |
| `*` | 乘法 |  完全支持 |
| `/` | 除法（精确分数） |  完全支持 |
| `%` | 取模 |  完全支持 |
| `^` | 幂运算 |  完全支持 |
| `!` | 阶乘 |  完全支持 |
| `==` `!=` `>` `<` `>=` `<=` | 比较运算符 |  完全支持 |

### 控制流

| 语句 | 描述 | 支持状态 |
|------|------|----------|
| `if/else` | 条件分支 |  完全支持 |
| `while` | 循环 |  完全支持 |
| `for` | for循环 |  完全支持 |
| `func` | 函数定义 |  完全支持 |
| `return` | 返回语句 |  完全支持 |
| `break` | 跳出循环 |  完全支持 |
| `continue` | 继续循环 |  完全支持 |

### 高级特性

| 特性 | 描述 | 支持状态 |
|------|------|----------|
| 精确有理数 | 自动分数表示 |  完全支持 |
| 精确无理数 | √2, π, e等符号表示 |  完全支持 |
| 向量运算 | 向量加减、点积、叉积 |  完全支持 |
| 矩阵运算 | 矩阵乘法、行列式 |  完全支持 |
| 递归函数 | 支持递归调用 |  完全支持 |
| 大整数 | 任意精度整数 |  完全支持 |
| 结构体 | 类似字典的数据结构 |  完全支持 |
| 模块系统 | include语句 |  完全支持 |

## 使用方式

### 方式1：直接执行代码

```javascript
const { lamina } = require('lamina.js/api');

await lamina.init();
lamina.exec('var x = sqrt(2);');
console.log(lamina.get('x')); // "√2"
```

### 方式2：表达式求值

```javascript
await lamina.init();
console.log(lamina.calc('2 + 3')); // "5"
console.log(lamina.calc('pi() * 2^2')); // "4π"
```

### 方式3：使用数学包装器

```javascript
const { createMathContext } = require('lamina.js/math');

const math = await createMathContext();
console.log(math.sqrt(2)); // "√2"
console.log(math.pi()); // "π"
console.log(math.dot('[1,2,3]', '[4,5,6]')); // "32"
math.destroy();
```

### 方式4：模板标签

```javascript
await lamina.init();

const x = 5;
const result = lamina.tag`${x} * 2 + 1`;
console.log(result); // "11"
```

## 示例

### 完整示例代码

查看这些文件了解更多：

- `examples/elegant.js` - 优雅API示例
- `examples/builtin.js` - 所有内建函数示例
- `examples/basic.js` - 基础使用示例
- `examples/demo.js` - 快速演示

### 运行示例

```bash
# 快速演示
node examples/demo.js

# 优雅API
node examples/elegant.js

# 内建函数
node examples/builtin.js

# 基础示例
node examples/basic.js
```
