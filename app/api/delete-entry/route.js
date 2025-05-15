import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db("mydb");

export async function DELETE(req) {
  try {
    if (req.method !== "DELETE") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return Response.json({ success: false, message: "Неверный тип контента" }, { status: 400 });
    }

    const body = await req.json();

    if (!body?.name) {
      return Response.json({ success: false, message: "Имя не указано" }, { status: 400 });
    }

    const result = await db.collection("entries").deleteOne({ name: body.name });

    return Response.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Ошибка при удалении:", err);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
