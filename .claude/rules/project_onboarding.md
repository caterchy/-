# 新项目接入规范

## 接入流程

### 步骤 1：创建项目目录
```
E:\cc_test\<project-name>\
├── src\
├── package.json
├── README.md          # 设计文档（必须）
└── docs\              # 可选补充文档
```

### 步骤 2：初始化设计文档
README.md 必须包含：
- 项目概述和目标
- 技术栈
- 架构设计（核心模块、数据流）
- 使用说明
- 开发命令

### 步骤 3：初始化版本管理
```bash
git init
git add .
git commit -m "Initial commit: <project-description>"
```

### 步骤 4：配置 Claude
在 `.claude/` 中配置：
- `settings.json` — hooks 和 permissions
- 如需自定义 Agent prompt，放入 `agents/`

### 步骤 5：创建任务跟踪目录
```
task-feedback\<project-name>\
├── task-plan.md       # 阶段任务方案
└── checklist.md       # 任务分解清单
```

## 验收标准

新项目满足以下条件视为接入完成：

| 检查项 | 要求 |
|--------|------|
| 目录位置 | 在 `E:\cc_test\` 下独立子目录 |
| 设计文档 | 项目根目录有 README.md |
| 版本管理 | Git 已初始化并提交 |
| 构建通过 | `npm run build` 零错误 |
| 任务跟踪 | task-feedback 目录已创建 |
| 存储合规 | 无项目文件散落在 E:\cc_test\ 外 |

## 注意事项

- 创建目录时检查是否有同名项目冲突
- 设计文档必须由总负责人审批通过
- 项目名使用小写字母 + 连字符（kebab-case）
