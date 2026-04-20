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

const SOURCE_URL = 'https://r2.savefamily.net/PastorLu-today.json'

export default defineCachedEventHandler(
  async (): Promise<DailyResponse> => {
    try {
      const raw = await $fetch<unknown>(SOURCE_URL, {
        signal: AbortSignal.timeout(10_000),
        responseType: 'json',
      })

      if (!Array.isArray(raw)) {
        return { items: [], fetchedAt: new Date().toISOString(), error: 'Upstream payload is not an array' }
      }

      const items = (raw as DailyVerse[])
        .filter((it) => it && typeof it.date === 'string' && typeof it.vid === 'string')
        .sort((a, b) => b.date.localeCompare(a.date))

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
    getKey: () => 'daily-verses',
  },
)
