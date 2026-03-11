import { type Collection, MongoClient, type ObjectId, type WithId } from "mongodb"
import type { Task } from "../types/task.js"

interface TaskDocument extends Task {
    _id?: ObjectId
}

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME ?? "calendar"

let client: MongoClient | null = null

async function collection(): Promise<Collection<TaskDocument>> {
    if (!client) {
        client = new MongoClient(MONGODB_URI)
        await client.connect()
    }
    return client.db(DB_NAME).collection<TaskDocument>("tasks")
}

export async function initDb(): Promise<void> {
    const coll = await collection()
    await coll.createIndex({ date: 1, order: 1 })
}

function toTask(doc: WithId<TaskDocument>): Task {
    return {
        id: doc.id,
        title: doc.title,
        date: doc.date,
        order: doc.order,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    }
}

export async function findAll(date?: string): Promise<Task[]> {
    const coll = await collection()
    const filter = date ? { date } : {}
    const docs = await coll.find(filter).sort({ date: 1, order: 1 }).toArray()
    return docs.map(toTask)
}

export async function findById(id: string): Promise<Task | null> {
    const coll = await collection()
    const doc = await coll.findOne({ id })
    return doc ? toTask(doc) : null
}

export async function insert(task: Task): Promise<void> {
    const coll = await collection()
    await coll.insertOne(task as TaskDocument)
}

export async function update(id: string, fields: Partial<Task>): Promise<void> {
    const coll = await collection()
    await coll.updateOne({ id }, { $set: fields })
}

export async function remove(id: string): Promise<void> {
    const coll = await collection()
    await coll.deleteOne({ id })
}

export async function normalizeOrders(date: string): Promise<void> {
    const coll = await collection()
    const docs = await coll.find({ date }).sort({ order: 1 }).toArray()

    await Promise.all(
        docs.map((doc, i) =>
            coll.updateOne({ id: doc.id }, { $set: { order: i, updatedAt: Date.now() } })
        )
    )
}
