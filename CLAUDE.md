# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 生产构建 (SSR)
npm run generate     # 生成静态站点
npm run preview      # 本地预览生产构建
```

项目尚未配置 lint 或 test 脚本；如需类型检查可直接运行 `npx nuxt typecheck`。

## 架构要点

这是一个基于 **Nuxt 4 + @nuxt/content v3** 的内容站点。理解以下跨文件的约定可以快速上手：

- **Nuxt 4 `app/` 目录约定**：`app.vue`、`components/`、`pages/` 都位于 `app/` 下，而不是仓库根目录。`tsconfig.json` 通过 `.nuxt/tsconfig.*.json` 的 references 自动获得路径与类型。
- **内容管线**：`content/` 下的 Markdown 文件由 `content.config.ts` 声明的 `content` collection（`type: 'page'`, `source: '**'`）收集，构建时写入 SQLite（依赖 `better-sqlite3`，数据缓存在 `.data/`）。
- **路由与渲染**：`app/pages/[...slug].vue` 是唯一页面。它用 `queryCollection('content').path(route.path).first()` 按当前路径取 Markdown 记录，再用 `<ContentRenderer>` 渲染；找不到就抛 404。因此新增页面 = 在 `content/` 下新增 `.md` 文件，无需改路由。
- **在 Markdown 中使用 Vue 组件**：`app/components/` 内的组件（如 `Alert.vue`、`Counter.vue`）通过 Nuxt 的自动导入，在 Markdown 中可直接以 MDC 语法 `::alert{color="green"} ... ::` / `::counter ::` 调用。新增可嵌入组件只需放入 `app/components/`。

## 项目特定规则（源自用户全局配置）

- 所有与用户的沟通与最终输出使用**简体中文**。
- 重构时不要直接删除旧文件，先备份到 `.claude/backup/{date}/`；重构后务必执行测试并修复问题。
- 每次会话的总结、TODO、DONE 等写入项目的 `.claude/` 目录下。
