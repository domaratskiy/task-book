import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const db = client.db("mydb");
  const { name, weight, boxes } = await req.json();

  if (!name) {
    return Response.json({ success: false, message: "Имя не может быть пустым" }, { status: 400 });
  }

  const boxWeight = 1.8;
  const adjustedWeight = Number((weight - (boxWeight * boxes)).toFixed(1));

  await client.connect();

  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;

  const newWeightEntry = {
    value: adjustedWeight,
    date: formattedDate,
  };



  await db.collection("entries").updateOne(
    { name },
    {
      $push: {
        weights: newWeightEntry,
        boxes: boxes
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}
