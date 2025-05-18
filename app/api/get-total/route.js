import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


export async function GET() {
  if (!client.topology || !client.topology.isConnected?.()) {
    await client.connect();
  }
  const db = client.db("mydb");
  const data = await db.collection("totals").findOne({ _id: "main" });
  
  return Response.json({ total: data?.total || 0 });
}
