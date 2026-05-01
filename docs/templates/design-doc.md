# 设计文档模板

> 每个项目必须在根目录包含 README.md 作为设计文档。
> 此模板供新项目初始化时参考。

---

# {{项目名称}}

{{一句话项目描述}}

## 功能特性

- **特性1**: {{描述}}
- **特性2**: {{描述}}
- **特性3**: {{描述}}

## 技术栈

| 技术 | 用途 |
| --- | --- |
| {{框架}} | {{用途}} |
| {{语言}} | {{用途}} |

## 项目目录结构

```
{{project-name}}/
├── src/
│   ├── main.ts          # 应用入口
│   ├── App.vue          # 根组件
│   ├── types/           # 类型定义
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── engine/          # 核心逻辑
│   ├── components/      # UI 组件
│   └── views/           # 页面视图
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0

### 安装

```bash
cd {{project-name}}
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

## 核心模块说明

### 模块1

{{模块描述}}

### 模块2

{{模块描述}}

## 使用指南

{{使用说明}}

## 开发指南

### 构建验证

```bash
npm run build
```

### 项目规范

{{项目编码规范}}

## 许可证

MIT
