import type { DateKey } from "../domain/types/date.types"

export function toDateKey(date: Date): DateKey {
    return date.toISOString().split("T")[0]
}

export function fromDateKey(key: DateKey): Date {
    return new Date(`${key}T00:00:00.000Z`)
}