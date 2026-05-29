---
name: nestjs-knowledge-base-builder-v1
description: NestJS 项目知识库构建 Skill V1 — 直接读源码 + 双模式 + 12文档 + SUMMARY
---

# NestJS 项目知识库构建 Skill V1

## 快速调用指南

### 全量生成（第一次整理项目）
说："请读取 SKILL.md，对 [项目路径] 执行完整知识库构建流程，输出到 [知识库路径]"

### 单独补厚某个文档
说："请读取 sub-skills/[子skill文件名]，补厚 [知识库路径] 的 [文档名]"

子skill文件 → 对应的输出文档：
| 子skill 文件 | 输出文档 |
|---|---|
| `01_doc_overview.md` | `00_阅读指南.md` + `01_项目介绍.md` |
| `02_doc_modules.md` | `02_模块架构.md` |
| `03_doc_routes.md` | `03_路由与控制器.md` |
| `04_doc_services.md` | `04_服务与业务逻辑.md` |
| `05_doc_models.md` | `05_数据模型与DTO.md` |
| `06_doc_api.md` | `06_API接口文档.md` |
| `07_doc_database.md` | `07_数据库与数据流.md` |
| `08_doc_config.md` | `08_配置与环境.md` |
| `09_doc_newcomer.md` | `09_项目结构总览.md` |
| `10_doc_semantics.md` | `10_核心函数语义.md` |
| `11_doc_faq.md` | `11_常见问题清单.md` |
| `12_doc_summary.md` | `SUMMARY.md` |
| `13_verification.md` | 验证与修正 |
| `14_verification_package.md` | `验收包.md` |

### 重跑分析引擎（源码有大更新时）
说："请读取 sub-skills/00_analysis_engine.md，对 [项目路径] 重新执行深度分析"

---

## 目标

从任意 NestJS 项目自动提取项目结构，通过 AI 调用链驱动分析，生成**超越开发者认知深度**的项目知识库文档。

### 双重目标
| 读者 | 要求 |
|---|---|
| **人类（企业/工程师）** | 第一眼惊艳，比原开发者更懂项目 |
| **AI（QA Assistant）** | 数值全解析、链路完整、无歧义，可直接引用回答问题 |

---

## 整体架构

```
第 1 层: 确定性提取 (scripts/extract-project-context.js 执行)
  ├─ _context/project-context.json    (Module/Controller/Service/Provider 清单)
  ├─ _snapshot/sources/               (源码快照)
  └─ _context/route-graph.json        (路由关系图)

第 2 层: AI 深度分析 (子skill 0: 分析引擎)
  └─ _analysis/                       (12个结构化中间产物 — 导航索引)

第 3 层: AI 文档生成 (子skill 1-11: 各文档生成器)
  └─ 知识库文档 12+1 个 (00-11 + SUMMARY)

第 4 层: AI 验证修正 (子skill 13: 验证器)
  └─ 验证报告 + 自动修正

第 5 层: QA 问答 (nestjs-qa-assistant)
  └─ 基于知识库 + 源码回查
```

---

## 文件结构

```
nestjs-knowledge-base-builder-v1/
├── SKILL.md                        ← 你正在读的文件 (编排器)
├── scripts/                        ← 提取脚本
│   └── extract-project-context.js  ← 第1层: 确定性提取
│
├── sub-skills/                     ← 子skill集
│   ├── 00_analysis_engine.md       ← 源码深度分析引擎
│   ├── 01_doc_overview.md          ← 00_阅读指南 + 01_项目介绍
│   ├── 02_doc_modules.md           ← 02_模块架构
│   ├── 03_doc_routes.md            ← 03_路由与控制器
│   ├── 04_doc_services.md          ← 04_服务与业务逻辑
│   ├── 05_doc_models.md            ← 05_数据模型与DTO
│   ├── 06_doc_api.md               ← 06_API接口文档
│   ├── 07_doc_database.md          ← 07_数据库与数据流
│   ├── 08_doc_config.md            ← 08_配置与环境
│   ├── 09_doc_newcomer.md          ← 09_项目结构总览
│   ├── 10_doc_semantics.md         ← 10_核心函数语义
│   ├── 11_doc_faq.md               ← 11_常见问题清单
│   ├── 12_doc_summary.md           ← SUMMARY.md
│   ├── 13_verification.md          ← 验证与修正
│   └── 14_verification_package.md  ← 验收包.md
│
└── shared/                         ← 共享规则 (子skill按需引用)
    ├── iron_rules.md               ← 铁律
    ├── format_spec.md              ← 排版规范
    └── quality_checklist.md        ← 质量检查清单
```

