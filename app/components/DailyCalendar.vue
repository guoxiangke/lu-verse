<script setup lang="ts">
import type { DailyVerse } from '../composables/useDailyVerses'

const props = defineProps<{ items: DailyVerse[] }>()

type MonthGroup = {
  key: string
  label: string
  firstWeekday: number
  daysInMonth: number
  byDay: Map<number, DailyVerse>
  year: number
  month: number
}

const today = getTodayYYMMDDInUtc8()

const months = computed<MonthGroup[]>(() => {
  const groups = new Map<string, MonthGroup>()
  for (const it of props.items) {
    if (!isValidYYMMDD(it.date)) continue
    const year = 2000 + Number(it.date.slice(0, 2))
    const month = Number(it.date.slice(2, 4))
    const day = Number(it.date.slice(4, 6))
    const key = `${year}-${String(month).padStart(2, '0')}`
    let group = groups.get(key)
    if (!group) {
      group = {
        key,
        label: `${year} 年 ${month} 月`,
        firstWeekday: new Date(year, month - 1, 1).getDay(),
        daysInMonth: new Date(year, month, 0).getDate(),
        byDay: new Map(),
        year,
        month,
      }
      groups.set(key, group)
    }
    group.byDay.set(day, it)
  }
  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key))
})

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

function cellDate(year: number, month: number, day: number): string {
  return `${String(year % 100).padStart(2, '0')}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
}
</script>

<template>
  <div class="calendar">
    <section v-for="m in months" :key="m.key" class="month">
      <h2 class="month-title">{{ m.label }}</h2>
      <div class="weekdays">
        <span v-for="w in weekdayLabels" :key="w">{{ w }}</span>
      </div>
      <div class="grid">
        <span
          v-for="pad in m.firstWeekday"
          :key="`pad-${pad}`"
          class="cell pad"
        />
        <template v-for="day in m.daysInMonth" :key="day">
          <NuxtLink
            v-if="m.byDay.get(day)"
            :to="`/daily/${m.byDay.get(day)!.date}`"
            class="cell has"
            :class="{ today: cellDate(m.year, m.month, day) === today }"
            :title="m.byDay.get(day)!.title"
          >
            <span class="day-num">{{ day }}</span>
            <span class="day-title">{{ m.byDay.get(day)!.title }}</span>
          </NuxtLink>
          <span
            v-else
            class="cell empty"
            :class="{ today: cellDate(m.year, m.month, day) === today }"
          >
            <span class="day-num">{{ day }}</span>
          </span>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}
.month-title {
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.25rem;
}
.weekdays span {
  padding: 0.25rem 0;
  text-align: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.cell {
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.8rem;
  line-height: 1.2;
  background: #f5f5f5;
  color: #bbb;
  text-decoration: none;
}
.cell.pad {
  background: transparent;
}
.cell.has {
  background: #fff;
  color: #222;
  border: 1px solid #e5e5e5;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.cell.has:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.cell.today {
  outline: 2px solid #2e7d32;
  outline-offset: -2px;
}
.day-num {
  font-weight: 600;
  font-size: 0.9rem;
}
.day-title {
  font-size: 0.7rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
