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

const SOURCE_URL = 'https://raw.githubusercontent.com/guoxiangke/mbcotc/master/docs/PastorLu/lu.php'

export default defineCachedEventHandler(
  async (): Promise<OTResponse> => {
    try {
      const text = await $fetch<string>(SOURCE_URL, {
        responseType: 'text',
        signal: AbortSignal.timeout(10_000),
      })

      const items: OTItem[] = []
      const re = /"(\d{4})"\s*=>\s*\[\s*"vid"\s*=>\s*"([^"]+)"\s*,\s*"title"\s*=>\s*"([^"]+)"\s*\]/g
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        items.push({ date: m[1], vid: m[2], title: m[3] })
      }
      items.sort((a, b) => a.date.localeCompare(b.date))

      if (items.length === 0) {
        return { items: [], fetchedAt: new Date().toISOString(), error: 'No entries parsed from PHP source' }
      }

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
    getKey: () => 'ot-readings',
  },
)
