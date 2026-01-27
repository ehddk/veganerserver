"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserMiddleware = void 0;
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const jwt_service_1 = require("../services/jwt.service");
/** 인증 미들웨어 */
const authUserMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new http_exception_1.default(401, "토큰이 없습니다.");
        }
        const tokenValue = token.split("Bearer ")[1];
        const payload = jwt_service_1.JwtService.verifyAccessToken(tokenValue);
        req.user = {
            userId: payload.userId,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        next(new http_exception_1.default(401, `인증 실패 ${error.message}`));
    }
};
exports.authUserMiddleware = authUserMiddleware;
//# sourceMappingURL=authUser.middleware.js.map