import type { Holiday } from "../types/holiday.js"
import * as repo from "../repository/HolidayRepository.js"

const NAGER_BASE = "https://date.nager.at/api/v3"
const CONCURRENCY = 10

interface NagerCountry {
    countryCode: string
    name: string
}

interface NagerHoliday {
    date: string
    name: string
    localName: string
    countryCode: string
    global: boolean
    types?: string[]
}

async function fetchJson<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            console.error(`Nager API error: ${res.status} ${res.statusText} for ${url}`)
            return null
        }
        return await res.json() as T
    } catch (e) {
        console.error(`Nager API fetch failed for ${url}:`, e)
        return null
    }
}

async function fetchAllCountries(): Promise<NagerCountry[]> {
    return (await fetchJson<NagerCountry[]>(`${NAGER_BASE}/AvailableCountries`)) ?? []
}

async function fetchHolidaysForCountry(year: number, code: string): Promise<Holiday[]> {
    const data = await fetchJson<NagerHoliday[]>(
        `${NAGER_BASE}/PublicHolidays/${year}/${code}`
    )
    if (!data) return []

    return data
        .filter((h) => h.global && h.types?.includes("Public"))
        .map((h) => ({ date: h.date, name: h.name, localName: h.localName, countryCode: h.countryCode }))
}

function groupByDate(holidays: Holiday[]): Record<string, Holiday[]> {
    const byDate: Record<string, Holiday[]> = {}

    for (const h of holidays) {
        if (!byDate[h.date]) byDate[h.date] = []
        const exists = byDate[h.date].some((x) => x.name === h.name)
        if (!exists) byDate[h.date].push(h)
    }

    return byDate
}

async function runInBatches<T, R>(
    items: T[],
    concurrency: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = []

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency)
        const batchResults = await Promise.all(batch.map(fn))
        results.push(...batchResults)
    }

    return results
}

async function fetchWorldwideHolidays(year: number): Promise<Record<string, Holiday[]>> {
    const countries = await fetchAllCountries()
    console.log(`Fetching holidays for ${countries.length} countries (year ${year})...`)

    const perCountry = await runInBatches(countries, CONCURRENCY, (c) =>
        fetchHolidaysForCountry(year, c.countryCode)
    )

    const allHolidays = perCountry.flat()
    console.log(`Fetched ${allHolidays.length} holidays, grouping by date...`)

    return groupByDate(allHolidays)
}

export async function getWorldwideHolidays(year: number): Promise<Record<string, Holiday[]>> {
    const cached = await repo.findByYear(year)
    if (cached) return cached

    return generateWorldwideHolidays(year)
}

export async function generateWorldwideHolidays(year: number): Promise<Record<string, Holiday[]>> {
    const holidays = await fetchWorldwideHolidays(year)

    if (Object.keys(holidays).length === 0) {
        console.error(`No holidays fetched for ${year}, skipping save`)
        return holidays
    }

    await repo.upsert(year, holidays)
    console.log(`Worldwide holidays for ${year} saved to database`)
    return holidays
}

export async function ensureCurrentYear(): Promise<void> {
    const year = new Date().getFullYear()
    const existing = await repo.findByYear(year)
    if (existing) {
        console.log(`Worldwide holidays for ${year} already in database`)
        return
    }
    await generateWorldwideHolidays(year)
}
