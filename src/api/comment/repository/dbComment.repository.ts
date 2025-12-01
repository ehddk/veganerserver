import { CommentRepository } from "./comment.repository";
import { pool } from "../../../config/database";
import { IComment } from "../@types/comment.api";

export class DbCommentRepository implements CommentRepository {
  async save(
    comment: Omit<IComment, "id" | "createdAt" | "updatedAt">
  ): Promise<IComment> {
    const userQuery = `SELECT "name" FROM "auth" WHERE id = $1`;
    const userId = comment.user_id;
    let userName = "익명사용자";

    try {
      const userResult = await pool.query(userQuery, [userId]);

      if (userResult.rows[0]) {
        userName = userResult.rows[0]["name"];
      }
      console.log(`[Repo Debug] 조회된 userName: ${userName}`);
    } catch (error) {
      console.error(
        `[CommentRepo ERROR] Failed to fetch user name with query: "${userQuery}"`,
        error
      );
    }
    const query = `
      INSERT INTO comments (content,user_id, article_id, "user")
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `;

    try {
      // 🚨 최종 INSERT 쿼리 실행
      const result = await pool.query(query, [
        comment.content, // $1
        comment.user_id, // $2: user_id
        comment.article_id, // $3
        userName, // $4: "user" 컬럼에 저장될 이름
      ]);

      // console.log("🔍 INSERT 데이터:", result.rows[0].userName);

      return result.rows[0];
    } catch (insertError) {
      // 🚨 이 블록에서 실제 DB 에러(예: NOT NULL, FK 위반 등)를 포착하고 명확히 로깅합니다.
      console.error(
        "❌ [CommentRepo FINAL INSERT ERROR] 댓글 삽입 실패:",
        insertError
      );

      // 서비스 레이어로 에러를 다시 던져줍니다. (컨트롤러에서 500으로 잡을 것임)
      throw insertError;
    }
  }

  async findAll(article_id: string): Promise<IComment[]> {
    const aricleId = article_id;
    const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY "createdAt" DESC`;

    const result = await pool.query(query, [aricleId]);
    return result.rows;
  }

  async findById(id: string): Promise<IComment | null> {
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
        comments 
    WHERE 
        id = $1
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

  async update(
    id: string,
    comment: Partial<Omit<IComment, "id" | "createdAt" | "author_id">>
  ): Promise<IComment | null> {
    if (Object.keys(comment).length === 0)
      throw new Error("수정할 항목이 없습니다.");

    const keys = Object.keys(comment);
    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = [...keys.map((k) => (comment as any)[k]), id];

    const query = `UPDATE comments SET ${setClause} WHERE id = $${keys.length + 1}
      RETURNING id,title,content,author,created_at as "createdAt"
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM comments WHERE id=$1`;

    await pool.query(query, [id]);
  }
}
