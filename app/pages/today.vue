<script setup lang="ts">
const { data } = await useDailyVerses()

const today = getTodayYYMMDDInUtc8()
const items = data.value?.items ?? []

const target =
  findByDate(items, today) ?? findLatestOnOrBefore(items, today) ?? items[0]

if (target) {
  await navigateTo(`/daily/${target.date}`, { redirectCode: 302 })
}
</script>

<template>
  <div class="fallback">
    <p v-if="data?.error">获取内容失败：{{ data.error }}</p>
    <p v-else>今日内容暂未发布，请稍后再试。</p>
    <p><NuxtLink to="/daily">查看全部日历</NuxtLink></p>
  </div>
</template>

<style scoped>
.fallback {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
}
</style>
