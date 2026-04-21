# DONE · 日历格内三行 title（2026-04-20）

## 变更摘要

用户最终需求：`/daily` 日历的**每个单元格内**分三行展示：
- `.day-title` — 来自 PastorLu-today.json 的经句（如 "林前1:18"），链接到 `/daily/{YYMMDD}`
- `.nt-title` — 卢牧师读新约（格式 "卢牧师读新约{MMDD}"），链接到 `/nt/{MMDD}`
- `.ot-title` — 占位，待用户后续补数据源

## 新增/修改

- `server/api/nt.get.ts` — 新增：拉取 `lu-nt-2025.json`，按 MMDD 解析
- `app/composables/useNTReadings.ts` — 新增：封装 `useFetch`、`findNTByDate`、`neighborsOfNT`、`isValidMMDD`、`getTodayMMDDInUtc8`
- `app/pages/nt/[date].vue` — 新增：NT 详情页（MP4 走 simai.life 代理 + 二维码 + YouTube，仿 DailyVerseDetail 顺序）
- `app/components/DailyCalendar.vue` — 修改：接收可选 `ntItems` prop；每格渲染 day-num + 三行 title；单元格去掉 aspect-ratio，改用 `min-height`（移动 92px / 桌面 112px / 超窄 80px）
- `app/pages/daily/index.vue` — 修改：同时 `useDailyVerses` 与 `useNTReadings`，两份数据传给 `DailyCalendar`

## 备份（.claude/backup/2026-04-20/）

- `DailyCalendar.vue`（旧版单行 title）
- `daily_index.vue`（曾经尝试的"三个页面区块"布局）
- `NTCalendar.vue`（独立 NT 日历，被合并回 DailyCalendar 后弃用）

## 验证

- `GET /daily` → 200，HTML 同时包含：
  - `class="day-title" ... >林前1:18`
  - `class="nt-title" ... >卢牧师读新约0401`
  - `class="ot-title empty-line" ... >—`
- `/nt/0101` 详情页保留，MP4 走 `go2024.simai.life` 代理
- 移动端（<640px）cell min-height 92px，桌面端 112px，三行不再需要裁剪

## 关键样式（DailyCalendar.vue）

- `.day-title` 绿色（#2e7d32）+ 浅绿底
- `.nt-title` 蓝色（#1565c0）+ 浅蓝底
- `.ot-title` 棕色（#8a6d3b）+ 浅棕底
- 缺数据时渲染 `.empty-line`（灰色 "—"）保持三行高度稳定
- 每个 title 都是 `white-space: nowrap; text-overflow: ellipsis`，超长自动截断

## 后续

- 第 3 行 `.ot-title` 数据源与 JSON 结构由用户后续提供
- 如需第 3 行也可点击，追加 `/ot/[date].vue` 并给 span 换成 NuxtLink
