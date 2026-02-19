import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 기존 PostgreSQL 연결 문자열
  ssl: {
    rejectUnauthorized: false, // SSL 인증서 검증 비활성화 (필요한 경우) Render 자체 서명 인증서 허용
  },
});

async function migrateImages() {
  const { rows } = await pool.query(
    `SELECT id, image_url FROM restaurants WHERE image_url::text LIKE '%http%' AND image_url::text NOT LIKE '%supabase.co%'`
  );

  for (const record of rows) {
    try {
      const response = await fetch(record.image_url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Referer: new URL(record.image_url).origin,
        },
      });

      const contentType = response.headers.get("Content-Type") ?? "";

      if (!response.ok || contentType.includes("text/html")) {
        console.log(`⚠️ 스킵 (핫링크 차단): ${record.id}`);
        continue;
      }

      const buffer = await response.arrayBuffer();
      const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
      const path = `restaurants/${record.id}.${ext}`;

      // Supabase Storage 업로드
      const { error } = await supabase.storage
        .from("restaurant-image")
        .upload(path, buffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.log(`❌ 업로드 실패: ${record.id} - ${error.message}`);
        continue;
      }

      // 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("restaurant-image").getPublicUrl(path);

      // 기존 PostgreSQL DB 업데이트
      await pool.query(
        "UPDATE restaurants SET image_url = ARRAY[$1] WHERE id = $2",
        [publicUrl, record.id]
      );

      console.log(`✅ 완료: ${record.id}`);
    } catch (e) {
      console.log(`❌ 에러: ${record.id}`, e);
    }
  }

  await pool.end();
  console.log("마이그레이션 완료!");
}

migrateImages();
