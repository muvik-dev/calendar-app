import { type Collection, MongoClient } from "mongodb"
import type { WorldwideHolidaysRecord, Holiday } from "../types/holiday.js"

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME ?? "calendar"

let client: MongoClient | null = null

async function collection(): Promise<Collection<WorldwideHolidaysRecord>> {
    if (!client) {
        client = new MongoClient(MONGODB_URI)
        await client.connect()
    }
    return client.db(DB_NAME).collection<WorldwideHolidaysRecord>("worldwide_holidays")
}

export async function findByYear(year: number): Promise<Record<string, Holiday[]> | null> {
    const coll = await collection()
    const doc = await coll.findOne({ year })
    return doc?.holidays ?? null
}

export async function upsert(year: number, holidays: Record<string, Holiday[]>): Promise<void> {
    const coll = await collection()
    await coll.updateOne(
        { year },
        { $set: { year, holidays, updatedAt: Date.now() } },
        { upsert: true }
    )
}
