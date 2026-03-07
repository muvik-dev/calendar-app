import { useCallback, useEffect, useRef, useState } from "react"
import { taskApi } from "@/api/tasks"
import type { TaskAction } from "./task.actions"
import { useTaskStore } from "./useTaskStore"

function getErrorMessage(e: unknown, fallback: string) {
    return e instanceof Error ? e.message : fallback
}


export function useTaskStoreWithApi() {
    const { tasks, dispatch } = useTaskStore([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const dispatchRef = useRef(dispatch)

    useEffect(() => {
        dispatchRef.current = dispatch
    }, [dispatch])


    useEffect(() => {
        taskApi
            .list().then((list) => {
                dispatchRef.current({ type: "SET_TASKS", payload: list })
            })
            .catch((e) => setError(getErrorMessage(e, "Failed to load tasks")))
            .finally(() => setLoading(false))
    }, [])

    const persistDispatch = useCallback((action: TaskAction) => {
        const inner = dispatchRef.current
        switch (action.type) {
            case "ADD_TASK": {
                const { title, date, order } = action.payload
                return taskApi
                    .create({ title, date, order })
                    .then((created) => inner({ type: "ADD_TASK", payload: created }))
                    .catch((e) => setError(getErrorMessage(e, "Failed to add task")))
            }
            case "UPDATE_TASK":
                return taskApi
                    .update(action.payload.id, { title: action.payload.title })
                    .then(() => inner(action))
                    .catch((e) => setError(getErrorMessage(e, "Failed to update task")))
            case "DELETE_TASK":
                return taskApi
                    .delete(action.payload.id)
                    .then(() => inner(action))
                    .catch((e) => setError(getErrorMessage(e, "Failed to delete task")))

            case "MOVE_TASK":
                return taskApi
                    .update(action.payload.id, {
                        date: action.payload.toDate,
                        order: action.payload.newOrder,
                    })
                    .then(() => inner(action))
                    .catch((e) => setError(getErrorMessage(e, "Failed to move task")))
            case "REORDER_TASK":
                return taskApi
                    .update(action.payload.id, { order: action.payload.newOrder })
                    .then(() => inner(action))
                    .catch((e) => setError(getErrorMessage(e, "Failed to reorder task")))
            default:
                inner(action)
        }
    }, [])

    return { tasks, dispatch: persistDispatch, loading, error }
}
