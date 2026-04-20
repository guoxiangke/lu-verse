const UTC8_OFFSET_MINUTES = -480

export function getUtc8Now(): Date {
  const now = new Date()
  const offsetMs = (now.getTimezoneOffset() - UTC8_OFFSET_MINUTES) * 60_000
  return new Date(now.getTime() + offsetMs)
}

export function formatYYMMDD(d: Date): string {
  const yy = String(d.getFullYear() % 100).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yy}${mm}${dd}`
}

export function getTodayYYMMDDInUtc8(): string {
  return formatYYMMDD(getUtc8Now())
}

export function isValidYYMMDD(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{6}$/.test(s)) return false
  const year = 2000 + Number(s.slice(0, 2))
  const month = Number(s.slice(2, 4))
  const day = Number(s.slice(4, 6))
  if (month < 1 || month > 12) return false
  const probe = new Date(year, month - 1, day)
  return (
    probe.getFullYear() === year &&
    probe.getMonth() === month - 1 &&
    probe.getDate() === day
  )
}

export function parseYYMMDD(s: string): Date {
  const year = 2000 + Number(s.slice(0, 2))
  const month = Number(s.slice(2, 4))
  const day = Number(s.slice(4, 6))
  return new Date(year, month - 1, day)
}

export function humanizeYYMMDD(s: string): string {
  if (!isValidYYMMDD(s)) return s
  const d = parseYYMMDD(s)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
