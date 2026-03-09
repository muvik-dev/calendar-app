import { DAY_IN_MS } from "../domain/constants"
import { toDateKey } from "./date.utils"
import type { DateKey } from "../domain/types/date.types"

export function generateMonthGrid(year: number, month: number): DateKey[] {
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1))

    const offset = firstDayOfMonth.getUTCDay()

    const gridStart = firstDayOfMonth.getTime() - offset * DAY_IN_MS

    return Array.from({ length: 42 }, (_, index) => {
        const current = new Date(gridStart + index * DAY_IN_MS)
        return toDateKey(current)
    })
}