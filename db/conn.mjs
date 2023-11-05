import { MongoClient } from "mongodb";

const dbName =  process.env.DB_NAME || "";
const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);
let conn;

try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
const db = client.db(dbName);
export default db;
