import { Pool } from "pg";
import { ScrapRepository } from "./scrap.repository";
import { PaginatedScraps } from "../@types/scrap.type";

export class DbScrapRepository implements ScrapRepository {
  private readonly pool: Pool;

  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async toggle(
    userId: string,
    restaurantId: number
  ): Promise<{ scrapped: boolean }> {
    if (isNaN(restaurantId)) {
      throw new Error("유효하지 않은 식당 ID 형식입니다.");
    }

    try {
      const exists = await this.pool.query(
        `SELECT 1 FROM scrap WHERE user_id = $1 AND restaurant_id = $2`,
        [userId, restaurantId]
      );

      if ((exists.rowCount ?? 0) > 0) {
        await this.pool.query(
          `DELETE FROM scrap WHERE user_id = $1 AND restaurant_id = $2`,
          [userId, restaurantId]
        );
        return { scrapped: false };
      }

      await this.pool.query(
        `INSERT INTO scrap (user_id, restaurant_id) VALUES ($1, $2)`,
        [userId, restaurantId]
      );
      return { scrapped: true };
    } catch (error) {
      console.error("DB Error in scrap.toggle:", error);
      throw new Error("스크랩 토글 중 데이터베이스 오류 발생");
    }
  }

  async findByUser(
    userId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedScraps> {
    const itemsQuery = `
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
        s.created_at AS scrapped_at
      FROM scrap s
      INNER JOIN restaurants r ON r.id = s.restaurant_id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const totalQuery = `
      SELECT COUNT(*) FROM scrap WHERE user_id = $1
    `;

    try {
      const [itemsResult, totalResult] = await Promise.all([
        this.pool.query(itemsQuery, [userId, limit, offset]),
        this.pool.query(totalQuery, [userId]),
      ]);

      return {
        items: itemsResult.rows,
        total: parseInt(totalResult.rows[0].count, 10),
      };
    } catch (error) {
      console.error("DB Error in scrap.findByUser:", error);
      throw new Error("스크랩 목록 조회 중 데이터베이스 오류 발생");
    }
  }

  async isScrappedBy(userId: string, restaurantId: number): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT 1 FROM scrap WHERE user_id = $1 AND restaurant_id = $2 LIMIT 1`,
      [userId, restaurantId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
