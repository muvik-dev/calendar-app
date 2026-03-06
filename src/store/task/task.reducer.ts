import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "./task.actions"

function normalizeOrder(tasks: Task[], date: string): Task[] {
    const sameDay = tasks
        .filter((t) => t.date === date)
        .sort((a, b) => a.order - b.order)

    return sameDay.map((task, index) => ({
        ...task,
        order: index,
    }))
}

export function taskReducer(state: Task[], action: TaskAction): Task[] {
    switch (action.type) {
        case "ADD_TASK":
            return [...state, action.payload]

        case "UPDATE_TASK":
            return state.map((task) =>
                task.id === action.payload.id
                    ? {
                        ...task,
                        title: action.payload.title,
                        updatedAt: Date.now(),
                    }
                    : task
            )

        case "DELETE_TASK":
            return state.filter((t) => t.id !== action.payload.id)

        case "REORDER_TASK": {
            const task = state.find((t) => t.id === action.payload.id)
            if (!task) return state

            const dayTasks = state
                .filter((t) => t.date === task.date)
                .sort((a, b) => a.order - b.order)

            const otherTasks = state.filter((t) => t.date !== task.date)

            const filtered = dayTasks.filter((t) => t.id !== task.id)

            filtered.splice(action.payload.newOrder, 0, task)

            const reordered = filtered.map((t, index) => ({
                ...t,
                order: index,
            }))

            return [...otherTasks, ...reordered]
        }

        case "MOVE_TASK": {
            const task = state.find((t) => t.id === action.payload.id)
            if (!task) return state

            const updated = state.map((t) =>
                t.id === task.id
                    ? {
                        ...t,
                        date: action.payload.toDate,
                        order: action.payload.newOrder,
                    }
                    : t
            )

            const fromNormalized = normalizeOrder(updated, task.date)
            const toNormalized = normalizeOrder(
                updated,
                action.payload.toDate
            )

            return [
                ...updated.filter(
                    (t) =>
                        t.date !== task.date &&
                        t.date !== action.payload.toDate
                ),
                ...fromNormalized,
                ...toNormalized,
            ]
        }

        default:
            return state
    }
}