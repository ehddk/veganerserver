import { pool } from "@/config/database";
import { RestuarantRepository } from "./res.repository";

export class DbRestaurantRepository implements RestuarantRepository {
  async save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant> {
    const query = `
         INSERT INTO restaurant (upsoName,rdnCode,rdnDetailAddr,source_type)
         VALUES ($1, $2, $3, $4)
                 RETURNING *
        `;

    const result = await pool.query(query, [
      restaurant.upsoName,
      restaurant.rdnCode,
      restaurant.rdnDetailAddr,
      restaurant.source_type,
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<IRestaurant> {
    const itemsQuery = ` SELECT * FROM restaurant.restaurant`;

    const itemResult = await pool.query(itemsQuery, []);

    return itemResult.rows[0];
  }

  async findById(id: string): Promise<IRestaurant> {
    const query = `
        SELECT 
         id,
         upsoName,rdnCode,rdnDetailAddr,source_type
        FROM
         restaurant.restaurant
        WHERE id = $1
         
    `;

    try {
      const result = await pool.query(query, [id]);
      console.log("[Repo Debug] Query executed. Row Count:", result.rowCount);
      return result.rows[0] || null;
    } catch (error) {
      console.error("failed", error);
      throw new Error("쿼리 실행 중 오류 발생!");
    }
  }
}
