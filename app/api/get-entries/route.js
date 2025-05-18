import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


export async function GET() {
  try {

    if (!client.topology || !client.topology.isConnected?.()) {
      await client.connect();
    }

    const db = client.db("mydb");

    const entries = await db.collection("entries").find().toArray();



    return Response.json(entries);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
