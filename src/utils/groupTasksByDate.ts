import type {Task} from "../../lib/task-types.ts";

export function groupTasksByDate(tasks: Task[]) {
    const map = new Map<string, Task[]>()

    for (const task of tasks) {
        if (!map.has(task.date)) {
            map.set(task.date, [])
        }
        map.get(task.date)!.push(task)
    }

    for (const [, value] of map) {
        value.sort((a, b) => a.order - b.order)
    }

    return map
}