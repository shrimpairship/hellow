# 子Skill 0: 源码深度分析引擎

> **职责**: 读取第1层确定性提取的结果，对全部源码进行深度分析，输出结构化的中间分析文件。
> **本子skill不生成任何最终文档**，只输出 `_analysis/` 目录下的结构化数据。

---

## 前置条件

- `_context/project-context.json` 存在
- `_snapshot/sources/` 目录存在并包含源码
- `_context/route-graph.json` 存在

---

## 必须遵守的共享规则

开始前先读取:
- `shared/iron_rules.md` — 铁律规则（特别注意铁律0"代码即事实"、铁律8"直接读源码"）

---

## 分析步骤

### 步骤 1: 读取项目上下文

读取 `project-context.json`，了解：
- 项目名称、版本、描述
- 技术栈（NestJS 版本、ORM、数据库、认证方式）
- 模块列表、控制器列表、服务列表
- 路由清单

### 步骤 2: 读取源码目录结构

遍历 `_snapshot/sources/`，建立完整的目录树，标注每个文件的职责。

### 步骤 3: 逐个模块深度分析

对每个 `@Module()` 装饰器定义的模块：
1. 读取对应的 Module 文件（如 `app.module.ts`）
2. 解析 imports/exports/controllers/providers
3. 追踪每个 provider 的注入来源
4. 分析模块间的依赖关系

### 步骤 4: 路由与控制器分析

对每个 Controller：
1. 读取完整的 Controller 文件
2. 解析所有路由装饰器（@Get、@Post 等）
3. 记录守卫（@UseGuards）、拦截器（@UseInterceptors）、管道（@UsePipes）
4. 记录 Swagger 装饰器（@ApiTags、@ApiOperation 等）

### 步骤 5: 服务与业务逻辑分析

对每个 Service：
1. 读取完整的 Service 文件
2. 记录构造函数中的依赖注入（@InjectRepository、@Inject 等）
3. 识别公开方法及其职责
4. 记录事务处理（@Transactional）

### 步骤 6: 数据模型分析

搜索所有 Entity/DTO/Interface 定义：
1. 记录 @Entity() 类和字段 @Column() 装饰器
2. 记录关系装饰器（@OneToMany、@ManyToOne、@JoinColumn）
3. 记录 @InputType/@ObjectType（GraphQL）
4. 记录 class-validator 验证装饰器
5. 记录 @ApiProperty Swagger 装饰器

### 步骤 7: 配置与中间件分析

1. 读取 ConfigModule 配置（@nestjs/config）
2. 记录所有环境变量及其默认值
3. 记录全局中间件、守卫、拦截器、管道、过滤器

---

## 输出文件清单

输出到 `_analysis/` 目录下的12个文件：

| 文件 | 内容 |
|------|------|
| `project_overview.md` | 项目名称、技术栈、代码统计、目录结构 |
| `module_analysis.md` | 各 Module 职责、imports/exports 依赖关系 |
| `route_analysis.md` | 所有路由路径、HTTP方法、中间件、守卫 |
| `service_analysis.md` | 各 Service 的依赖关系、核心方法、注入链 |
| `model_analysis.md` | Entity、DTO、Interface 定义与关系 |
| `api_endpoints.md` | API 端点详细清单（路径、方法、参数、响应） |
| `database_schema.md` | 数据库表结构、字段类型、关系、索引 |
| `config_analysis.md` | 配置模块、环境变量、自定义配置 |
| `middleware_analysis.md` | 中间件、守卫、拦截器、管道、过滤器 |
| `data_flow.md` | 请求→控制器→服务→数据库 完整链路 |
| `issues_and_risks.md` | 循环依赖、安全风险、潜在问题 |
| `decorator_analysis.md` | 自定义装饰器、参数装饰器、混合装饰器 |

---

## 覆盖率自检 (分析完成前必须执行)

```
□ 是否所有 Module 都已分析？
□ 是否所有 Controller 都已分析？
□ 是否所有 Service 都已分析？
□ 是否所有 Entity/DTO 都已分析？
□ 是否所有路由都已记录？
□ 是否所有环境变量都已记录？
□ 是否所有 12 个分析文件都已生成？
```
