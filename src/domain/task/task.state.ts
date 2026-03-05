import type {Task, TaskId} from "./task.types.ts"
import type {DateKey} from "../types/date"

export interface TasksState {
    byId: Record<TaskId, Task>
    byDate: Record<DateKey, TaskId[]>
}