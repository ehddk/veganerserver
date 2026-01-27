"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbRestaurantRepository = void 0;
const database_1 = require("@/config/database");
class DbRestaurantRepository {
    pool;
    constructor(dbPool) {
        this.pool = dbPool;
    }
    async save(restaurant) {
        const query = `
         INSERT INTO restaurants (upso_name,rdn_code,source_type,ctfc_gbn_name,cgg_code_name,tel_no)
         VALUES ($1, $2, $3, $4)
                 RETURNING *
        `;
        const result = await this.pool.query(query, [
            restaurant.upso_name,
            restaurant.rdn_code,
            restaurant.source_type,
            restaurant.ctfc_gbn_name,
            restaurant.cgg_code_name,
            restaurant.tel_no,
        ]);
        return result.rows[0];
    }
    async saveBatch(restaurant) {
        if (restaurant.length === 0)
            return;
        const columns = [
            "upso_name",
            "rdn_code",
            "source_id",
            "category",
            "latitude",
            "longitude",
            "source_type",
            "ctfc_gbn_name",
            "cgg_code_name",
            "tel_no",
        ];
        let values = [];
        let valueStrings = []; //
        restaurant.forEach((r, index) => {
            const start = index * columns.length + 1;
            values.push(r.upso_name, r.rdn_code, r.source_id, r.category, r.latitude, r.longitude, r.source_type, r.ctfc_gbn_name, r.cgg_code_name, r.tel_no),
                valueStrings.push(`(${columns.map((_, i) => `$${start + i}`).join(", ")})`);
        });
        const query = `
    INSERT INTO restaurants (${columns.join(", ")})
    VALUES ${valueStrings.join(", ")}
    ON CONFLICT (source_id) DO UPDATE SET
    upso_name = EXCLUDED.upso_name,
    rdn_code=EXCLUDED.rdn_code,
     category=EXCLUDED.category,
    latitude=EXCLUDED.latitude,
    longitude=EXCLUDED.longitude,
    ctfc_gbn_name=EXCLUDED.ctfc_gbn_name,
    cgg_code_name=EXCLUDED.cgg_code_name,
    tel_no=EXCLUDED.tel_no
    `;
        try {
            await database_1.pool.query(query, values);
            console.log(`Successfully batch upserted ${restaurant.length} records.`);
        }
        catch (error) {
            console.error("Database Batch Upsert error:", error);
            throw new Error("Failed to save batch restaurant data.");
        }
    }
    async findAll() {
        const itemsQuery = ` SELECT * FROM restaurants WHERE ctfc_gbn_name = '채식음식점';`;
        const itemResult = await this.pool.query(itemsQuery, []);
        return itemResult.rows;
    }
    async findById(id) {
        const query = `
        SELECT 
         id,
         upso_name,rdn_code,source_type,category,ctfc_gbn_name,cgg_code_name,tel_no
        FROM
         restaurants
        WHERE id = $1
         
    `;
        try {
            const result = await this.pool.query(query, [id]);
            // console.log("[Repo Debug] Query executed. Row Count:", result.rowCount);
            return result.rows[0];
        }
        catch (error) {
            console.error("failed", error);
            throw new Error("쿼리 실행 중 오류 발생!");
        }
    }
}
exports.DbRestaurantRepository = DbRestaurantRepository;
//# sourceMappingURL=dbRes.repository.js.map