import { AuthRepository } from "./auth.repository";
import { pool } from "../../../config/database";

export class DbAuthRepository implements AuthRepository {
  async save(auth: Omit<IAuth, "id">): Promise<IAuth> {
    const query = `
        INSERT INTO auth (name,email,password)
        VALUES ($1, $2, $3)
        RETURNING *
        `;

    const result = await pool.query(query, [
      auth.name,
      auth.email,
      auth.password,
    ]);

    console.log("resukt???", result);
    return result.rows[0];
  }

  async findAll(): Promise<IAuth> {
    // 1. 데이터 목록을 가져오는 쿼리
    // $1, $2는 매개변수 배열의 인덱스를 나타냅니다.

    const query = `
          SELECT * FROM auth 
          ORDER BY "createdAt" DESC 
         
      `;

    try {
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("failed", error);
      throw new Error("쿼리 실행 중 오류 발생!");
    }
  }

  async findById(id: string): Promise<IAuth | null> {
    const query = `
          SELECT * FROM auth WHERE id = $1
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
    authInfo: Partial<Omit<IAuth, "id" | "user_id">>
  ): Promise<IAuth> {
    // 1. 업데이트할 필드만 추출 (undefined/null 값 제외)
    const fields = Object.keys(authInfo).filter(
      (key) => authInfo[key as keyof typeof authInfo] !== undefined
    );

    if (fields.length === 0) {
      const currentData = await this.findById(id);
      if (currentData) return currentData;
      throw new Error(`ID ${id}를 가진 사용자를 찾을 수 없습니다.`);
    }
    //$1은 항상 ID에 사용되므로, 필드 값은 $2부터 시작.
    const setClauses = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    const values = fields.map(
      (field) => authInfo[field as keyof typeof authInfo]
    );
    const query = `
    UPDATE auth SET ${setClauses} WHERE id = $1 RETURNING *
    `;
    try {
      const result = await pool.query(query, [id, ...values]);
      if (result.rows.length === 0) {
        throw new Error(`ID ${id}를 가진 사용자를 업데이트할 수 없습니다.`);
      }

      return result.rows[0] || null;
    } catch (error) {
      console.error("에러 객체:", error);

      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    const query = `DELETE FROM auth WHERE id=$1`;

    await pool.query(query, [id]);
  }
}
