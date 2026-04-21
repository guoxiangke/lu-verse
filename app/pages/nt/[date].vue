<script setup lang="ts">
const route = useRoute()
const dateParam = String(route.params.date)

if (!isValidMMDD(dateParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid date', fatal: true })
}

const { data } = await useNTReadings()
const items = computed(() => data.value?.items ?? [])

const item = computed(() => findNTByDate(items.value, dateParam))
const nav = computed(() => neighborsOfNT(items.value, dateParam))

if (!item.value && items.value.length > 0 && !data.value?.error) {
  throw createError({ statusCode: 404, statusMessage: 'No reading for this date', fatal: true })
}

const mp4Url = computed(() => {
  if (!item.value) return ''
  return `https://go2024.simai.life/api?redirect=https://r2.savefamily.net/@pastorpaulqiankunlu618/${item.value.vid}.mp4?metric=PastorLu&keyword=nt&type=video&bot=26&to=nt`
})

const youtubeUrl = computed(() =>
  item.value ? `https://www.youtube.com/embed/${item.value.vid}` : '',
)

const humanMMDD = computed(() => {
  if (!item.value) return dateParam
  const m = Number(item.value.date.slice(0, 2))
  const d = Number(item.value.date.slice(2, 4))
  return `${m} 月 ${d} 日`
})

useSeoMeta({
  title: () =>
    item.value
      ? `卢牧师带您读新约：${item.value.title}${item.value.duration ? ' · ' + item.value.duration : ''}`
      : '卢牧师带您读新约',
  description: () =>
    item.value
      ? `卢牧师带您读新约：${item.value.title}${item.value.duration ? '，时长 ' + item.value.duration : ''}`
      : '卢牧师带您读新约 · 每日一课，学习圣经新约',
})
</script>

<template>
  <div class="page">
    <VerseTabs current="nt" :mmdd="dateParam" />

    <p v-if="data?.error" class="error">数据拉取失败：{{ data.error }}</p>

    <article v-if="item" class="detail">
      <header class="detail-header">
        <p class="detail-date">{{ humanMMDD }}</p>
        <h1 class="detail-title">卢牧师读新约{{ item.date }}</h1>
        <p class="detail-sub">{{ item.title }} <span v-if="item.duration">· {{ item.duration }}</span></p>
      </header>

      <section class="media-block">
        <h2>MP4</h2>
        <div class="media-frame">
          <video :src="mp4Url" controls preload="metadata" />
        </div>
      </section>

      <section class="qr-block">
        <p class="qr-text">扫一扫 或 微信中 长按 下面的二维码，即可加卢牧师微信</p>
        <img
          src="https://r2.savefamily.net/OVagt1.JPG"
          alt="卢牧师微信二维码"
          class="qr-image"
          loading="lazy"
        >
      </section>

      <section class="media-block">
        <h2>YouTube</h2>
        <div class="media-frame">
          <iframe
            :src="youtubeUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
      </section>

      <nav class="detail-nav">
        <NuxtLink v-if="nav.prev" :to="`/nt/${nav.prev.date}`">← {{ nav.prev.date }}</NuxtLink>
        <span v-else />
        <NuxtLink to="/daily">回到日历</NuxtLink>
        <NuxtLink v-if="nav.next" :to="`/nt/${nav.next.date}`">{{ nav.next.date }} →</NuxtLink>
        <span v-else />
      </nav>
    </article>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem 0 3rem;
}
.detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.detail-header {
  text-align: center;
}
.detail-date {
  color: #666;
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}
.detail-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}
.detail-sub {
  color: #888;
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
}
.media-block h2 {
  font-size: 0.95rem;
  margin: 0 0 0.5rem;
  color: #555;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.media-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}
.media-frame iframe,
.media-frame video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.qr-block {
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 8px;
  padding: 1.25rem 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.qr-text {
  margin: 0 0 1rem;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
}
.qr-image {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 280px;
  height: auto;
  border-radius: 8px;
}
.error {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  color: #b00;
}
.detail-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
.detail-nav a {
  color: #1565c0;
  text-decoration: none;
}
.detail-nav a:nth-child(1) {
  justify-self: start;
}
.detail-nav a:nth-child(3) {
  justify-self: end;
}
</style>
