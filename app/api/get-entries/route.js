import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db("mydb");

export async function GET() {
  try {
    const entries = await db.collection("entries").find().toArray();
    return Response.json(entries);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
