# 存储规定（私人助理令 001号）

## 总则
所有项目数据和配置统一存储在 `E:\cc_test\` 目录树中，不得散落在其他位置。

## 目录结构规范

```
E:\cc_test\
├── CLAUDE.md                    # 主 CLAUDE 配置（角色定义 + 协作流程）
├── .claude\                     # Claude Code 系统配置
│   ├── settings.json            # 项目级设置（hooks + permissions）
│   ├── settings.local.json      # 本地覆盖（不纳入版本管理）
│   ├── agents\                  # Agent 提示词模板
│   │   ├── personal_assistant.md
│   │   ├── project_manager.md
│   │   ├── developer.md
│   │   └── debug.md
│   └── rules\                   # 底层规定文档（由私人助理维护）
│       ├── storage_rules.md     # [本文件] 存储规范
│       ├── agent_hierarchy.md   # Agent 层级和协作规则
│       ├── feedback_mechanism.md# 反馈机制设计
│       └── project_onboarding.md# 新项目接入规范
│
├── <project-name>\              # 每个项目独立子目录
│   ├── src\
│   ├── package.json
│   ├── README.md                # 设计文档（项目初始化时编写）
│   └── docs\                    # 可选：补充设计文档
│
├── task-feedback\               # 集中式任务跟踪（跨项目）
│   ├── <project-name>\          # 按项目分夹
│   │   ├── task-plan.md         # 当前阶段任务方案
│   │   └── checklist.md         # 任务分解清单
│   └── decision-log.md          # 重要的架构/设计决策记录
│
└── docs\                        # 跨项目的共享文档
    └── templates\               # 文档模板
```

## 关键规则
1. **新项目必须在 `E:\cc_test\` 下创建独立子目录**
2. **每个项目必须有一份设计文档**（项目根目录下的 `README.md` 或 `docs/` 中）
3. **不允许在项目外的目录写文件**（如桌面、文档文件夹等）
4. **反馈文件统一放在 `task-feedback/<project-name>/` 下**
5. **底层规定文档由私人助理维护，其他 Agent 只读引用**
