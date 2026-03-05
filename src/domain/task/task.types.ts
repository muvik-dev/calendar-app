import type {DateKey} from "../types/date"

export type TaskId = string

export interface Task {
    id: TaskId
    title: string
    date: DateKey
    order: number
    createdAt: string
}