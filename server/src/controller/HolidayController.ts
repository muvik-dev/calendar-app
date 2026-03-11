import { Router, type Request, type Response } from "express"
import { getWorldwideHolidays } from "../service/HolidayService.js"

const router = Router()

router.get("/worldwide", async (req: Request, res: Response) => {
    try {
        const year = Number(req.query.year) || new Date().getFullYear()
        const holidays = await getWorldwideHolidays(year)
        res.json(holidays)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Failed to load worldwide holidays" })
    }
})

export default router
