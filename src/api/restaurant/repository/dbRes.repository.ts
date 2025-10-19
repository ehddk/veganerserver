import { pool } from "@/config/database";
import { RestuarantRepository } from "./res.repository";
import { Pool } from "pg";

export class DbRestaurantRepository implements RestuarantRepository {
  private readonly pool: Pool;
  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant> {
    const query = `
         INSERT INTO restaurants (upso_name,rdn_code,rdn_detail_addr,source_type,ctfc_gbn_name)
         VALUES ($1, $2, $3, $4)
                 RETURNING *
        `;

    const result = await this.pool.query(query, [
      restaurant.upso_name,
      restaurant.rdn_code,
      restaurant.rdn_detail_addr,
      restaurant.source_type,
      restaurant.ctfc_gbn_name,
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
      "rdn_detail_addr",
      "source_type",
      "ctfc_gbn_name",
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
        r.rdn_detail_addr,
        r.source_type,
        r.ctfc_gbn_name
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
    rdn_detail_addr=EXCLUDED.rdn_detail_addr,
    ctfc_gbn_name=EXCLUDED.ctfc_gbn_name
    `;

    try {
      await pool.query(query, values);
      console.log(`Successfully batch upserted ${restaurant.length} records.`);
    } catch (error) {
      console.error("Database Batch Upsert error:", error);
      throw new Error("Failed to save batch restaurant data.");
    }
  }

  async findAll(): Promise<IRestaurant[]> {
    const itemsQuery = ` SELECT * FROM restaurants`;

    const itemResult = await this.pool.query(itemsQuery, []);
    console.log("tie", itemResult);
    return itemResult.rows;
  }

  async findById(id: string): Promise<IRestaurant> {
    const query = `
        SELECT 
         id,
         upso_name,rdn_code,rdn_detail_addr,source_type
        FROM
         restaurants
        WHERE id = $1
         
    `;

    try {
      const result = await this.pool.query(query, [id]);
      console.log("[Repo Debug] Query executed. Row Count:", result.rowCount);
      return result.rows[0];
    } catch (error) {
      console.error("failed", error);
      throw new Error("쿼리 실행 중 오류 발생!");
    }
  }
}
