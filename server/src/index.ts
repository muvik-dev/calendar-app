import "dotenv/config"
import cors from "cors"
import express from "express"
import taskRouter from "./controller/TaskController.js"
import holidayRouter from "./controller/HolidayController.js"
import { initDb } from "./repository/TaskRepository.js"
import { ensureCurrentYear } from "./service/HolidayService.js"

const PORT = Number(process.env.PORT ?? 3001)

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.use("/api/tasks", taskRouter)
app.use("/api/holidays", holidayRouter)

app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
})

async function start() {
    try {
        await initDb()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

        ensureCurrentYear().catch((e) =>
            console.error("Failed to load worldwide holidays:", e)
        )
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

start()
