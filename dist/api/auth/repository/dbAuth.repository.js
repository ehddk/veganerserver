"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAuthRepository = void 0;
const database_1 = require("../../../config/database");
class DbAuthRepository {
    async findByEmail(email) {
        const query = `
       SELECT * FROM auth WHERE email = $1

      `;
        try {
            const result = await database_1.pool.query(query, [email]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("failed", error);
            throw new Error("쿼리 실행 중 오류 발생!");
        }
    }
    async save(auth) {
        const query = `
        INSERT INTO auth (name,email,password,salt)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const result = await database_1.pool.query(query, [
            auth.name,
            auth.email,
            auth.password,
            auth.salt,
        ]);
        return result.rows[0];
    }
    async findAll() {
        // 1. 데이터 목록을 가져오는 쿼리
        // $1, $2는 매개변수 배열의 인덱스를 나타냅니다.
        const query = `
          SELECT * FROM auth 
          ORDER BY "createdAt" DESC 
         
      `;
        try {
            const result = await database_1.pool.query(query);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("failed", error);
            throw new Error("쿼리 실행 중 오류 발생!");
        }
    }
    async findById(id) {
        const query = `
          SELECT * FROM auth WHERE id = $1
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
    async update(id, authInfo) {
        // 1. 업데이트할 필드만 추출 (undefined/null 값 제외)
        const fields = Object.keys(authInfo).filter((key) => authInfo[key] !== undefined);
        if (fields.length === 0) {
            const currentData = await this.findById(id);
            if (currentData)
                return currentData;
            throw new Error(`ID ${id}를 가진 사용자를 찾을 수 없습니다.`);
        }
        //$1은 항상 ID에 사용되므로, 필드 값은 $2부터 시작.
        const setClauses = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const values = fields.map((field) => authInfo[field]);
        const query = `
    UPDATE auth SET ${setClauses} WHERE id = $1 RETURNING *
    `;
        try {
            const result = await database_1.pool.query(query, [id, ...values]);
            if (result.rows.length === 0) {
                throw new Error(`ID ${id}를 가진 사용자를 업데이트할 수 없습니다.`);
            }
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("에러 객체:", error);
            throw error;
        }
    }
    async delete(id) {
        const query = `DELETE FROM auth WHERE id=$1`;
        await database_1.pool.query(query, [id]);
    }
}
exports.DbAuthRepository = DbAuthRepository;
//# sourceMappingURL=dbAuth.repository.js.map