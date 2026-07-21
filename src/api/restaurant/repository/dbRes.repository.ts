import "dotenv/config";
import { pool } from "@/config/database";
import { RestuarantRepository } from "./res.repository";
import { Pool } from "pg";
const { createClient } = require("@supabase/supabase-js");

export class DbRestaurantRepository implements RestuarantRepository {
  private readonly pool: Pool;
  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async saveImages(id: string, imageUrls: string[]) {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const uploadedUrls: string[] = [];

    for (const imageUrl of imageUrls) {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            Referer: new URL(imageUrl).origin,
          },
        });

        const contentType = response.headers.get("Content-Type") ?? "";
        console.log("contentType:", contentType, response.ok);
        if (!response.ok || contentType.includes("text/html")) continue;

        const buffer = await response.arrayBuffer();
        const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
        const path = `restaurants/${id}_${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("restaurant-image")
          .upload(path, buffer, { contentType, upsert: true });

        if (error) continue;

        const {
          data: { publicUrl },
        } = supabase.storage.from("restaurant-image").getPublicUrl(path);

        uploadedUrls.push(publicUrl);
      } catch (e) {
        console.error(`이미지 업로드 실패: ${imageUrl}`, e);
      }
    }

    // 업로드된 URL이 없으면 DB 업데이트 안 함
    if (uploadedUrls.length === 0) return;

    await this.pool.query(
      `UPDATE restaurants SET image_url = $1 WHERE id = $2`,
      [uploadedUrls, Number(id)]
    );
  }
  async save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant> {
    const query = `
         INSERT INTO restaurants (upso_name,rdn_code,source_type,ctfc_gbn_name,cgg_code_name,tel_no,category,latitude,longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING *
        `;

    const result = await this.pool.query(query, [
      restaurant.upso_name,
      restaurant.rdn_code,
      restaurant.source_type,
      restaurant.ctfc_gbn_name,
      restaurant.cgg_code_name,
      restaurant.tel_no,
      restaurant.category,
      restaurant.latitude,
      restaurant.longitude,
    ]);
    return result.rows[0];
  }

  async saveBatch(restaurant: IRestaurant[]): Promise<void> {
    if (restaurant.length === 0) return;

    const columns = [
      "upso_name",
      "rdn_code",
      "source_id",
      "category",
      "latitude",
      "longitude",
      "source_type",
      "ctfc_gbn_name",
      "cgg_code_name",
      "tel_no",
    ];
    let values: any[] = [];
    let valueStrings: string[] = []; //

    restaurant.forEach((r, index) => {
      const start = index * columns.length + 1;
      values.push(
        r.upso_name,
        r.rdn_code,
        r.source_id,
        r.category,
        r.latitude,
        r.longitude,
        r.source_type,
        r.ctfc_gbn_name,
        r.cgg_code_name,
        r.tel_no
      ),
        valueStrings.push(
          `(${columns.map((_, i) => `$${start + i}`).join(", ")})`
        );
    });
    const query = `
    INSERT INTO restaurants (${columns.join(", ")})
    VALUES ${valueStrings.join(", ")}
    ON CONFLICT (source_id) DO UPDATE SET
    upso_name = EXCLUDED.upso_name,
    rdn_code=EXCLUDED.rdn_code,
     category=EXCLUDED.category,
    latitude=EXCLUDED.latitude,
    longitude=EXCLUDED.longitude,
    ctfc_gbn_name=EXCLUDED.ctfc_gbn_name,
    cgg_code_name=EXCLUDED.cgg_code_name,
    tel_no=EXCLUDED.tel_no
    `;

    try {
      await this.pool.query(query, values);
      console.log(`Successfully batch upserted ${restaurant.length} records.`);
    } catch (error) {
      console.error("Database Batch Upsert error:", error);
      throw new Error("Failed to save batch restaurant data.");
    }
  }

  async findAll(): Promise<IRestaurant[]> {
    // 공식 채식음식점 + 사용자가 직접 등록한 식당(source_type='USER')을 함께 노출
    const itemsQuery = ` SELECT *, image_url FROM restaurants WHERE ctfc_gbn_name = '채식음식점' OR source_type = 'USER'`;

    const itemResult = await this.pool.query(itemsQuery, []);

    return itemResult.rows;
  }

  async findById(id: string, currentUserId?: string): Promise<IRestaurant> {
    const query = `
        SELECT
         r.id,
         r.upso_name,
         r.rdn_code,
         r.source_type,
         r.category,
         r.ctfc_gbn_name,
         r.cgg_code_name,
         r.tel_no,
         r.image_url,
         r.latitude,
         r.longitude,
         CASE
           WHEN $2::uuid IS NULL THEN false
           ELSE EXISTS (
             SELECT 1 FROM scrap
             WHERE scrap.restaurant_id = r.id
               AND scrap.user_id = $2::uuid
           )
         END AS scrapped_by_me
        FROM restaurants r
        WHERE r.id = $1
    `;

    try {
      const result = await this.pool.query(query, [id, currentUserId ?? null]);
      return result.rows[0];
    } catch (error) {
      console.error("failed", error);
      throw new Error("쿼리 실행 중 오류 발생!");
    }
  }
}
