# 📝 Vue 3 Offline-First Todo PWA

一个现代化的、离线优先的待办事项管理应用。构建于 Vue 3 生态系统之上，专为学习者和生产环境设计。

![Vue.js](https://img.shields.io/badge/vue-%2335495e.svg?style=flat&logo=vuedotjs&logoColor=%234FC08D)
![Pinia](https://img.shields.io/badge/pinia-%23ffe05d.svg?style=flat&logo=pinia&logoColor=black)
![Dexie.js](https://img.shields.io/badge/dexie.js-323330?style=flat&logo=javascript&logoColor=F7DF1E)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)

## ✨ 特性亮点

- **📱 渐进式 Web 应用 (PWA)**: 支持安装到桌面/手机，完全离线可用
- **🗄️ 离线存储**: 使用 IndexedDB (Dexie.js) 本地存储所有数据，保护隐私且速度极快
- **🔄 状态管理**: 使用 Pinia 进行模块化状态管理
- **🎨 现代化 UI**: 响应式设计，支持深色/浅色模式切换
- **✋ 拖拽排序**: 使用 vuedraggable 轻松整理任务
- **🏷️ 分类管理**: 支持自定义分类和标签
- **🎓 教练式代码注释**: 核心代码包含详细的"教练风格"注释，解释设计模式和最佳实践，适合源码学习

## 🛠️ 技术栈

- **框架**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **构建工具**: [Vite](https://vitejs.dev/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **数据库**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **样式**: CSS Variables (原生支持深色模式)
- **工具库**: 
  - `vuedraggable`: 拖拽支持
  - `vite-plugin-pwa`: PWA 生成

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 pnpm

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/todo-app.git
cd todo-app

# 2. 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📂 项目结构

```
src/
├── components/      # UI 组件 (Header, Sidebar, TaskList...)
├── stores/          # Pinia 状态仓库 (app, task, category)
├── db/              # IndexedDB 数据库配置与模型
├── utils/           # 工具函数 (date, validation, logger)
├── types/           # TypeScript 类型定义
├── App.vue          # 根组件 (生命周期管理)
└── main.js          # 入口文件
```

## 📚 学习指南

本项目特别在核心文件中添加了**教练风格注释 (Coach-style Comments)**，用 `🎓` 标记。这些注释不仅解释代码"是什么"，还解释"为什么"以及相关的设计模式。

推荐阅读顺序：
1. `src/stores/task.js` - 学习 Pinia 状态管理模式
2. `src/components/TaskItem.vue` - 学习 Vue 组件设计与 Props
3. `src/db/index.js` - 学习 IndexedDB 数据库设计
4. `src/stores/app.js` - 学习事件监听器清理与防内存泄漏

## ✅ 代码质量

本项目包含严格的 ESLint 配置和 Prettier 格式化，确保代码风格统一。

```bash
# 运行代码检查
npm run lint

# 格式化代码
npm run format
```

## 📄 许可证

MIT License
