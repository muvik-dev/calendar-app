import { fromDateKey } from "./date.utils"
import type { DateKey } from "../types/date"

export function getDayNumber(dateKey: DateKey): number {
    return fromDateKey(dateKey).getUTCDate()
}