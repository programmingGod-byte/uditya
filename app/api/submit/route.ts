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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { speed, angle } = body

    // Validate input
    if (speed === undefined || angle === undefined) {
      return NextResponse.json({ error: "Speed and angle are required" }, { status: 400 })
    }

    if (isNaN(speed) || isNaN(angle)) {
      return NextResponse.json({ error: "Speed and angle must be valid numbers" }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db("testdb")
    const collection = db.collection("data")

    // Insert the data
    const result = await collection.insertOne({
      speed,
      angle,
      timestamp: new Date(),
    })

    return NextResponse.json(
      {
        message: "Data submitted successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
