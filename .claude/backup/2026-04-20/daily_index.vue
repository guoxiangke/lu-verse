<script setup lang="ts">
const { data: dailyData } = await useDailyVerses()
const { data: ntData } = await useNTReadings()

const dailyItems = computed(() => dailyData.value?.items ?? [])
const ntItems = computed(() => ntData.value?.items ?? [])

const todayYYMMDD = getTodayYYMMDDInUtc8()
const todayMMDD = getTodayMMDDInUtc8()
const hasTodayVerse = computed(() => dailyItems.value.some((it) => it.date === todayYYMMDD))
const hasTodayNT = computed(() => ntItems.value.some((it) => it.date === todayMMDD))
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>日历</h1>
    </header>

    <section class="row">
      <div class="row-header">
        <h2>1. 每日圣经经句</h2>
        <p class="row-sub">
          <NuxtLink v-if="hasTodayVerse" :to="`/daily/${todayYYMMDD}`">查看今日（{{ humanizeYYMMDD(todayYYMMDD) }}）</NuxtLink>
          <span v-else>今日（{{ humanizeYYMMDD(todayYYMMDD) }}）暂无内容</span>
        </p>
      </div>
      <p v-if="dailyData?.error" class="error">数据拉取失败：{{ dailyData.error }}</p>
      <DailyCalendar v-else-if="dailyItems.length" :items="dailyItems" />
      <p v-else class="empty">暂无数据。</p>
    </section>

    <section class="row">
      <div class="row-header">
        <h2>2. 卢牧师带你读新约</h2>
        <p class="row-sub">
          <NuxtLink v-if="hasTodayNT" :to="`/nt/${todayMMDD}`">查看今日（卢牧师读新约{{ todayMMDD }}）</NuxtLink>
          <span v-else>今日（{{ todayMMDD }}）暂无内容</span>
        </p>
      </div>
      <p v-if="ntData?.error" class="error">数据拉取失败：{{ ntData.error }}</p>
      <NTCalendar v-else-if="ntItems.length" :items="ntItems" />
      <p v-else class="empty">暂无数据。</p>
    </section>

    <section class="row">
      <div class="row-header">
        <h2>3. 待定</h2>
        <p class="row-sub">敬请期待</p>
      </div>
      <div class="placeholder">此板块将稍后添加</div>
    </section>
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
  margin: 0;
}
.row {
  padding: 1.5rem 0;
  border-top: 1px solid #eee;
}
.row:first-of-type {
  border-top: 0;
}
.row-header {
  max-width: 960px;
  margin: 0 auto 0.75rem;
  padding: 0 1rem;
}
.row-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
}
.row-sub {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}
.row-sub a {
  color: #2e7d32;
  text-decoration: none;
}
.error,
.empty,
.placeholder {
  text-align: center;
  color: #b00;
  padding: 2rem;
}
.empty,
.placeholder {
  color: #888;
}
.placeholder {
  max-width: 960px;
  margin: 0 auto;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 8px;
}
</style>
