export type DailyVerse = {
  date: string
  vid: string
  title: string
}

export type DailyResponse = {
  items: DailyVerse[]
  fetchedAt: string
  error?: string
}

export function useDailyVerses() {
  return useFetch<DailyResponse>('/api/daily', {
    key: 'daily-verses',
    default: () => ({ items: [], fetchedAt: '' }),
  })
}

export function findByDate(items: DailyVerse[], date: string): DailyVerse | undefined {
  return items.find((it) => it.date === date)
}

export function findLatestOnOrBefore(items: DailyVerse[], date: string): DailyVerse | undefined {
  for (const it of items) {
    if (it.date <= date) return it
  }
  return undefined
}

export function neighborsOf(items: DailyVerse[], date: string): {
  prev: DailyVerse | undefined
  next: DailyVerse | undefined
} {
  const idx = items.findIndex((it) => it.date === date)
  if (idx === -1) return { prev: undefined, next: undefined }
  return {
    next: items[idx - 1],
    prev: items[idx + 1],
  }
}
