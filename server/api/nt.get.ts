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

const SOURCE_URL = 'https://r2.savefamily.net/lu-nt-2025.json'

type Raw = { 标题?: string; vid?: string; 时间?: string }

export default defineCachedEventHandler(
  async (): Promise<NTResponse> => {
    try {
      const raw = await $fetch<unknown>(SOURCE_URL, {
        signal: AbortSignal.timeout(10_000),
        responseType: 'json',
      })

      if (!Array.isArray(raw)) {
        return { items: [], fetchedAt: new Date().toISOString(), error: 'Upstream payload is not an array' }
      }

      const items: NTItem[] = []
      for (const r of raw as Raw[]) {
        if (!r || typeof r.标题 !== 'string' || typeof r.vid !== 'string') continue
        const date = r.标题.slice(0, 4)
        if (!/^\d{4}$/.test(date)) continue
        items.push({
          date,
          title: r.标题,
          vid: r.vid,
          duration: typeof r.时间 === 'string' ? r.时间 : '',
        })
      }
      items.sort((a, b) => a.date.localeCompare(b.date))

      return { items, fetchedAt: new Date().toISOString() }
    } catch (err) {
      return {
        items: [],
        fetchedAt: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      }
    }
  },
  {
    maxAge: 60 * 60,
    swr: true,
    getKey: () => 'nt-readings',
  },
)
