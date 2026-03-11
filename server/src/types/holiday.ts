export interface Holiday {
    date: string
    name: string
    localName: string
    countryCode: string
}

export interface WorldwideHolidaysRecord {
    year: number
    updatedAt: number
    holidays: Record<string, Holiday[]>
}
