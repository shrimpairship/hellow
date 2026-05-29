# 子Skill 8: 生成 08_配置与环境.md

> **职责**: 读取分析结果，生成配置与环境文档。
> **输入**: `_analysis/config_analysis.md`
> **输出**: `08_配置与环境.md`

---

## 必须遵守的共享规则

开始前先读取:
- `shared/iron_rules.md` — 铁律规则
- `shared/format_spec.md` — 排版规范

---

## 执行前：判断运行模式

### 数据读取规则（全新/补厚均适用）
1. 先读 `_analysis/config_analysis.md` → 了解配置项列表
2. 直接打开 `_snapshot/sources/` 中的 ConfigModule 相关文件、`.env` 文件
3. 从源码提取所有配置定义、环境变量、默认值
4. `_analysis/` 只作为导航，文档中所有数据来自源码

---

## 文档结构

### 1. 配置架构总览

| 配置方式 | 使用的库 | 配置文件 | 环境变量前缀 |
|---------|---------|---------|-------------|
| @nestjs/config | dotenv | .env, .env.development | APP_ |
| 自定义 ConfigService | - | config.yaml | DB_ |
| Joi 验证 | joi | - | - |

### 2. 环境变量清单

| 变量名 | 默认值 | 必填 | 说明 | 来源文件 |
|--------|--------|------|------|---------|
| NODE_ENV | development | ❌ | 运行环境 | .env |
| PORT | 3000 | ❌ | 服务端口 | .env |
| DB_HOST | localhost | ❌ | 数据库地址 | .env |
| DB_PORT | 5432 | ❌ | 数据库端口 | .env |
| DB_USERNAME | postgres | ❌ | 数据库用户名 | .env |
| DB_PASSWORD | - | ✅ | 数据库密码 | .env |
| JWT_SECRET | - | ✅ | JWT 签名密钥 | .env |
| JWT_EXPIRES_IN | 3600 | ❌ | JWT 过期时间(秒) | .env |
| REDIS_HOST | localhost | ❌ | Redis 地址 | .env |
| REDIS_PORT | 6379 | ❌ | Redis 端口 | .env |

### 3. 配置模块结构

#### ConfigModule 注册方式

```typescript
// src/app.module.ts:5-12
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().default('localhost'),
    // ...
  }),
})
```

#### 自定义配置（ConfigService）

| 配置键 | 类型 | 值的来源 | 使用场景 |
|--------|------|---------|---------|
| app.port | number | env PORT | 服务监听端口 |
| database.url | string | 拼接 DB_* 变量 | TypeORM 连接 |
| jwt.secret | string | env JWT_SECRET | Token 签名 |
| jwt.expiresIn | number | env JWT_EXPIRES_IN | Token 过期时间 |

**数据来源**: `_snapshot/sources/config/app.config.ts`

### 4. 多环境配置

| 环境 | .env 文件 | 主要差异 |
|------|----------|---------|
| development | .env.development | 本地数据库、调试日志 |
| staging | .env.staging | 预发布数据库、模拟外部服务 |
| production | .env.production | 生产数据库、错误日志、性能配置 |

### 5. 敏感配置说明

> ⚠️ 以下配置项涉及安全，勿提交到版本控制：
> - `DB_PASSWORD` — 数据库密码
> - `JWT_SECRET` — JWT 签名密钥
> - `REDIS_PASSWORD` — Redis 密码
> - `AWS_SECRET_KEY` — AWS 密钥
> - `SENDGRID_API_KEY` — 邮件服务 API Key

---

## 输出要求

- 所有环境变量必须列出，包括可选变量的默认值
- 配置验证规则（Joi 或 class-validator）必须提取具体参数
- 多环境配置差异必须清晰对比
- 敏感配置项必须标注 ⚠️ 安全警告
