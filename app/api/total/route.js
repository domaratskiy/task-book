import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

// Подключение при первом запросе
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("mydb");
  }
  return db;
}

export async function GET() {
  try {
    const db = await connectDB();
    const data = await db.collection("totals").findOne({ _id: "main" });

    return Response.json({ total: data?.total || 0 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const { total } = await req.json();
    const db = await connectDB();

    await db.collection("totals").updateOne(
      { _id: "main" },
      {
        $set: {
          total,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
