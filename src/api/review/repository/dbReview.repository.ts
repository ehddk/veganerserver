import { pool } from "@/config/database";

import { Pool } from "pg";
import { ReviewRepository } from "./review.repository";
import { PaginatedReviews } from "../@types/review.type";

export class DbReviewRepository implements ReviewRepository {
  private readonly pool: Pool;
  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async save(
    review: Omit<IReview, "id" | "createdAt" | "updatedAt">
  ): Promise<IReview> {
    const query = `
      INSERT INTO review (user_id,restaurant_id,rating,content)
      VALUES ($1, $2, $3, $4)
              RETURNING *
    `;

    const result = await this.pool.query(query, [
      review.user_id,
      review.restaurant_id,
      review.rating,
      review.content,
    ]);
    return result.rows[0];
  }

  async findAll(
    restaurant_id: string,
    limit: number,
    offset: number
  ): Promise<PaginatedReviews> {
    const restaurantIdNumber = parseInt(restaurant_id, 10);
    if (isNaN(restaurantIdNumber)) {
      console.error(`Invalid restaurant_id received: ${restaurant_id}`);
      // 이 에러는 호출하는 서비스/컨트롤러에서 처리될 수 있도록 던져줍니다.
      throw new Error("유효하지 않은 식당 ID 형식입니다.");
    }
    console.log(
      `[Repository Debug] restaurantIdNumber: ${restaurantIdNumber}, Type: ${typeof restaurantIdNumber}`
    );

    const itemsQuery = `
        SELECT * FROM review
         WHERE restaurant_id = $1
        ORDER BY "createdAt" DESC 
        LIMIT $2
        OFFSET $3
    `;

    const totalQuery = `
    SELECT COUNT(*) 
    FROM review
    WHERE restaurant_id = $1
`;

    try {
      const [itemResult, totalResult] = await Promise.all([
        // ⭐️ this.pool 사용
        this.pool.query(itemsQuery, [restaurantIdNumber, limit, offset]),
        // ⭐️ this.pool 사용
        this.pool.query(totalQuery, [restaurant_id]),
      ]);

      const totalCount = parseInt(totalResult.rows[0].count, 10);
      console.log("total", totalCount); // ⚠️ 이 로그는 이제 this.pool이 작동하는지 확인하는 데 도움이 됩니다.

      return {
        items: itemResult.rows,
        total: totalCount,
      };
    } catch (error) {
      console.error("DB Error in findAll:", error);
      throw new Error("리뷰 목록 조회 중 데이터베이스 오류 발생");
    }
  }

  async update(
    id: string,
    review: Partial<Omit<IReview, "id" | "createdAt" | "user_id">>
  ): Promise<IReview | null> {
    const keys = Object.keys(review);

    if (keys.length === 0) {
      // 업데이트할 내용이 없으면 아무 작업도 하지 않고 null 반환
      return null;
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = [...keys.map((k) => (review as any)[k]), id];
    const query = `UPDATE review SET ${setClause}, "updatedAt" = NOW()
     WHERE id = $${keys.length + 1}::integer
      RETURNING id, restaurant_id , content, user_id, "createdAt", "updatedAt"
     `;
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    const query = `DELETE FROM review WHERE id=$1`;

    await this.pool.query(query, [id]);
  }
}
