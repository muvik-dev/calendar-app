import type { Task } from "@/domain/types/task.types"
import type { DateKey } from "@/domain/types/date.types"

export type TaskAction =
    | { type: "SET_TASKS"; payload: Task[] }
    | { type: "ADD_TASK"; payload: Task }
    | { type: "UPDATE_TASK"; payload: { id: string; title: string } }
    | { type: "DELETE_TASK"; payload: { id: string } }
    | { type: "MOVE_TASK"; payload: { id: string; toDate: DateKey; newOrder: number } }
    | { type: "REORDER_TASK"; payload: { id: string; newOrder: number } }