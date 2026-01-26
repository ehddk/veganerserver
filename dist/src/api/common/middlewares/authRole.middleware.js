"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoleMiddleware = void 0;
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const jwt_service_1 = require("../services/jwt.service");
/** 인증 & 인가 미들웨어 */
const authRoleMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            //let tokenValue: string | undefined;
            // 헤더에서 토큰을 가져옵니다.
            let token = req.cookies.accessToken;
            // 2. 쿠키에 없으면 Authorization 헤더에서 확인합니다. (Postman 요청)
            if (!token && req.headers.authorization) {
                const parts = req.headers.authorization.split("Bearer ");
                // Bearer <token> 형태인지 확인 후 토큰 값만 추출
                if (parts.length === 2) {
                    token = parts[1];
                }
            }
            console.log("token", token);
            // 토큰이 없으면 에러를 던집니다.
            if (!token) {
                throw new http_exception_1.default(401, "토큰이 없습니다!!");
            }
            // 페이로드에서 역할을 확인합니다.
            const payload = jwt_service_1.JwtService.verifyAccessToken(token);
            // 역할이 없으면 에러를 던집니다.
            if (!roles.includes(payload.role)) {
                throw new http_exception_1.default(403, "권한이 없습니다.");
            }
            req.user = {
                userId: payload.userId,
                role: payload.role,
            };
            next();
        }
        catch (error) {
            next(new http_exception_1.default(error.statusCode ?? 401, `인증 실패했습니다. ${error.message}`));
        }
    };
};
exports.authRoleMiddleware = authRoleMiddleware;
//# sourceMappingURL=authRole.middleware.js.map