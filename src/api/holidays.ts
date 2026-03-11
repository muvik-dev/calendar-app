import type { Holiday } from "@/domain/types/holiday.types"
import type { DateKey } from "@/domain/types/date.types"
import { groupHolidaysByDate } from "@/utils/groupHolidaysByDate";

const NAGER_URL = "https://date.nager.at/api/v3"
const SERVER_URL = import.meta.env.VITE_API_URL ?? ""

export interface AvailableCountry {
    countryCode: string
    name: string
}

export async function getAvailableCountries(): Promise<AvailableCountry[]> {
    try {
        const response = await fetch(`${NAGER_URL}/AvailableCountries`)
        if (!response.ok) return []
        return await response.json()
    } catch {
        return []
    }
}

interface HolidayResponse {
    date: string
    localName: string
    name: string
    countryCode: string
    global: boolean
    types?: string[]
}

function onlyGlobalPublicHolidays(list: HolidayResponse[]): Holiday[] {
    return list.filter((h) => h.global && h.types?.includes("Public"))
}

export async function loadNextHolidaysWorldwide(): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(`${NAGER_URL}/NextPublicHolidaysWorldwide`)
        if (!response.ok) return {}
        const data: HolidayResponse[] = await response.json()
        const filtered = onlyGlobalPublicHolidays(data)
        return groupHolidaysByDate(filtered)
    } catch {
        return {}
    }
}

export async function loadWorldwideHolidays(year: number): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(`${SERVER_URL}/api/holidays/worldwide?year=${year}`)
        if (!response.ok) return {}
        return await response.json()
    } catch {
        return {}
    }
}

export async function loadHolidaysForCountry(year: number, countryCode: string): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(
            `${NAGER_URL}/PublicHolidays/${year}/${countryCode}`
        )
        if (!response.ok) return {}
        const data: HolidayResponse[] = await response.json()
        const filtered = onlyGlobalPublicHolidays(data)
        return groupHolidaysByDate(filtered)
    } catch {
        return {}
    }
}
