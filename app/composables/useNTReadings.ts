export type NTItem = {
  date: string
  title: string
  vid: string
  duration: string
}

export type NTResponse = {
  items: NTItem[]
  fetchedAt: string
  error?: string
}

export function useNTReadings() {
  return useFetch<NTResponse>('/api/nt', {
    key: 'nt-readings',
    default: () => ({ items: [], fetchedAt: '' }),
  })
}

export function findNTByDate(items: NTItem[], date: string): NTItem | undefined {
  return items.find((it) => it.date === date)
}

export function neighborsOfNT(items: NTItem[], date: string): {
  prev: NTItem | undefined
  next: NTItem | undefined
} {
  const idx = items.findIndex((it) => it.date === date)
  if (idx === -1) return { prev: undefined, next: undefined }
  return { prev: items[idx - 1], next: items[idx + 1] }
}

export function isValidMMDD(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}$/.test(s)) return false
  const month = Number(s.slice(0, 2))
  const day = Number(s.slice(2, 4))
  if (month < 1 || month > 12) return false
  const probe = new Date(2024, month - 1, day)
  return probe.getMonth() === month - 1 && probe.getDate() === day
}

export function getTodayMMDDInUtc8(): string {
  const d = getUtc8Now()
  return `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}
