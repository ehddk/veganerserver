import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  ssl: { rejectUnauthorized: false }, //render는 ssl 필수
});

console.log("DB_HOST:", process.env.DB_HOST); // ← 추가
console.log("DB_USER:", process.env.DB_USER);

pool.on("connect", () => {
  console.log("Connected to the database");
});
pool.on("error", (err: any) => {
  console.error("Database connection error:", err);
});
