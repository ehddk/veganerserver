"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbReviewRepository = void 0;
const AUTH_NAME_COLUMN = "name";
class DbReviewRepository {
    pool;
    constructor(dbPool) {
        this.pool = dbPool;
    }
    async save(review) {
        const query = `INSERT INTO review (user_id,restaurant_id,rating,content,"user",image)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const result = await this.pool.query(query, [
            review.user_id,
            review.restaurant_id,
            review.rating,
            review.content,
            review.user,
            review.image,
        ]);
        return result.rows[0];
    }
    async findAll(restaurant_id, limit, offset) {
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
        }
        catch (error) {
            console.error("DB Error in findAll:", error);
            throw new Error("리뷰 목록 조회 중 데이터베이스 오류 발생");
        }
    }
    async update(id, currentUserId, review) {
        const keys = Object.keys(review);
        if (keys.length === 0) {
            // 업데이트할 내용이 없으면 아무 작업도 하지 않고 null 반환
            return null;
        }
        const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
        const values = [...keys.map((k) => review[k]), id, currentUserId];
        const query = `UPDATE review SET ${setClause}, "updatedAt" = NOW()
     WHERE id = $${keys.length + 1}::integer AND user_id = $${keys.length + 2}
      RETURNING id, restaurant_id , rating, content, user_id, "user","createdAt", "updatedAt",image
     `;
        try {
            const result = await this.pool.query(query, values);
            if (result.rowCount === 0) {
                console.log(`[ReviewRepo] Update failed: Review ID ${id} not found or not owned by user ${currentUserId}`);
                return null;
            }
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
    }
    async delete(id) {
        const query = `DELETE FROM review WHERE id=$1`;
        await this.pool.query(query, [id]);
    }
}
exports.DbReviewRepository = DbReviewRepository;
//# sourceMappingURL=dbReview.repository.js.map