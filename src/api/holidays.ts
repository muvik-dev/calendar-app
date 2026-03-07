import type { Holiday } from "@/domain/holiday/holiday.types"
import type { DateKey } from "@/domain/types/date"

const HOLIDAYS_API_URL = "https://date.nager.at/api/v3/NextPublicHolidaysWorldwide"

export async function loadHolidays(): Promise<Record<DateKey, Holiday[]>> {
    try {
        const response = await fetch(HOLIDAYS_API_URL)
        if (!response.ok) {
            return {}
        }
        const data: Holiday[] = await response.json()
        const byDate: Record<DateKey, Holiday[]> = {}
        for (const holiday of data) {
            const key = holiday.date as DateKey
            if (!byDate[key]) byDate[key] = []
            byDate[key].push(holiday)
        }
        return byDate
    } catch {
        return {}
    }
}
