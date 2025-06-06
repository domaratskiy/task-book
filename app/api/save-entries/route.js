import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let isConnected = false;

export async function POST(req) {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  const db = client.db("mydb");
  const { name, weight, boxes } = await req.json();

  if (!name) {
    return Response.json({ success: false, message: "Имя не может быть пустым" }, { status: 400 });
  }

  const boxWeight = 1.8;
  const adjustedWeight = Number((weight - (boxWeight * boxes)).toFixed(1));

  await db.collection("entries").updateOne(
    { name },
    {
      $push: {
        weights: adjustedWeight,
        boxes: boxes
      },
      $setOnInsert: {
        createdAt: new Date()
        // ❌ НЕ добавляем weights: [], boxes: [] — иначе будет конфликт
      }
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}
