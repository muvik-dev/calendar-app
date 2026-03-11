import "dotenv/config"
import app from "./app.js"
import { ensureCurrentYear } from "./service/HolidayService.js"

const PORT = Number(process.env.PORT ?? 3001)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

ensureCurrentYear().catch((e) =>
    console.error("Failed to load worldwide holidays:", e)
)
