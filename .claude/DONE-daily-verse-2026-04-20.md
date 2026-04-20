# DONE · 每日圣经经句功能（2026-04-20）

## 变更摘要

为 lu-verse 新增 "每日圣经经句" 功能：日历浏览 + 每日详情 + 今日跳转页。

数据源：`https://r2.savefamily.net/PastorLu-today.json`（数组 131 条，`{date: YYMMDD, vid, title}`）。

## 新增文件

- `server/api/daily.get.ts` — Nitro 缓存端点 `/api/daily`，`maxAge=3600`、`swr=true`，远程 JSON 拉取失败时返回空数组并附 `error`
- `app/utils/daily-date.ts` — `parseYYMMDD` / `formatYYMMDD` / `getTodayYYMMDDInUtc8` / `isValidYYMMDD` / `humanizeYYMMDD`（UTC+8 基准）
- `app/composables/useDailyVerses.ts` — `useDailyVerses()` + `findByDate` / `findLatestOnOrBefore` / `neighborsOf`
- `app/components/DailyVerseDetail.vue` — 标题 + YouTube iframe + MP4 `<video>`
- `app/components/DailyCalendar.vue` — 按月网格，今日高亮，未来/无内容日期置灰
- `app/pages/today.vue` — 计算今日 YYMMDD (UTC+8)，302 跳到 `/daily/[date]`
- `app/pages/daily/index.vue` — 日历首页
- `app/pages/daily/[date].vue` — 详情页，前后导航 + 校验非法日期 → 404

## 修改/删除

无。既不修改 `content.config.ts`、`nuxt.config.ts`，也不触及现有 `content/*.md` 与 `[...slug].vue`。无旧文件删除，故无需 `.claude/backup/`。

## 验证结果（`npm run dev` on :3001）

| 请求 | 结果 |
| --- | --- |
| `GET /api/daily` | 200，返回 131 条按日期降序；响应头 `cache-control: s-maxage=3600, stale-while-revalidate` |
| `GET /today` | 302 → `/daily/260421`（机器 UTC+8 当日） |
| `GET /daily` | 200，渲染日历 |
| `GET /daily/260420` | 200，HTML 含 `youtube.com/embed/jNVvMoFE6fg` 与 `r2.savefamily.net/@pastorpaulqiankunlu618/jNVvMoFE6fg.mp4` |
| `GET /daily/999999` | 404（日期合法性校验拦截） |
| `GET /daily/abcdef` | 404（正则拦截） |

## 后续可选改进

- 若想在 `content/` 目录中也能嵌入"今日经句"，可把 `<DailyVerseDetail>` 直接用 MDC 语法在 Markdown 里调用，前提是 props 从一个 autoload 的 async composable 读取当日数据。
- 当前无主导航；可在 `app/app.vue` 的顶部加上 `<NuxtLink to="/today">今日</NuxtLink>` / `<NuxtLink to="/daily">日历</NuxtLink>`。
- 参考项目使用了 `go2024.simai.life` CDN 代理做指标统计；当前直连 r2，若需要埋点再接入。
