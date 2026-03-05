import type { DateKey } from "@/domain/types/date"

export interface Task {
    id: string
    title: string
    date: DateKey
    order: number
    createdAt: number
    updatedAt: number
}