<script setup lang="ts">
import type { DailyVerse } from '../composables/useDailyVerses'

const props = defineProps<{ verse: DailyVerse }>()

const humanDate = computed(() => humanizeYYMMDD(props.verse.date))
const mp4Url = computed(
  () =>
    `https://go2024.simai.life/api?redirect=https://r2.savefamily.net/@pastorpaulqiankunlu618/${props.verse.vid}.mp4?metric=PastorLu&keyword=verse&type=video&bot=26&to=verse`,
)
const youtubeUrl = computed(
  () => `https://www.youtube.com/embed/${props.verse.vid}`,
)
</script>

<template>
  <article class="verse-detail">
    <header class="verse-header">
      <p class="verse-date">{{ humanDate }}</p>
      <h1 class="verse-title">每日圣经金句</h1>
      <p class="verse-sub">{{ verse.title }}</p>
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
  </article>
</template>

<style scoped>
.verse-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.verse-header {
  text-align: center;
}
.verse-date {
  color: #666;
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}
.verse-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}
.verse-sub {
  color: #333;
  margin: 0.5rem 0 0;
  font-size: 1rem;
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
</style>
