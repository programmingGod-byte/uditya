import { MongoClient } from "mongodb"
import { NextResponse } from "next/server"

const mongoUri = "mongodb://localhost:27017/testdb"

if (!mongoUri) {
  throw new Error("MONGODB_URI environment variable is not set")
}

let cachedClient: MongoClient | null = null

async function getMongoClient() {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = new MongoClient(mongoUri)
  await cachedClient.connect()
  return cachedClient
}

export async function GET() {
  try {
    const client = await getMongoClient()
    const db = client.db("testdb")
    const collection = db.collection("data")

    // Retrieve all data
    const data = await collection.find({}).toArray()

    return NextResponse.json(
      {
        count: data.length,
        data: data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
