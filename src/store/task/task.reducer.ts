import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "./task.actions"

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

            const fromDate = task.date
            const toDate = action.payload.toDate

            const fromDayTasks = state
                .filter((t) => t.date === fromDate && t.id !== task.id)
                .sort((a, b) => a.order - b.order)

            const toDayTasks = state
                .filter((t) => t.date === toDate)
                .sort((a, b) => a.order - b.order)

            const otherTasks = state.filter(
                (t) => t.date !== fromDate && t.date !== toDate
            )

            const movedTask: Task = {
                ...task,
                date: toDate,
            }

            toDayTasks.splice(action.payload.newOrder, 0, movedTask)

            const normalizedFrom = fromDayTasks.map((t, index) => ({
                ...t,
                order: index,
            }))

            const normalizedTo = toDayTasks.map((t, index) => ({
                ...t,
                order: index,
            }))

            return [...otherTasks, ...normalizedFrom, ...normalizedTo]
        }

        default:
            return state
    }
}