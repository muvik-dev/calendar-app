import "dotenv/config"
import cors from "cors"
import express from "express"
import taskRouter from "./routes/TaskRoute.js"
import { initDb } from "./repository/TaskRepository.js"

const PORT = Number(process.env.PORT ?? 3001)

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.use("/api/tasks", taskRouter)

app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
})

async function start() {
    try {
        await initDb()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

start()
