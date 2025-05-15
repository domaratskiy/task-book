import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db("mydb");

export async function GET() {
  const data = await db.collection("totals").findOne({ _id: "main" });
  return Response.json({ total: data?.total || 0 });
}
