import type { Holiday } from "@/domain/types/holiday.types"
import type { DateKey } from "@/domain/types/date.types"

export function groupHolidaysByDate(
    holidays: Holiday[]
): Record<DateKey, Holiday[]> {
    const byDate: Record<DateKey, Holiday[]> = {}

    for (const holiday of holidays) {
        const key = holiday.date as DateKey
        if (!byDate[key]) byDate[key] = []

        const alreadyListed = byDate[key].some((h) => h.name === holiday.name)
        if (!alreadyListed) {
            byDate[key].push(holiday)
        }
    }

    return byDate
}