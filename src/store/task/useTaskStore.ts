import { useReducer } from "react"
import { taskReducer } from "./task.reducer"
import type { Task } from "@/domain/types/task.types"

export function useTaskStore(initialTasks: Task[] = []) {
    const [tasks, dispatch] = useReducer(taskReducer, initialTasks)

    return {
        tasks,
        dispatch,
    }
}