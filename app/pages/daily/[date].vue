<script setup lang="ts">
const route = useRoute()
const dateParam = String(route.params.date)

if (!isValidYYMMDD(dateParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid date', fatal: true })
}

const { data } = await useDailyVerses()
const items = computed(() => data.value?.items ?? [])

const verse = computed(() => findByDate(items.value, dateParam))
const nav = computed(() => neighborsOf(items.value, dateParam))

if (!verse.value && items.value.length > 0 && !data.value?.error) {
  throw createError({ statusCode: 404, statusMessage: 'No verse for this date', fatal: true })
}

useSeoMeta({
  title: () => verse.value ? `每日圣经金句：${verse.value.title}` : '每日圣经金句',
  description: () =>
    verse.value
      ? `${humanizeYYMMDD(verse.value.date)} 每日圣经金句：${verse.value.title}`
      : '每日圣经金句 · 每天一句，安静你的心',
})
</script>

<template>
  <div class="page">
    <VerseTabs current="daily" :yymmdd="dateParam" />

    <p v-if="data?.error" class="error">数据拉取失败：{{ data.error }}</p>

    <DailyVerseDetail v-if="verse" :verse="verse" />
    <p v-else-if="!data?.error" class="empty">该日期没有内容。</p>

    <nav v-if="verse" class="verse-nav">
      <NuxtLink v-if="nav.prev" :to="`/daily/${nav.prev.date}`">← {{ humanizeYYMMDD(nav.prev.date) }}</NuxtLink>
      <span v-else />
      <NuxtLink to="/daily">日历</NuxtLink>
      <NuxtLink v-if="nav.next" :to="`/daily/${nav.next.date}`">{{ humanizeYYMMDD(nav.next.date) }} →</NuxtLink>
      <span v-else />
    </nav>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem 0 3rem;
}
.error,
.empty {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  color: #b00;
}
.empty {
  color: #666;
}
.verse-nav {
  max-width: 900px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}
.verse-nav a {
  color: #2e7d32;
  text-decoration: none;
}
.verse-nav a:nth-child(1) {
  justify-self: start;
}
.verse-nav a:nth-child(3) {
  justify-self: end;
}
</style>
