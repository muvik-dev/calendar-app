import type { DateKey } from "../types/date"

export interface CalendarDay {
    date: DateKey
    isCurrentMonth: boolean
}