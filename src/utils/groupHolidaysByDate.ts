import type { Holiday } from "@/domain/holiday/holiday.types"
import type { DateKey } from "@/domain/types/date"

export function groupHolidaysByDate(
    holidays: Holiday[]
): Record<DateKey, Holiday[]> {
    const byDate: Record<DateKey, Holiday[]> = {}

    for (const holiday of holidays) {
        const key = holiday.date as DateKey
        if (!byDate[key]) byDate[key] = []
        byDate[key].push(holiday)
    }

    return byDate
}