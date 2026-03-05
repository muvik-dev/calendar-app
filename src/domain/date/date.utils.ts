import type {DateKey} from "../types/date"

export function toDateKey(date: Date): DateKey {
    return date.toISOString().split("T")[0]
}

export function fromDateKey(key: DateKey): Date {
    return new Date(`${key}T00:00:00.000Z`)
}

export function addDays(key: DateKey, amount: number): DateKey {
    const date = fromDateKey(key)
    const next = new Date(date.getTime() + amount * 24 * 60 * 60 * 1000)
    return toDateKey(next)
}