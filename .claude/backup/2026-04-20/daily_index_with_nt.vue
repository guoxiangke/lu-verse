<script setup lang="ts">
const { data: dailyData } = await useDailyVerses()
const { data: ntData } = await useNTReadings()

const dailyItems = computed(() => dailyData.value?.items ?? [])
const ntItems = computed(() => ntData.value?.items ?? [])

const todayYYMMDD = getTodayYYMMDDInUtc8()
const hasToday = computed(() => dailyItems.value.some((it) => it.date === todayYYMMDD))
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>每日经句日历</h1>
      <p class="sub">
        <NuxtLink v-if="hasToday" :to="`/daily/${todayYYMMDD}`">查看今日（{{ humanizeYYMMDD(todayYYMMDD) }}）</NuxtLink>
        <span v-else>今日（{{ humanizeYYMMDD(todayYYMMDD) }}）暂无内容</span>
      </p>
    </header>

    <p v-if="dailyData?.error" class="error">数据拉取失败：{{ dailyData.error }}</p>
    <p v-if="ntData?.error" class="error">NT 数据拉取失败：{{ ntData.error }}</p>

    <DailyCalendar
      v-if="dailyItems.length"
      :items="dailyItems"
      :nt-items="ntItems"
    />
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
.sub a {
  color: #2e7d32;
  text-decoration: none;
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
