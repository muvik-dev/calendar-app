import type { DateKey } from "@/domain/types/date.types"

export interface Task {
    id: string
    title: string
    date: DateKey
    order: number
    createdAt: number
    updatedAt: number
}