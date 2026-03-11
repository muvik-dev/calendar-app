import cors from "cors"
import express from "express"
import taskRouter from "./controller/TaskController.js"
import holidayRouter from "./controller/HolidayController.js"
import { initDb } from "./repository/TaskRepository.js"

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.use("/api/tasks", taskRouter)
app.use("/api/holidays", holidayRouter)

app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
})

initDb().catch((e) => console.error("Failed to init DB:", e))

export default app
