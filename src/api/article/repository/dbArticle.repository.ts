import { IArticle } from "../@types/article.type";
import { ArticleRepository } from "./article.repository";
import { pool } from "../../../config/database";

export class DbArticleRepository implements ArticleRepository {
  async save(article: Omit<IArticle, "id">): Promise<IArticle> {
    const query = `
            INSERT INTO board (title, content, author,author_id)
        VALUES ($1, $2, $3, $4)
            RETURNING *
          `;

    const result = await pool.query(query, [
      article.title,
      article.content,

      article.author,
      article.author_id,
    ]);
    console.log("🔍 INSERT 데이터:", result);

    return result.rows[0];
    // createdAt: new Date(),
  }

  async findAll(): Promise<IArticle[]> {
    const query = `SELECT * FROM board`;

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<IArticle | null> {
    const query = `SELECT id,title,content,author,created_at as "createdAt",updatedAt,view_count FROM board WHERE id = $1`;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(
    id: string,
    article: Partial<Omit<IArticle, "id" | "createdAt" | "author_id">>
  ): Promise<IArticle | null> {
    if (Object.keys(article).length === 0)
      throw new Error("수정할 항목이 없습니다.");

    const keys = Object.keys(article);
    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = [...keys.map((k) => (article as any)[k]), id];

    const query = `UPDATE board SET ${setClause} WHERE id = $${keys.length + 1}
      RETURNING id,title,content,author,created_at as "createdAt"
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM board WHERE id=$1`;

    await pool.query(query, [id]);
  }
}
