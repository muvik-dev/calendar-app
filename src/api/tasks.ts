import type { Task } from "@/domain/task/task.types"

const API_BASE = "http://localhost:3001"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options?.headers,
        },
    })

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
    }

    if (res.status === 204) {
        return undefined as T
    }

    return res.json()
}

export const taskApi = {
    list(): Promise<Task[]> {
        return request<Task[]>("/api/tasks")
    },

    create(body: { title: string; date: string; order?: number }): Promise<Task> {
        return request<Task>("/api/tasks", {
            method: "POST",
            body: JSON.stringify(body),
        })
    },

    update(
        id: string,
        body: { title?: string; date?: string; order?: number }
    ): Promise<Task> {
        return request<Task>(`/api/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        })
    },

    delete(id: string): Promise<void> {
        return request<void>(`/api/tasks/${id}`, {
            method: "DELETE"
        })
    },
}
