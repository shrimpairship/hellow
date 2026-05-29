# 子Skill 1: 生成 00_阅读指南.md + 01_项目介绍.md

> **职责**: 读取 `_analysis/` 中的分析结果，生成阅读指南和项目介绍两个文档。
> **输入**: `_analysis/project_overview.md`, `_analysis/module_analysis.md`, `_analysis/issues_and_risks.md`
> **输出**: `00_阅读指南.md`, `01_项目介绍.md`

---

## 必须遵守的共享规则

开始前先读取:
- `shared/iron_rules.md` — 铁律规则
- `shared/format_spec.md` — 排版规范

---

## 执行前：判断运行模式

### 全新模式
- `_snapshot/sources/` 存在
- 输出目录为空

### 补厚模式
- 目标文档已存在（`00_阅读指南.md` 或 `01_项目介绍.md`）
- 读取现有文档，只补缺失内容

---

### 数据读取规则（全新/补厚均适用）
1. 先读 `_analysis/project_overview.md` → 了解项目基本信息和源码目录
2. 直接打开 `_snapshot/sources/` 中的关键文件
3. 从源码提取完整数据
4. `_analysis/` 只作为导航，文档中所有数据来自源码

---

## 文档 1: `00_阅读指南.md`

### 必须包含: 项目速览封面表

```markdown
# NestJS 数字资产档案
## [项目名称] [版本号]

### 项目概况速览
| 指标 | 数据 |
|---|---|
| NestJS 版本 | [精确到 minor] |
| TypeScript 版本 | [精确到 minor] |
| 代码规模 | X个Module, Y个Controller, Z个Service, ~W行代码 |
| 数据库/ORM | [TypeORM/Prisma/Mongoose + 数据库类型] |
| 认证方式 | [JWT/Session/OAuth/Passport] |
| 发现风险 | X个安全风险 + Y个循环依赖 + Z项建议 |
| AI分析覆盖率 | 100%业务源文件 |

> 本档案由AI自动分析生成，所有结论标注源文件和行号，可直接追溯验证。
```

**数据来源**:
- 技术栈 → `_analysis/project_overview.md`
- 代码规模 → `_analysis/project_overview.md`
- 发现风险 → `_analysis/issues_and_risks.md`

### 必须包含: 文档导航

列出12个文档的名称和简要说明。

### 必须包含: "按需求快速导航"表

| 我想了解... | 请看 | 关键内容 |
|---|---|---|
| 项目是做什么的 | 01_项目介绍 | 功能列表、技术选型 |
| 模块如何划分 | 02_模块架构 | 模块依赖图、分层架构 |
| 有哪些 API 接口 | 03_路由与控制器 | 路由表、守卫配置 |
| 业务逻辑在哪里 | 04_服务与业务逻辑 | 核心服务、依赖注入 |
| 数据如何定义 | 05_数据模型与DTO | Entity、DTO、关系 |
| 新人如何上手 | 09_项目结构总览 | 架构图、上手路径 |

---

## 文档 2: `01_项目介绍.md`

### 必须包含的章节

1. **项目名称和用途** — 这是一个什么项目？
2. **功能列表** — 具体提供什么能力？逐条列出
3. **技术栈清单** — NestJS 版本、数据库、ORM、认证、缓存等
4. **代码统计表**

| 指标 | 数据 |
|------|------|
| Module 数 | X |
| Controller 数 | Y |
| Service 数 | Z |
| Entity/DTO 数 | W |
| 路由总数 | V |
| 有效代码行数 | ~U |

5. **源码目录结构树**（带文件大小和职责标注）
6. **核心数据结构定义**（关键 Entity/Interface）

### 必须包含: 核心数据结构定义

列出项目中关键的 Entity/Interface/DTO 定义及其字段含义。

**数据来源**: `_analysis/model_analysis.md`

---

## 输出要求

- 两个文档都必须面向**新手工程师**，不假设读者了解项目背景
- 所有数值必须来自 `_analysis/` 文件，不可自行编造
- 如果 `_analysis/` 中缺少某项数据，回查源码补充（读 `_snapshot/sources/`）
