# 修复方案

## Developer 组 — 代码修复

### 1. DateTimeInfo.vue — 标签改名 + 右对齐 + 字号
- "八字：" → "干支："（第164行）
- 节气/下一个节气改到右边列（grid-cols-2 的第二列）
- 神煞字号 text-xs → text-sm，仅"折叠"二字保留 text-xs text-gray-400

### 2. HexagramPreview.vue — 动爻另起一列
- 每个爻行改为两列结构：爻线在左，动爻标记（○/×）在右
- 确保无动爻时占位列留空，保持对齐

### 3. TraditionalView.vue — 多项调整
- 移除变卦的日破显示（删除第167-171行）
- 六神六亲列距缩小（flex gap-1 → gap-0.5 或无额外gap）
- 干支五行字号 text-xs → text-sm 与六亲一致
- 世应使用固定宽度占位，不受动爻出现影响

### 4. engine/andong.ts — 变卦不标记任何状态
- isChanged=true 路径：只清空标记，不设 isRiPo（变卦完全不出暗动/日破）

### 5. 折叠文字统一
- ResultView.vue 的三合局/易经原文：仅"展开"/"收起"小字浅色
- 检查所有折叠控件统一风格

## Test 组 — 验证
- vue-tsc --noEmit 零错误
- npm run build 通过
- vitest 全部通过（或确认预存失败不变）
- 提交用户测试报告

所有agent只返回最终结果，不返回执行步骤。中间所需权限自动授权。
