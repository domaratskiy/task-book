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
  const { name } = await req.json();

  if (!name) {
    return Response.json({ success: false, message: "Имя не указано" }, { status: 400 });
  }

  const collection = db.collection("entries");

  const user = await collection.findOne({ name });

  if (!user || !user.weights || user.weights.length === 0) {
    return Response.json({ success: false, message: "Нет данных для удаления" }, { status: 404 });
  }

  // Удалить последний элемент
  user.weights.pop();
  user.boxes.pop();

  // Подсчитать итоговый вес
  const totalWeight = user.weights.reduce((a, b) => a + b.value, 0);

  if (totalWeight === 0 || user.weights.length === 0) {
    // Если ничего не осталось — удалить запись
    await collection.deleteOne({ name });
    return Response.json({ success: true, message: "Сотрудник удалён, вес = 0" });
  }

  // Иначе обновить записи
  await collection.updateOne(
    { name },
    {
      $set: {
        weights: user.weights,
        boxes: user.boxes
      }
    }
  );

  return Response.json({ success: true });
}
