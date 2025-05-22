import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("mydb");
    console.log(db);
  }
  return db;
}

export async function GET() {
  try {
    const db = await connectDB();
    const entries = await db.collection("entries").find().toArray();

    return Response.json(entries);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return new Response(JSON.stringify({ success: false, message: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
