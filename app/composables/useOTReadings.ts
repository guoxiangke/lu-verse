export type OTItem = {
  date: string
  title: string
  vid: string
}

export type OTResponse = {
  items: OTItem[]
  fetchedAt: string
  error?: string
}

export function useOTReadings() {
  return useFetch<OTResponse>('/api/ot', {
    key: 'ot-readings',
    default: () => ({ items: [], fetchedAt: '' }),
  })
}

export function findOTByDate(items: OTItem[], date: string): OTItem | undefined {
  return items.find((it) => it.date === date)
}

export function neighborsOfOT(items: OTItem[], date: string): {
  prev: OTItem | undefined
  next: OTItem | undefined
} {
  const idx = items.findIndex((it) => it.date === date)
  if (idx === -1) return { prev: undefined, next: undefined }
  return { prev: items[idx - 1], next: items[idx + 1] }
}
