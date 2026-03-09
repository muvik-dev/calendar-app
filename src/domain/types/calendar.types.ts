import type { DateKey } from "./date.types"

export interface CalendarDay {
    date: DateKey
    isCurrentMonth: boolean
}