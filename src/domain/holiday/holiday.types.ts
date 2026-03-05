import type {DateKey} from "../types/date"

export interface Holiday {
    date: DateKey
    localName: string
    name: string
    countryCode: string
}
