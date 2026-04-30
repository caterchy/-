# 六爻排盘项目 — 开发任务方案

## 项目概述

Vue 3 + TypeScript + Vite 构建的六爻纳甲筮法排盘工具，支持手动起卦（掷硬币）和自动起卦，展示本卦/变卦、六亲、六神、世应、纳甲、空亡、神煞、三合局、反吟伏吟等完整信息。

## 当前状态（2026-04-30）

| 模块 | 状态 | 备注 |
|------|------|------|
| 核心引擎（起卦、八字、排盘、六亲、六神、世应、空亡、神煞、三合、反吟伏吟） | ✅ 完成 | |
| 数据层（六十四卦、八字五行、纳甲、神煞） | ✅ 完成 | |
| 组件层（7 个组件） | ✅ 完成 | |
| 视图层 | ✅ 完成 | |
| TypeScript 类型检查 (`vue-tsc --noEmit`) | ✅ 通过 | 零错误 |
| 生产构建 (`npm run build`) | ✅ 通过 | |
| 备注功能（UI） | ⬜ 待实现 | 数据层 `note` 字段已存在 |
| Git 版本管理 | ⬜ 待初始化 | |
| 设计文档（README） | ⬜ 待编写 | 仍为默认 Vite 模板 |

## 已完成工作

### Bug 修复
- `paipan.ts` 类型错误：`y.najia.zhi` → `changedAllZhis[i]`
- `transformedZhi` 函数移除未使用参数 `yao`

### 代码清理
- 逐文件移除所有未使用的 import 和变量
- `HexagramView.vue`、`bazi.ts`、`engine/bazi.ts`、`fanyin.ts`、`paipan.ts`、`sanhe.ts`、`HomeView.vue`、`HistoryView.vue` 均已完成清理

## 剩余任务

### 高优先级
1. **Git 初始化** — 建立版本管理
2. **设计文档** — 重写 `README.md`，包含项目说明、架构、使用方式

### 功能改进
3. **备注 UI** — `PaipanResult.note` 字段已存在，需补充：
   - `HomeView.vue`：起卦后弹出备注输入框
   - `ResultView.vue`：显示和编辑备注

### 部署（可选）
4. **静态部署** — 构建产物可直接部署至任意静态服务器
