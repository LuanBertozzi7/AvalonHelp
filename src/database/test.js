import "dotenv/config";
import { pool } from "./mysql.js";

async function test() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  console.log(rows);
  await pool.end();
}

test().catch(console.error);

