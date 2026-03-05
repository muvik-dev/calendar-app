import type { Task } from "@/domain/task/task.types"
import type { DateKey } from "@/domain/types/date"

export type TaskAction =
    | { type: "ADD_TASK"; payload: Task }
    | { type: "UPDATE_TASK"; payload: { id: string; title: string } }
    | { type: "DELETE_TASK"; payload: { id: string } }
    | { type: "MOVE_TASK"; payload: { id: string; toDate: DateKey; newOrder: number } }
    | { type: "REORDER_TASK"; payload: { id: string; newOrder: number } }