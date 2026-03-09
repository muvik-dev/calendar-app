import type { DateKey } from "./date.types"

export interface Holiday {
    date: DateKey
    localName: string
    name: string
    countryCode: string
}
