# 子Skill 6: 生成 06_API接口文档.md

> **职责**: 读取分析结果，生成完整的 API 接口文档。
> **输入**: `_analysis/api_endpoints.md`, `_analysis/route_analysis.md`, `_analysis/model_analysis.md`
> **输出**: `06_API接口文档.md`

---

## 必须遵守的共享规则

开始前先读取:
- `shared/iron_rules.md` — 铁律规则
- `shared/format_spec.md` — 排版规范

---

## 执行前：判断运行模式

### 数据读取规则（全新/补厚均适用）
1. 先读 `_analysis/api_endpoints.md` → 了解所有 API 端点
2. 直接打开 `_snapshot/sources/` 中的 Controller 和 DTO 文件
3. 从源码提取请求/响应格式、状态码、错误响应
4. `_analysis/` 只作为导航，文档中所有数据来自源码

---

## 文档结构

### 1. API 总览

| 分组 | 基础路径 | 接口数 | 认证要求 |
|------|---------|--------|---------|
| Auth | `/api/auth` | 3 | 部分公开 |
| Users | `/api/users` | 5 | 全部需认证 |
| Posts | `/api/posts` | 6 | 部分需认证 |

### 2. API 端点详细清单（每个分组一个子章节）

#### Auth — 认证管理

**基础路径**: `/api/auth`

**接口清单**：

##### `POST /api/auth/register` — 用户注册

| 属性 | 值 |
|------|------|
| 认证 | ❌ 公开 |
| 限流 | 5次/分钟 |
| 请求体 | `CreateUserDto` |
| 成功响应 | `201` — `AccessTokenDto` |
| 错误响应 | `409` — 邮箱已存在<br>`400` — 参数验证失败 |

**请求示例**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John"
}
```

**响应示例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 3600
}
```

**数据来源**: `src/auth/auth.controller.ts:15-28`, `src/auth/dto/create-user.dto.ts`

##### `POST /api/auth/login` — 用户登录

| 属性 | 值 |
|------|------|
| 认证 | ❌ 公开 |
| 限流 | 10次/分钟 |
| 请求体 | `LoginDto { email: string, password: string }` |
| 成功响应 | `200` — `AccessTokenDto` |
| 错误响应 | `401` — 凭证错误 |

### 3. API 错误码速查表

| HTTP状态码 | 含义 | 常见场景 |
|-----------|------|---------|
| 400 | Bad Request | 参数验证失败 |
| 401 | Unauthorized | Token 过期或无效 |
| 403 | Forbidden | 角色权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 唯一约束冲突 |
| 429 | Too Many Requests | 超过速率限制 |
| 500 | Internal Server Error | 服务器异常 |

---

## 输出要求

- 每个 API 端点必须包含：路径、HTTP方法、认证要求、请求/响应格式
- 请求体和响应体必须给出 JSON 示例
- 所有状态码必须有说明（正常和异常）
- 错误响应必须列出对应的 HTTP 状态码和原因
- 如果使用了 Swagger，提取 @ApiOperation 的 summary 作为接口描述
