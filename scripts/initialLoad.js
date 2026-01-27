"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const dbRes_repository_1 = require("../src/api/restaurant/repository/dbRes.repository");
const res_service_1 = require("../src/api/restaurant/service/res.service");
const path = __importStar(require("path"));
dotenv_1.default.config({ path: path.resolve(__dirname, "..", ".env") });
console.log("DB_PASSWORD loaded (should be 9147):", process.env.DB_PASSWORD);
const dbPool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});
async function runDataCollection() {
    console.log("--- 🍽️ OpenAPI 데이터 수집 및 DB 적재 시작 ---");
    try {
        // 1. Repository 인스턴스 생성 (DB 연결 주입)
        const repository = new dbRes_repository_1.DbRestaurantRepository(dbPool);
        // 2. Service 인스턴스 생성 (Repository 주입)
        // 🚨 Service는 환경 변수 process.env.OPEN_API_KEY를 자동으로 가져옵니다.
        const service = new res_service_1.ResServicesImpl(repository);
        // 3. 🚀 핵심 함수 호출
        await service.saveAllOpenData();
        console.log("--- ✅ 데이터 적재 완료. PostgreSQL 확인 ---");
    }
    catch (error) {
        console.error("--- ❌ 데이터 적재 중 치명적인 오류 발생 ---", error);
        process.exit(1); // 오류 발생 시 스크립트 종료
    }
    finally {
        // 4. DB 연결 풀 종료
        await dbPool.end();
        console.log("DB 연결 종료.");
    }
}
// 스크립트 실행
runDataCollection();
//# sourceMappingURL=initialLoad.js.map