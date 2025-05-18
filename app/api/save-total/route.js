import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


export async function POST(req) {
  const db = client.db("mydb");

  const { total } = await req.json();

  await db.collection("totals").updateOne(
    { _id: "main" }, // фиксированный ключ
    {
      $set: {
        total,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}
