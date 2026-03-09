import { generateMonthGrid } from "./generateMonthGrid"
import { fromDateKey } from "./date.utils"
import type { CalendarDay } from "../domain/types/calendar.types"

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