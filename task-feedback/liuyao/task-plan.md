# DateTimeInfo 时间板块 UI 修复方案

## 概述

根据用户反馈，DateTimeInfo 时间板块存在 4 个 UI 问题，涉及时间格式、布局结构、颜色一致性等方面。以下逐一分析并给出修复方案。

---

## 问题 1：时间格式统一

### 现状分析

- `formatTermDate()` 返回格式为 `2026年4月20日`（含年份），但节气日期在上下文中年份信息冗余，因起卦时间已显示具体日期
- 干支（`甲辰年 戊辰月 癸亥日 壬子时`）位于右列最下方，有独立的 `mt-1` div，与"下一个节气"行存在垂直错位
- 当前布局结构（右列从上到下）：节气 → 下一个节气（mt-1）→ 干支（mt-1）

### 修复方案

1. **节气日期去掉年份**：修改 `formatTermDate()`，返回值从 `2026年4月20日` 改为 `4月20日`（`${date.getMonth() + 1}月${date.getDate()}日`）
2. **干支移到左列**：将干支从右列移至左列，与右列的"下一个节气"行对齐
   - 左列从上到下：起卦时间 → 干支（与下一个节气同行高）
   - 右列从上到下：节气 → 下一个节气

### 涉及文件

- `e:\cc_test\liuyao\src\components\DateTimeInfo.vue`
  - 修改 `formatTermDate()` 函数（第 78-80 行）
  - 调整模板布局，将干支移至左列（第 132-174 行 grid-cols-2 区域）

---

## 问题 2：干支五行颜色一致

### 现状分析

- TraditionalView.vue 第 108 行：`{{ row.orig.najia.gan }}{{ row.orig.najia.zhi }}<span class="text-gray-400 text-sm">{{ row.orig.wuxing }}</span>`
- 第 155 行（变卦侧）：同样结构
- 五行 span 使用了 `text-gray-400`，而干支文本使用内联 `color: #333;`
- 干支与五行颜色不一致，视觉上割裂

### 修复方案

- 去掉五行的 `text-gray-400` 类，使其继承父元素的颜色（`#333`），与干支颜色一致
- 干支和五行保留同样的字号 `text-sm`

### 涉及文件

- `e:\cc_test\liuyao\src\components\TraditionalView.vue`
  - 第 108 行：去掉 `<span class="text-gray-400 text-sm">` 中的 `text-gray-400`
  - 第 155 行：同样去掉 `text-gray-400`

---

## 问题 3：神煞另起一行

### 现状分析

- 当前第二行（`border-t` 区域内）使用 `flex items-start justify-between` 布局
- 左侧：旬空/卦身/世身（flex-wrap）
- 右侧：神煞（折叠按钮 + 列表）
- 神煞与旬空/卦身/世身挤在同一行，空间紧张，视觉拥挤

### 修复方案

- 将神煞从第二行的右侧独立出来，成为第三行
- 布局结构变为：
  - 第一行：起卦时间 + 节气（grid-cols-2）
  - 第二行（border-t）：旬空 / 卦身 / 世身
  - 第三行：神煞（折叠按钮 + 列表）
- 第三行可以使用 `border-t` 或 `mt-2` 与第二行分隔

### 涉及文件

- `e:\cc_test\liuyao\src\components\DateTimeInfo.vue`
  - 重构第 176-205 行的第二行区域，将神煞拆分为独立的第三行

---

## 问题 4：颜色统一

### 现状分析

DateTimeInfo.vue 中存在多处特殊颜色：

| 位置 | 颜色类 | 对应元素 | 行号 |
|------|--------|---------|------|
| 节气值 | `text-green-700` | 当前节气名称+日期 | 156 |
| 下一个节气值 | `text-green-700` | 下一个节气名称+日期 | 163 |
| 旬空值 | `text-red-600` | 旬空干支 | 180 |
| 卦身值 | `text-blue-600` | 卦身 | 181 |
| 世身值 | `text-purple-600` | 世身 | 182 |

多种颜色导致界面杂乱，缺乏统一的视觉层次。

### 修复方案

- 去掉上述所有特殊颜色类（`text-green-700`、`text-red-600`、`text-blue-600`、`text-purple-600`）
- 统一替换为中性颜色，建议使用 `text-gray-800` 或保留 `font-medium`/`font-bold` 但不设彩色
- 保持字号和字重不变（区分 label 与 value 的视觉层次）

### 涉及文件

- `e:\cc_test\liuyao\src\components\DateTimeInfo.vue`
  - 第 156 行：`text-green-700` → 移除
  - 第 163 行：`text-green-700` → 移除
  - 第 180 行：`text-red-600` → 移除
  - 第 181 行：`text-blue-600` → 移除
  - 第 182 行：`text-purple-600` → 移除

---

## 执行顺序

1. 先改 DateTimeInfo.vue 布局（问题 1 + 问题 3 + 问题 4 — 涉及同一文件可一次性修改）
2. 再改 TraditionalView.vue 颜色（问题 2 — 独立文件，一次修改）

## 验证标准

- `vue-tsc --noEmit` 零错误
- `npm run build` 通过
- `vitest` 全部通过
- 视觉检查：节气日期无年份、干支在左列对齐、神煞独立一行、无彩色字体
