import { MongoClient } from "mongodb";


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db("mydb");

export async function DELETE(req) {
  try {
    const body = await req.json();
    const name = body?.name;

    if (!name) {
      return new Response(JSON.stringify({ success: false, message: "Имя не указано" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.collection("entries").deleteOne({ name });

    return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Ошибка при удалении:", err);
    return new Response(JSON.stringify({ success: false, message: "Ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

