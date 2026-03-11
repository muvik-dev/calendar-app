import type { Task } from "../types/task.js"
import * as repo from "../repository/TaskRepository.js"

export async function getAllTasks(date?: string): Promise<Task[]> {
    return repo.findAll(date)
}

export async function createTask(input: {
    title?: string
    date?: string
    order?: number
}): Promise<Task> {
    const { title, date, order } = input

    if (typeof title !== "string" || !title.trim()) {
        throw new Error("VALIDATION: title is required")
    }

    if (typeof date !== "string" || !date) {
        throw new Error("VALIDATION: date is required")
    }

    const now = Date.now()
    const task: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        date,
        order: typeof order === "number" ? order : 0,
        createdAt: now,
        updatedAt: now,
    }

    await repo.insert(task)
    return task
}

export async function updateTask(
    id: string,
    body: { title?: string; date?: string; order?: number }
): Promise<Task> {
    const existing = await repo.findById(id)
    if (!existing) throw new Error("NOT_FOUND")

    const updates: Partial<Task> = { updatedAt: Date.now() }

    if (typeof body.title === "string") updates.title = body.title.trim()
    if (typeof body.date === "string") updates.date = body.date
    if (typeof body.order === "number" && Number.isInteger(body.order)) updates.order = body.order

    if (Object.keys(updates).length <= 1) {
        throw new Error("INVALID_UPDATE")
    }

    await repo.update(id, updates)

    if (updates.date !== undefined || updates.order !== undefined) {
        await repo.normalizeOrders(existing.date)
        if (updates.date && updates.date !== existing.date) {
            await repo.normalizeOrders(updates.date)
        }
    }

    return (await repo.findById(id)) ?? { ...existing, ...updates }
}

export async function deleteTask(id: string): Promise<void> {
    const existing = await repo.findById(id)
    if (!existing) throw new Error("NOT_FOUND")

    await repo.remove(id)
    await repo.normalizeOrders(existing.date)
}
