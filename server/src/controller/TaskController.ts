import { Router, type Request, type Response } from "express"
import { getAllTasks, createTask, updateTask, deleteTask } from "../service/TaskService.js"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
    try {
        const tasks = await getAllTasks(req.query.date as string | undefined)
        res.json(tasks)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Failed to list tasks" })
    }
})

router.post("/", async (req: Request, res: Response) => {
    try {
        const task = await createTask(req.body)
        res.status(201).json(task)
    } catch (e) {
        if (e instanceof Error && e.message.startsWith("VALIDATION")) {
            res.status(400).json({ error: e.message })
            return
        }
        console.error(e)
        res.status(500).json({ error: "Failed to create task" })
    }
})

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const task = await updateTask(req.params.id, req.body)
        res.json(task)
    } catch (e) {
        if (e instanceof Error && e.message === "NOT_FOUND") {
            res.status(404).json({ error: "Task not found" })
            return
        }
        if (e instanceof Error && e.message === "INVALID_UPDATE") {
            res.status(400).json({ error: "No valid fields to update" })
            return
        }
        console.error(e)
        res.status(500).json({ error: "Failed to update task" })
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await deleteTask(req.params.id)
        res.status(204).send()
    } catch (e) {
        if (e instanceof Error && e.message === "NOT_FOUND") {
            res.status(404).json({ error: "Task not found" })
            return
        }
        console.error(e)
        res.status(500).json({ error: "Failed to delete task" })
    }
})

export default router
