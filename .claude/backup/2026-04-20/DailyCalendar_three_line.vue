<script setup lang="ts">
import type { DailyVerse } from '../composables/useDailyVerses'
import type { NTItem } from '../composables/useNTReadings'

const props = defineProps<{
  items: DailyVerse[]
  ntItems?: NTItem[]
}>()

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

const ntByMMDD = computed(() => {
  const map = new Map<string, NTItem>()
  for (const it of props.ntItems ?? []) map.set(it.date, it)
  return map
})

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

function cellMMDD(month: number, day: number): string {
  return `${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
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
          <div
            v-if="m.byDay.get(day) || ntByMMDD.get(cellMMDD(m.month, day))"
            class="cell has"
            :class="{ today: cellDate(m.year, m.month, day) === today }"
          >
            <span class="day-num">{{ day }}</span>

            <NuxtLink
              v-if="m.byDay.get(day)"
              class="day-title"
              :to="`/daily/${m.byDay.get(day)!.date}`"
              :title="m.byDay.get(day)!.title"
            >{{ m.byDay.get(day)!.title }}</NuxtLink>
            <span v-else class="day-title empty-line">—</span>

            <NuxtLink
              v-if="ntByMMDD.get(cellMMDD(m.month, day))"
              class="nt-title"
              :to="`/nt/${cellMMDD(m.month, day)}`"
              :title="ntByMMDD.get(cellMMDD(m.month, day))!.title"
            >卢牧师读新约{{ cellMMDD(m.month, day) }}</NuxtLink>
            <span v-else class="nt-title empty-line">—</span>

            <span class="ot-title empty-line">—</span>
          </div>
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
  gap: 2rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 0.75rem;
}
.month-title {
  font-size: 1.15rem;
  margin: 0 0 0.5rem;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.75rem;
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
  gap: 4px;
}
.cell {
  min-height: 92px;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.15;
  background: #f5f5f5;
  color: #bbb;
  text-decoration: none;
  overflow: hidden;
}
.cell.pad {
  background: transparent;
  min-height: 0;
}
.cell.has {
  background: #fff;
  color: #222;
  border: 1px solid #e5e5e5;
}
.cell.today {
  outline: 2px solid #2e7d32;
  outline-offset: -2px;
}
.day-num {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1;
  margin-bottom: 2px;
}
.day-title,
.nt-title,
.ot-title {
  font-size: 0.68rem;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 3px;
  padding: 2px 3px;
  text-decoration: none;
  transition: background 0.12s ease;
}
.day-title {
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.06);
}
.nt-title {
  color: #1565c0;
  background: rgba(21, 101, 192, 0.06);
}
.ot-title {
  color: #8a6d3b;
  background: rgba(138, 109, 59, 0.06);
}
a.day-title:hover {
  background: rgba(46, 125, 50, 0.15);
}
a.nt-title:hover {
  background: rgba(21, 101, 192, 0.15);
}
.empty-line {
  color: #c5c5c5;
  background: transparent;
  text-align: center;
}

@media (min-width: 640px) {
  .calendar {
    padding: 1rem;
    gap: 2.5rem;
  }
  .month-title {
    font-size: 1.25rem;
  }
  .weekdays {
    font-size: 0.8rem;
  }
  .grid {
    gap: 6px;
  }
  .cell {
    padding: 6px;
    min-height: 112px;
  }
  .day-num {
    font-size: 0.9rem;
  }
  .day-title,
  .nt-title,
  .ot-title {
    font-size: 0.8rem;
  }
}

@media (max-width: 420px) {
  .day-num {
    font-size: 0.78rem;
  }
  .day-title,
  .nt-title,
  .ot-title {
    font-size: 0.6rem;
    padding: 1px 2px;
  }
  .grid {
    gap: 3px;
  }
  .cell {
    padding: 3px;
    border-radius: 5px;
    min-height: 80px;
  }
}
</style>
