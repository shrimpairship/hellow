# 知识包布局识别指南

> 本文件帮助 QA Assistant 快速识别 NestJS 项目知识包的形态，选择正确的检索策略。

---

## Layout C：NestJS V1 平铺 MD 知识包

由 `nestjs-knowledge-base-builder-v1` 生成。

### 识别特征
- 目录包含 `00_阅读指南.md`
- 至少有 5 个匹配 `XX_*.md` 的知识库文档
- **不包含** `_context/` 目录
- **不包含** `_snapshot/sources/` 目录

### 典型目录结构
```
<knowledge_base_root>/
├── 00_阅读指南.md
├── 01_项目介绍.md
├── 02_模块架构.md
├── 03_路由与控制器.md
├── 04_服务与业务逻辑.md
├── 05_数据模型与DTO.md
├── 06_API接口文档.md
├── 07_数据库与数据流.md
├── 08_配置与环境.md
├── 09_项目结构总览.md
├── 10_核心函数语义.md
├── 11_常见问题清单.md
└── SUMMARY.md
```

### 检索限制
- 没有源码快照，不能进行源码回退
- 所有证据只能从 MD 文档中提取
- 如果 MD 文档不够，只能回退到通用 NestJS 知识

---

## Layout B：带源码快照的完整知识包

由 `nestjs-knowledge-base-builder-v1` 生成（带源码快照模式）。

### 识别特征
- 目录包含 `00_阅读指南.md`
- 包含 `_snapshot/sources/` 目录
- 可选包含 `_context/` 目录

### 典型目录结构
```
<knowledge_base_root>/
├── 00_阅读指南.md  ～  11_常见问题清单.md  # 同 Layout C
├── SUMMARY.md
├── _context/
│   ├── project-context.json
│   └── route-graph.json
└── _snapshot/
    └── sources/
        ├── src/
        │   ├── app.module.ts
        │   ├── main.ts
        │   ├── auth/
        │   ├── users/
        │   └── ...
```

### 检索能力
- 有源码快照，可以进行受治理的源码回退
- 先用知识库文档，不够时读 `_snapshot/sources/`
- 可以验证知识库文档中的证据

---

## Layout A：纯源码项目

用户直接给了 NestJS 项目源码，没有任何知识库文档。

### 识别特征
- 目录包含 `src/` 目录
- 目录包含 `package.json`
- **不包含** `00_阅读指南.md` 等知识库文档

### 检索策略
- 先读 `package.json` 了解技术栈
- 从 `src/main.ts` 开始理解入口
- 从 `src/app.module.ts` 了解模块结构
- 根据问题类型读取对应文件
- 所有回答都必须标注源码位置
