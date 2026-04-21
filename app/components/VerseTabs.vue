<script setup lang="ts">
type TabType = 'daily' | 'nt' | 'ot'

const props = defineProps<{
  current: TabType
  yymmdd?: string
  mmdd?: string
}>()

const resolvedMMDD = computed(() => {
  if (props.mmdd) return props.mmdd
  if (props.yymmdd) return props.yymmdd.slice(2)
  return ''
})

const resolvedYYMMDD = computed(() => {
  if (props.yymmdd) return props.yymmdd
  if (!resolvedMMDD.value) return ''
  const now = getUtc8Now()
  const yy = String(now.getFullYear() % 100).padStart(2, '0')
  return `${yy}${resolvedMMDD.value}`
})

const tabs = computed(() => [
  { key: 'daily' as TabType, label: '金句', to: `/daily/${resolvedYYMMDD.value}` },
  { key: 'nt' as TabType, label: '新约', to: `/nt/${resolvedMMDD.value}` },
  { key: 'ot' as TabType, label: '旧约', to: `/ot/${resolvedMMDD.value}` },
])
</script>

<template>
  <nav class="tabs" aria-label="经文类型切换">
    <NuxtLink
      v-for="t in tabs"
      :key="t.key"
      :to="t.to"
      class="tab"
      :class="{ active: t.key === props.current }"
      :aria-current="t.key === props.current ? 'page' : undefined"
    >{{ t.label }}</NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  max-width: 900px;
  margin: 0 auto 1rem;
  padding: 0 1rem;
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}
.tab {
  flex: 1 1 auto;
  max-width: 220px;
  text-align: center;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: #f2f2f2;
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: background 0.12s ease, color 0.12s ease;
}
.tab:hover {
  background: #e6e6e6;
}
.tab.active {
  background: #2e7d32;
  color: #fff;
  border-color: #2e7d32;
  pointer-events: none;
}
.tab.active:hover {
  background: #2e7d32;
}
@media (max-width: 420px) {
  .tabs {
    padding: 0 0.5rem;
    gap: 4px;
  }
  .tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
