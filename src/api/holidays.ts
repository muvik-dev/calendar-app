import type { Holiday } from "@/domain/holiday/holiday.types"
import type { DateKey } from "@/domain/types/date"
import { groupHolidaysByDate } from "@/utils/groupHolidaysByDate.ts";

const BASE_URL = "https://date.nager.at/api/v3"

export interface AvailableCountry {
    countryCode: string
    name: string
}

export async function getAvailableCountries(): Promise<AvailableCountry[]> {
    try {
        const response = await fetch(`${BASE_URL}/AvailableCountries`)
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
    types?: string[]
}

function onlyPublicHolidays(list: HolidayResponse[]): Holiday[] {
    return list
        .filter((h) => h.types?.includes("Public") ?? true)
}

export async function loadNextHolidaysWorldwide(): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(`${BASE_URL}/NextPublicHolidaysWorldwide`)
        if (!response.ok) return {}
        const data: HolidayResponse[] = await response.json()
        const filtered = onlyPublicHolidays(data)
        return groupHolidaysByDate(filtered)
    } catch {
        return {}
    }
}

export async function loadHolidaysForCountry(year: number, countryCode: string): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(
            `${BASE_URL}/PublicHolidays/${year}/${countryCode}`
        )
        if (!response.ok) return {}
        const data: HolidayResponse[] = await response.json()
        const filtered = onlyPublicHolidays(data)
        return groupHolidaysByDate(filtered)
    } catch {
        return {}
    }
}
