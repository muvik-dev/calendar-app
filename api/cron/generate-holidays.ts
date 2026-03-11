import type { VercelRequest, VercelResponse } from "@vercel/node"
import { generateWorldwideHolidays } from "../../server/src/service/HolidayService.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const year = new Date().getFullYear()

    try {
        const holidays = await generateWorldwideHolidays(year)
        const dateCount = Object.keys(holidays).length
        res.json({ year, dates: dateCount })
    } catch (e) {
        console.error("Cron holiday generation failed:", e)
        res.status(500).json({ error: "Failed to generate holidays" })
    }
}
