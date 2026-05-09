import { Pool } from "pg";
import dotenv from "dotenv";
import { DbRestaurantRepository } from "../src/api/restaurant/repository/dbRes.repository";
import { ResServicesImpl } from "../src/api/restaurant/service/res.service";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PASSWORD loaded (should be 9147):", process.env.DB_PASSWORD);
// const dbPool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || "5432"),
//   ssl: { rejectUnauthorized: false },
// });
const dbPool = new Pool({
  connectionString:
    "postgresql://postgres.slylgxgwbajzsgcolkzk:veganer1120!@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000, // ✅ 추가
  idleTimeoutMillis: 60000, // ✅ 추가
  max: 5,
});

async function runDataCollection() {
  console.log("--- 🍽️ OpenAPI 데이터 수집 및 DB 적재 시작 ---");

  try {
    // 1. Repository 인스턴스 생성 (DB 연결 주입)
    const repository = new DbRestaurantRepository(dbPool);

    // 2. Service 인스턴스 생성 (Repository 주입)
    // 🚨 Service는 환경 변수 process.env.OPEN_API_KEY를 자동으로 가져옵니다.
    const service = new ResServicesImpl(repository);

    // 3. 🚀 핵심 함수 호출
    await service.saveAllOpenData();

    console.log("--- ✅ 데이터 적재 완료. PostgreSQL 확인 ---");
  } catch (error) {
    console.error("--- ❌ 데이터 적재 중 치명적인 오류 발생 ---", error);
    process.exit(1); // 오류 발생 시 스크립트 종료
  } finally {
    // 4. DB 연결 풀 종료
    await dbPool.end();
    console.log("DB 연결 종료.");
  }
}

// 스크립트 실행
runDataCollection();
