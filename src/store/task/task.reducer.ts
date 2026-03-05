import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from './task.actions'

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

        case "MOVE_TASK":
            return state.map((t) =>
                t.id === action.payload.id
                    ? {
                        ...t,
                        date: action.payload.toDate,
                        order: action.payload.newOrder,
                        updatedAt: Date.now(),
                    }
                    : t
            )

        case "REORDER_TASK":
            return state.map((t) =>
                t.id === action.payload.id
                    ? {
                        ...t,
                        order: action.payload.newOrder,
                        updatedAt: Date.now(),
                    }
                    : t
            )

        default:
            return state
    }
}