# 子Skill 10: 生成 10_核心函数语义.md

> **职责**: 项目代码的"人类可读版本"，让工程师不看源码也能知道每个方法干什么。
> **输入**: `_snapshot/sources/`, `_analysis/service_analysis.md`
> **输出**: `10_核心函数语义.md`

---

## 必须遵守的共享规则

开始前先读取:
- `shared/iron_rules.md` — 铁律规则（特别注意铁律8"直接读源码"和铁律9"补厚不覆盖"）
- `shared/format_spec.md` — 排版规范

---

## 执行前：判断运行模式

### 数据读取规则（全新/补厚均适用）
1. 先读 `_analysis/service_analysis.md` → 了解核心 Service 和方法列表
2. 直接打开 `_snapshot/sources/` 中的源文件，**每个核心文件必须全文通读**
3. 提取每个公开方法的完整签名、参数、返回值、逻辑
4. `_analysis/` 只作为导航，文档中所有数据来自源码

---

## 处理优先级

按以下文件优先级处理（从高到低）：
1. **Service 文件**（含核心业务逻辑）
2. **Guard 文件**（自定义守卫逻辑）
3. **Interceptor 文件**（自定义拦截器逻辑）
4. **Pipe 文件**（自定义管道逻辑）
5. **Filter 文件**（异常过滤器）

---

## 文件头格式（每个文件开头）

```markdown
## `src/xxx/xxx.service.ts`

**文件职责**: 用户管理的核心业务逻辑，包含CRUD操作和权限验证

**公开方法数**: 5

**依赖注入**:
- `Repository<User>` — 用户数据访问

---
```

---

## 方法说明卡片格式（必须严格遵守）

### `methodName(params): ReturnType`

**方法签名**:
```typescript
async methodName(param1: Type1, param2: Type2): Promise<ReturnType>
```

**职责**: [一句话说明这个方法是做什么的]

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| param1 | Type1 | ✅ | [说明] |
| param2 | Type2 | ❌ | [说明，含默认值] |

**返回值说明**:

| 条件 | 返回值 |
|------|--------|
| 成功 | `{ ... }` — [结构说明] |
| 异常 | `NotFoundException` — 资源不存在 |

**核心逻辑**:
1. [第一步描述]
2. [第二步描述]
3. [第三步描述]

**关键代码**:
```typescript
// 核心逻辑片段
const result = await this.repository.find({ ... });
```

**调用链路**: `XxxController.methodName()` → `XxxService.methodName()` → `Repository`

**数据来源**: `src/xxx/xxx.service.ts:行号`

---

## 输出要求

- 只覆盖公开方法（public methods），private 方法选录
- 每个方法卡片必须有完整的参数和返回值类型
- 核心逻辑必须用步骤列出，不能只写"实现业务逻辑"
- 调用链路必须完整，从 Controller 到 Repository
- 所有类型必须精确到 TypeScript 定义
