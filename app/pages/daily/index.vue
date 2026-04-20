<script setup lang="ts">
const { data } = await useDailyVerses()

const items = computed(() => data.value?.items ?? [])
const today = getTodayYYMMDDInUtc8()
const hasToday = computed(() => items.value.some((it) => it.date === today))
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>每日圣经经句</h1>
      <p class="sub">
        <NuxtLink v-if="hasToday" :to="`/daily/${today}`">查看今日（{{ humanizeYYMMDD(today) }}）</NuxtLink>
        <span v-else>今日（{{ humanizeYYMMDD(today) }}）暂无内容</span>
      </p>
    </header>

    <p v-if="data?.error" class="error">数据拉取失败：{{ data.error }}</p>

    <DailyCalendar v-if="items.length" :items="items" />
    <p v-else class="empty">暂无数据。</p>
  </div>
</template>

<style scoped>
.page {
  padding: 1.5rem 0 3rem;
}
.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0 0 0.25rem;
}
.sub {
  color: #666;
  margin: 0;
}
.error,
.empty {
  text-align: center;
  color: #b00;
  padding: 2rem;
}
.empty {
  color: #888;
}
</style>
