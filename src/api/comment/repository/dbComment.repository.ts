import { CommentRepository } from "./comment.repository";
import { pool } from "../../../config/database";
import { IComment } from "../@types/comment.api";

export class DbCommentRepository implements CommentRepository {
  async save(comment: Omit<IComment, "id">): Promise<IComment> {
    const query = `
            INSERT INTO comments (content, author,author_id)
        VALUES ($1, $2, $3, $4)
            RETURNING *
          `;

    const result = await pool.query(query, [
      comment.content,
      comment.author,
      comment.author_id,
    ]);
    console.log("🔍 INSERT 데이터:", result);

    return result.rows[0];
    // createdAt: new Date(),
  }

  async findAll(): Promise<IComment[]> {
    const query = `SELECT * FROM comments`;

    const result = await pool.query(query);
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
