import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db("mydb");

export async function DELETE(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return Response.json({ success: false, message: "Имя не указано" }, { status: 400 });
    }

    const result = await db.collection("entries").deleteOne({ name });

    return Response.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Ошибка при удалении:", err);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
