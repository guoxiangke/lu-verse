<script setup lang="ts">
import type { NTItem } from '../composables/useNTReadings'

const props = defineProps<{ items: NTItem[] }>()

type MonthGroup = {
  key: string
  label: string
  firstWeekday: number
  daysInMonth: number
  byDay: Map<number, NTItem>
  month: number
}

const today = getTodayMMDDInUtc8()
const probeYear = new Date().getFullYear()

const months = computed<MonthGroup[]>(() => {
  const groups = new Map<string, MonthGroup>()
  for (const it of props.items) {
    if (!isValidMMDD(it.date)) continue
    const month = Number(it.date.slice(0, 2))
    const day = Number(it.date.slice(2, 4))
    const key = String(month).padStart(2, '0')
    let group = groups.get(key)
    if (!group) {
      group = {
        key,
        label: `${month} 月`,
        firstWeekday: new Date(probeYear, month - 1, 1).getDay(),
        daysInMonth: new Date(probeYear, month, 0).getDate(),
        byDay: new Map(),
        month,
      }
      groups.set(key, group)
    }
    group.byDay.set(day, it)
  }
  return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key))
})

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

function cellMMDD(month: number, day: number): string {
  return `${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
}
</script>

<template>
  <div class="calendar">
    <section v-for="m in months" :key="m.key" class="month">
      <h3 class="month-title">{{ m.label }}</h3>
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
            :to="`/nt/${m.byDay.get(day)!.date}`"
            class="cell has"
            :class="{ today: cellMMDD(m.month, day) === today }"
            :title="m.byDay.get(day)!.title"
          >
            <span class="day-num">{{ day }}</span>
            <span class="day-title">卢牧师读新约{{ m.byDay.get(day)!.date }}</span>
          </NuxtLink>
          <span
            v-else
            class="cell empty"
            :class="{ today: cellMMDD(m.month, day) === today }"
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
  font-size: 1.1rem;
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
  min-height: 56px;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  line-height: 1.15;
  background: #f5f5f5;
  color: #bbb;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.cell.pad {
  background: transparent;
  min-height: 0;
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
  outline: 2px solid #1565c0;
  outline-offset: -2px;
}
.day-num {
  font-weight: 600;
  font-size: 0.85rem;
}
.day-title {
  font-size: 0.65rem;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-break: break-all;
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
    min-height: 72px;
  }
  .day-num {
    font-size: 0.9rem;
  }
  .day-title {
    font-size: 0.85em;
  }
}

@media (max-width: 420px) {
  .day-title {
    font-size: 0.55rem;
  }
  .day-num {
    font-size: 0.78rem;
  }
  .grid {
    gap: 3px;
  }
  .cell {
    padding: 3px;
    border-radius: 5px;
  }
}
</style>
