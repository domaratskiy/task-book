import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "myDatabase"; // Название вашей БД

export async function connectToDatabase() {
  if (!client.isConnected) await client.connect();
  const db = client.db(dbName);
  return { db, client };
}
