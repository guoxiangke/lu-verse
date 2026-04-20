<script setup lang="ts">
import type { DailyVerse } from '../composables/useDailyVerses'

const props = defineProps<{ verse: DailyVerse }>()

const humanDate = computed(() => humanizeYYMMDD(props.verse.date))
const mp4Url = computed(
  () => `https://r2.savefamily.net/@pastorpaulqiankunlu618/${props.verse.vid}.mp4`,
)
const youtubeUrl = computed(
  () => `https://www.youtube.com/embed/${props.verse.vid}`,
)
</script>

<template>
  <article class="verse-detail">
    <header class="verse-header">
      <p class="verse-date">{{ humanDate }}</p>
      <h1 class="verse-title">{{ verse.title }}</h1>
    </header>

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

    <section class="media-block">
      <h2>MP4</h2>
      <div class="media-frame">
        <video :src="mp4Url" controls preload="metadata" />
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
</style>
