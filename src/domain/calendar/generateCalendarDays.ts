import { generateMonthGrid } from "../date/generateMonthGrid"
import { fromDateKey } from "../date/date.utils"
import type { CalendarDay } from "./calendar.types"

export function generateCalendarDays(
    year: number,
    month: number
): CalendarDay[] {
    const grid = generateMonthGrid(year, month)

    return grid.map((dateKey) => {
        const date = fromDateKey(dateKey)

        return {
            date: dateKey,
            isCurrentMonth: date.getUTCMonth() === month,
        }
    })
}