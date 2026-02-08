"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("../../../api/common/exceptions/http.exception"));
const crypto_service_1 = require("../../../api/common/services/crypto.service");
class AuthController {
    _authService;
    constructor(authService) {
        this._authService = authService;
        this.login = this.login.bind(this);
        this.getAuthById = this.getAuthById.bind(this);
        this.createAuth = this.createAuth.bind(this);
        this.updateAuth = this.updateAuth.bind(this);
        this.deleteAuth = this.deleteAuth.bind(this);
    }
    async getAuthById(req, res, next) {
        const { id } = req.params;
        try {
            const values = await this._authService.getAuthById(id);
            res.status(200).json(values);
        }
        catch (error) {
            console.error("Error retrieving auth in Controller:", error);
            next(error);
            throw new http_exception_1.default(404, "계정 조회 중 오류 발생");
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const accessToken = await this._authService.login(email, password);
            const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds (matches token expiry)
            const isProduction = process.env.NODE_ENV === "production";
            res.cookie("accessToken", accessToken, {
                httpOnly: true, // XSS 방어
                // SameSite=None을 사용하려면 secure: true가 필수입니다.
                // 로컬 환경에서도 secure: true가 되도록 강제합니다. (운영 환경에서는 NODE_ENV 체크를 통해 HTTPS가 보장됨)
                // 크로스 오리진 요청(3000 -> 4000)에서 쿠키 저장을 허용
                sameSite: isProduction ? "none" : "lax",
                secure: isProduction,
                maxAge: maxAge,
            });
            // Send a successful response without the token in the body
            res.status(200).json({
                message: "Login successful",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        res.cookie("accessToken", "", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "로그아웃 성공" });
    }
    async createAuth(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const { hashedPassword, salt } = crypto_service_1.CryptoService.encryptPassword(password);
            const values = await this._authService.createAuth({
                name,
                email,
                password,
            });
            res.status(200).json(values);
        }
        catch (error) {
            console.error("Error create auth in Controller:", error);
            next(error);
            throw new http_exception_1.default(404, "계정 생성 중 오류 발생");
        }
    }
    async updateAuth(req, res, next) {
        const { id } = req.params;
        try {
            await this._authService.updateAuth(id, req.body);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "계정 수정 중 오류 발생");
        }
    }
    async deleteAuth(req, res, next) {
        const { id } = req.params;
        try {
            await this._authService.deleteAuth(id);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "계정 삭제 중 오류 발생");
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map