---

## 第 1 层: 确定性提取

执行 Node.js 脚本提取项目结构：

```bash
node scripts/extract-project-context.js <项目路径> <输出目录>
```

产物：
| 文件 | 内容 |
|---|---|
| `_context/project-context.json` | Package.json、Modules、Controllers、Services、Providers 清单 |
| `_context/route-graph.json` | 路由路径、HTTP 方法、中间件、守卫等映射 |
| `_snapshot/sources/` | 所有 TypeScript 源码的 UTF-8 副本 |

---

## 第 2-4 层: AI 分析执行指令

### 前置条件
确认第 1 层已执行完成:
- `_context/project-context.json` 存在
- `_snapshot/sources/` 目录存在并包含源码
- `_context/route-graph.json` 存在

### 执行顺序

> ⚠️ **必须按以下顺序执行子skill。每个子skill执行前，先读取对应的子skill文件。**

---

#### 阶段 1: 深度分析

**读取并执行**: `sub-skills/00_analysis_engine.md`

**输入**: 第1层提取结果 (`project-context.json` + `source snapshot/` + `route-graph.json`)

**产出**: `_analysis/` 目录下结构化分析文件:

| 文件 | 内容 |
|------|------|
| `project_overview.md` | 项目名称、技术栈、代码统计 |
| `module_analysis.md` | 各 Module 职责、导入导出关系 |
| `route_analysis.md` | 所有路由路径、HTTP方法、中间件、守卫 |
| `service_analysis.md` | 各 Service 依赖关系、核心方法 |
| `model_analysis.md` | Entity、DTO、Interface 定义 |
| `api_endpoints.md` | API 端点详细清单 |
| `database_schema.md` | 数据库表结构、关系、索引 |
| `config_analysis.md` | 配置模块、环境变量、自定义配置 |
| `middleware_analysis.md` | 中间件、守卫、拦截器、管道、过滤器 |
| `data_flow.md` | 请求→控制器→服务→数据库 完整链路 |
| `issues_and_risks.md` | 潜在问题、循环依赖、安全风险 |
| `decorator_analysis.md` | 自定义装饰器、参数装饰器 |

**检查点**: 确认 `_analysis/` 下所有 12 个文件已创建，再进入下一阶段。

---

#### 阶段 2: 文档生成

按顺序执行以下子skill。每个子skill使用 `_analysis/` 做**导航索引**，然后**直接读源码**提取完整数据。

| 执行顺序 | 子Skill | 读取的文件 | 产出文档 | 模式支持 |
|---------|---------|-----------|---------|---------|
| 2.1 | 概览 | `01_doc_overview.md` | `00_阅读指南.md` + `01_项目介绍.md` | 流水线+单独 |
| 2.2 | 模块 | `02_doc_modules.md` | `02_模块架构.md` | 流水线+单独 |
| 2.3 | 路由 | `03_doc_routes.md` | `03_路由与控制器.md` | 流水线+单独 |
| 2.4 | 服务 | `04_doc_services.md` | `04_服务与业务逻辑.md` | 流水线+单独 |
| 2.5 | 数据模型 | `05_doc_models.md` | `05_数据模型与DTO.md` | 流水线+单独 |
| 2.6 | API | `06_doc_api.md` | `06_API接口文档.md` | 流水线+单独 |
| 2.7 | 数据库 | `07_doc_database.md` | `07_数据库与数据流.md` | 流水线+单独 |
| 2.8 | 配置 | `08_doc_config.md` | `08_配置与环境.md` | 流水线+单独 |
| 2.9 | 新人总览 | `09_doc_newcomer.md` | `09_项目结构总览.md` | 流水线+单独 |
| 2.10 | 代码语义 | `10_doc_semantics.md` | `10_核心函数语义.md` | 流水线+单独 |
| 2.11 | 常见问题 | `11_doc_faq.md` | `11_常见问题清单.md` | 流水线+单独 |

