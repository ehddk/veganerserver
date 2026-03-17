import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

console.log("DB_HOST:", process.env.DB_HOST); // ← 추가
console.log("DB_USER:", process.env.DB_USER);

pool.on("connect", () => {
  console.log("Connected to the database");
});
pool.on("error", (err: any) => {
  console.error("Database connection error:", err);
});
