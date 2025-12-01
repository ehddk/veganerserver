import { pool } from "@/config/database";

import { Pool } from "pg";
import { ReviewRepository } from "./review.repository";
import { PaginatedReviews } from "../@types/review.type";

const AUTH_NAME_COLUMN = "name";

export class DbReviewRepository implements ReviewRepository {
  private readonly pool: Pool;
  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async save(
    review: Omit<IReview, "id" | "createdAt" | "updatedAt">
  ): Promise<IReview> {
    const userId = review.user_id;
    let userName = "익명사용자";

    const userQuery = `SELECT "${AUTH_NAME_COLUMN}" FROM "auth" WHERE id = $1`;

    try {
      const userResult = await this.pool.query(userQuery, [userId]);

      // 이름이 조회되면 userName 업데이트
      if (userResult.rows[0]) {
        userName = userResult.rows[0][AUTH_NAME_COLUMN];
      }
    } catch (error) {
      // 🚨 쿼리 실패 시 (테이블/컬럼 이름 오류 등) 여기서 잡아서 로그 출력
      // 이 로그에 SQL 에러 메시지가 담겨 문제의 원인(틀린 테이블/컬럼 이름)을 알려줄 것입니다.
      console.error(
        `[ReviewRepo ERROR] Failed to fetch user name with query: "${userQuery}"`,
        error
      );
      // 에러가 발생해도 userName은 기본값인 '익명사용자'를 유지하고 계속 진행합니다.
    }
    // const userName = userResult.rows[0]
    //   ? userResult.rows[0]["name"]
    //   : "익명사용자";

    const query = `
      INSERT INTO review (user_id,restaurant_id,rating,content, "user" )
      VALUES ($1, $2, $3, $4, $5)
              RETURNING *
    `;

    const result = await this.pool.query(query, [
      review.user_id,
      review.restaurant_id,
      review.rating,
      review.content,
      userName,
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
    currentUserId: string,
    review: Partial<Omit<IReview, "id" | "createdAt" | "user_id">>
  ): Promise<IReview | null> {
    const keys = Object.keys(review);

    if (keys.length === 0) {
      // 업데이트할 내용이 없으면 아무 작업도 하지 않고 null 반환
      return null;
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = [...keys.map((k) => (review as any)[k]), id, currentUserId];
    const query = `UPDATE review SET ${setClause}, "updatedAt" = NOW()
     WHERE id = $${keys.length + 1}::integer AND user_id = $${keys.length + 2}
      RETURNING id, restaurant_id , rating, content, user_id, "user","createdAt", "updatedAt"
     `;
    try {
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        console.log(
          `[ReviewRepo] Update failed: Review ID ${id} not found or not owned by user ${currentUserId}`
        );
        return null;
      }
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