**每个子skill执行时**:
1. 先读取对应的 `sub-skills/XX_xxx.md` 文件
2. 再读取文件中指定的 `shared/` 共享规则（铁律、排版规范）
3. 读取 `_analysis/` 中指定的中间分析文件 **作为导航索引**
4. **直接读 `_snapshot/sources/` 源码提取完整数据**（铁律8）
5. 输出最终文档到知识库目录

**检查点**: 确认 12 个文档全部生成，再进入验证阶段。

---

#### 阶段 3: 验证与修正

**读取并执行**: `sub-skills/13_verification.md`

**操作**:
1. 执行完整性检查（含新增文档）
2. 执行正确性回查验证
3. 修正发现的问题
4. 输出验证报告

**检查点**: 所有失败项已修正。

---

#### 阶段 4: 汇总

**读取并执行**: `sub-skills/12_doc_summary.md`

**操作**:
1. 读取所有已生成的知识库文档
2. 汇总生成 `SUMMARY.md`（一页纸总结）

**检查点**: `SUMMARY.md` 已创建，包含架构图和风险列表。

---

#### 阶段 5: 生成验收包（交付前必做）

**读取并执行**: `sub-skills/14_verification_package.md`

**操作**:
1. 从 `01_项目介绍.md` 提取项目背景
2. 从 `02_模块架构.md` 提取模块依赖图
3. 从 `03_路由与控制器.md` 提取路由概览
4. 从 `05_数据模型与DTO.md` 提取核心数据结构
5. 从 `06_API接口文档.md` 验证 API 完整性
6. 从 `11_常见问题清单.md` 生成盲测题
7. 输出 `验收包.md`

**检查点**:
- `验收包.md` 已创建
- 如果发现问题 → 返回阶段2补厚对应文档，再重新执行阶段3-5

---

## 节点依赖关系图

```
[必须] 阶段0: extract-project-context.js
         ↓ 必须完成，否则后续无法执行
[必须] 阶段1: 00_analysis_engine
         ↓ 必须完成
[必须] 阶段2: 01-11 子skill（顺序固定，不可跳过）
         ↓ 阶段2全部完成后
[必须] 阶段3: 13_verification（验证修正）
         ↓
[必须] 阶段4: 12_doc_summary（SUMMARY.md）
         ↓ 自动提示下一步
[必须] 阶段5: 14_verification_package（验收包，交付前）
         ↓
       交付客户
```

---

## 共享规则说明

| 文件 | 内容 | 被谁引用 |
|------|------|---------|
| `shared/iron_rules.md` | 铁律（代码即事实、直接读源码、补厚不覆盖...） | 所有子skill |
| `shared/format_spec.md` | 表格格式、Mermaid类型、标题层级 | 文档生成子skill |
| `shared/quality_checklist.md` | 质量要求 + 检查项清单 | 验证子skill 13 |

---

## 输出文档清单

| 输出文件 | 用途 |
|---|---|
| `00_阅读指南.md` | 告诉新人如何读这套知识库 |
| `01_项目介绍.md` | 项目目标、技术栈、目录、整体认知 |
| `02_模块架构.md` | Module 依赖关系、NestJS 分层架构 |
| `03_路由与控制器.md` | 路由路径、HTTP 方法、中间件、守卫 |
| `04_服务与业务逻辑.md` | Service 职责、依赖注入、核心逻辑 |
| `05_数据模型与DTO.md` | Entity、DTO、Interface 定义与关系 |
| `06_API接口文档.md` | API 端点、请求/响应格式、状态码 |
| `07_数据库与数据流.md` | 数据库表结构、数据流转链路 |
| `08_配置与环境.md` | 配置模块、环境变量、多环境配置 |
| `09_项目结构总览.md` | 新人接手视角的工程地图 |
| `10_核心函数语义.md` | 关键方法、管道、守卫、拦截器语义 |
| `11_常见问题清单.md` | 可直接用于问答的 FAQ |
| `SUMMARY.md` | 一页纸项目总结 |
| `验收包.md` | 交付前质量验证文档 |

---

## 最佳搭配

这个 Skill 与 `nestjs-qa-assistant-v1` 是天然搭配：

- `nestjs-knowledge-base-builder-v1` 负责"把项目整理透"
- `nestjs-qa-assistant-v1` 负责"把知识用起来"
