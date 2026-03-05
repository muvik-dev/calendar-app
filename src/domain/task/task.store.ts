import { useState } from "react"
import type { Task } from "@/domain/task/task.types"

export function useTaskStore() {
    const [tasks, setTasks] = useState<Task[]>([])

    return {
        tasks,
        setTasks,
    }
}