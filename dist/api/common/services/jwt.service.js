"use strict";
// src/api/common/services/jwt.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access";
    static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh";
    /** 엑세스 토큰 검증 */
    static verifyAccessToken(token) {
        const secret = this.ACCESS_TOKEN_SECRET;
        return jsonwebtoken_1.default.verify(token, secret);
    }
    /** 리프레시 토큰 검증 */
    static verifyRefreshToken(token) {
        const secret = this.REFRESH_TOKEN_SECRET;
        return jsonwebtoken_1.default.verify(token, secret);
    }
    /** 엑세스 토큰 발행 */
    static generateAccessToken(params) {
        const { userId, expiresIn, role } = params;
        const options = {
            expiresIn: expiresIn || "1h",
        };
        return jsonwebtoken_1.default.sign({ userId, role: role ?? "user" }, this.ACCESS_TOKEN_SECRET, options // 명시된 옵션 객체를 전달
        );
    }
    /** 리프레시 토큰 발행 */
    static generateRefreshToken(params) {
        const { userId, expiresIn } = params;
        const options = {
            expiresIn: expiresIn || "14d",
        };
        return jsonwebtoken_1.default.sign({ userId }, this.REFRESH_TOKEN_SECRET, options);
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map