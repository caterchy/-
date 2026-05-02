# 六爻排盘 — 验证报告 v3

**测试日期**: 2026-05-02
**测试身份**: 测试 Agent
**测试范围**: 类型检查 + 构建 + 单元测试回归验证

---

## 1. 类型检查 — `vue-tsc --noEmit`

| 检查项 | 结果 |
|--------|------|
| `vue-tsc -b` (作为 build 前置步骤) | 零错误 |

**结论**: 通过。`npm run build` 包含 `vue-tsc -b && vite build`，构建全程无类型错误。

---

## 2. 构建 — `npm run build`

| 检查项 | 结果 |
|--------|------|
| `npm run build` | 成功 (343ms, 96 modules) |

无构建警告或错误。

---

## 3. 单元测试 — `npx vitest run`

| 统计项 | 数值 |
|--------|------|
| 测试文件总数 | 17 |
| 通过文件数 | 15 |
| 失败文件数 | 2 |
| 测试用例总数 | 292 |
| 通过用例数 | 284 |
| 失败用例数 | 8 |

### 已知预存失败（与 v2 报告一致，无新增）

**src/data/bazi.test.ts — 2 个失败** (getXun)

| 测试 | 预期 | 实际 |
|------|------|------|
| 乙丑日 is in 甲子旬 | '甲子' | null |
| 癸亥日 is in 甲寅旬 | '甲寅' | null |

**src/engine/shensha.test.ts — 6 个失败** (getShenShaForYao / calcShenSha)

| 测试 | 说明 |
|------|------|
| returns 禄神 for 甲日 | 实际返回 [ '驿马' ]，预期包含 '禄神' |
| returns 羊刃 for 甲日 | 实际返回 []，预期包含 '羊刃' |
| returns 文昌 for 甲日 | 实际返回 [ '劫煞' ]，预期包含 '文昌' |
| returns multiple matching shensha | 实际返回 [ '驿马' ]，预期同时包含 '禄神' |
| returns empty array when no shensha match | 实际返回 [ '天乙贵人' ]，预期 [] |
| returns shensha marks for all positions | 位置 0 缺少 '禄神' |

### 回归验证

- v2 已知预存失败：bazi.test.ts 2 个 + shensha.test.ts 6 个 = **8 个**
- v3 实际失败：**8 个**（完全一致）
- **新增失败：0 个**

---

## 总体结论

**PASS**

| 检查项 | 结果 |
|--------|------|
| 类型检查 | 通过 |
| 构建 | 通过 |
| 测试回归 | 无新增失败 |
| 已知失败 | 8 个（与 v2 完全一致） |

预存的 8 个测试失败均属于 `getXun`（旬首计算）和 `getShenShaForYao`（神煞计算）逻辑，已在 v2 报告中记录，本轮无新增回归问题。构建和类型检查均零错误。
