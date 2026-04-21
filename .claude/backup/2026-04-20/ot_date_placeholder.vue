<script setup lang="ts">
const route = useRoute()
const dateParam = String(route.params.date)

if (!isValidMMDD(dateParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid date', fatal: true })
}

const humanMMDD = computed(() => {
  const m = Number(dateParam.slice(0, 2))
  const d = Number(dateParam.slice(2, 4))
  return `${m} 月 ${d} 日`
})

useSeoMeta({
  title: '卢牧师带您读旧约：xxx',
  description: '卢牧师带您读旧约 · 每日一课，学习圣经旧约',
})
</script>

<template>
  <div class="page">
    <VerseTabs current="ot" :mmdd="dateParam" />

    <article class="placeholder">
      <header class="ph-header">
        <p class="ph-date">{{ humanMMDD }}</p>
        <h1 class="ph-title">旧约 · 待上线</h1>
      </header>
      <p class="ph-text">旧约板块正在准备中，敬请期待。</p>
      <p class="ph-back">
        <NuxtLink to="/daily">返回日历</NuxtLink>
      </p>
    </article>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem 0 3rem;
}
.placeholder {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2.5rem 1.5rem;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 8px;
  text-align: center;
}
.ph-header {
  margin-bottom: 1rem;
}
.ph-date {
  color: #666;
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}
.ph-title {
  margin: 0;
  font-size: 1.5rem;
  color: #8a6d3b;
}
.ph-text {
  color: #666;
  margin: 0 0 1.5rem;
}
.ph-back a {
  color: #2e7d32;
  text-decoration: none;
}
</style>
