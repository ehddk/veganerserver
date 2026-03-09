"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbArticleRepository = void 0;
const database_1 = require("../../../config/database");
class DbArticleRepository {
    async save(article) {
        const query = `
            INSERT INTO board (title, content,author,author_id)
        VALUES ($1, $2, $3, $4)
            RETURNING *
          `;
        const result = await database_1.pool.query(query, [
            article.title,
            article.content,
            article.author,
            article.author_id,
        ]);
        console.log("🔍 INSERT 데이터:", result);
        return result.rows[0];
        // createdAt: new Date(),
    }
    async findAll(limit, offset) {
        // 1. 데이터 목록을 가져오는 쿼리
        // $1, $2는 매개변수 배열의 인덱스를 나타냅니다.
        const itemsQuery = `
        SELECT * FROM board 
        ORDER BY "createdAt" DESC 
        LIMIT $1 
        OFFSET $2
    `;
        // 2. 전체 항목 개수(Total)를 가져오는 쿼리 (필터 조건이 없다면 단순 COUNT)
        const totalQuery = `
        SELECT COUNT(*) 
        FROM board
    `;
        // 3. 두 쿼리 실행 (Promise.all로 동시에 실행하여 성능 개선)
        const [itemsResult, totalResult] = await Promise.all([
            // itemsQuery: [limit, offset] 순서로 값 바인딩
            database_1.pool.query(itemsQuery, [limit, offset]),
            // totalQuery: 매개변수 없음
            database_1.pool.query(totalQuery, []),
        ]);
        const totalCount = parseInt(totalResult.rows[0].count, 10);
        return {
            items: itemsResult.rows,
            total: totalCount,
        };
    }
    async findById(id) {
        await database_1.pool.query(`UPDATE board SET view_count = view_count + 1 WHERE id = $1`, [id]);
        const query = `
    SELECT 
        id,
        title,
        content,
        TRIM(author) as author,
        "createdAt",
        "updatedAt",
        view_count as "viewCount"
    FROM 
        board 
    WHERE 
        id = $1
`;
        try {
            const result = await database_1.pool.query(query, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("failed", error);
            throw new Error("쿼리 실행 중 오류 발생!");
        }
    }
    async update(id, article) {
        if (Object.keys(article).length === 0)
            throw new Error("수정할 항목이 없습니다.");
        const keys = Object.keys(article);
        const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
        const values = [...keys.map((k) => article[k]), id];
        const query = `UPDATE board SET ${setClause}, "updatedAt" = NOW() 
    WHERE id = $${keys.length + 1}::integer
    RETURNING id, title, content, author, "createdAt", "updatedAt"
  `;
        try {
            const result = await database_1.pool.query(query, values);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("❌ 쿼리 실행 에러 발생!");
            console.error("에러 객체:", error);
            throw error;
        }
    }
    async delete(id) {
        const query = `DELETE FROM board WHERE id=$1`;
        await database_1.pool.query(query, [id]);
    }
}
exports.DbArticleRepository = DbArticleRepository;
//# sourceMappingURL=dbArticle.repository.js.map