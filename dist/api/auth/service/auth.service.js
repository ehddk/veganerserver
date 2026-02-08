"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServicesImpl = void 0;
const http_exception_1 = __importDefault(require("../../../api/common/exceptions/http.exception"));
const authResponse_dto_1 = require("../dto/authResponse.dto");
const crypto_service_1 = require("../../../api/common/services/crypto.service");
const jwt_service_1 = require("../../../api/common/services/jwt.service");
class AuthServicesImpl {
    _authRepository;
    constructor(authRepository) {
        this._authRepository = authRepository;
    }
    async login(email, password) {
        const findUser = await this._authRepository.findByEmail(email);
        if (!findUser) {
            throw new http_exception_1.default(404, "존재하지 않는 회원입니다.");
        }
        const isSamePassword = crypto_service_1.CryptoService.matchPassword(password, findUser?.password || "", findUser.salt ?? "");
        if (!isSamePassword) {
            throw new http_exception_1.default(401, "비밀번호가 일치하지 않습니다.");
        }
        const accessToken = jwt_service_1.JwtService.generateAccessToken({
            role: findUser.role,
            userId: findUser.id,
            expiresIn: "7d",
        });
        return accessToken;
    }
    async getAuthById(id) {
        try {
            const auth = await this._authRepository.findById(id);
            console.log("서비스에서", auth);
            if (!auth) {
                throw new http_exception_1.default(404, "해당 계정을 찾을 수 없습니다.");
            }
            return new authResponse_dto_1.AuthResponseDTO(auth);
        }
        catch (error) {
            throw new Error("계정 조회 중 오류 발생");
        }
    }
    async createAuth(auth) {
        try {
            const { email, password } = auth;
            const exisitingUser = await this._authRepository.findByEmail(email);
            if (exisitingUser) {
                throw new http_exception_1.default(409, "이미 존재하는 이메일입니다");
            }
            const { hashedPassword, salt } = crypto_service_1.CryptoService.encryptPassword(password);
            const newUser = await this._authRepository.save({
                email,
                password: hashedPassword,
                salt,
                name: auth.name || "User",
                role: "user",
            });
            return new authResponse_dto_1.AuthResponseDTO(newUser);
        }
        catch (error) {
            if (error instanceof http_exception_1.default) {
                throw error;
            }
            throw new Error("계정 생성 중 오류 발생");
        }
    }
    async updateAuth(id, authInfo) {
        try {
            const updateAuth = await this._authRepository.update(id, authInfo);
            if (!updateAuth) {
                throw new http_exception_1.default(404, "해당 계정을 찾을 수 없습니다.");
            }
        }
        catch (error) {
            throw new Error("계정 수정 중 오류 발생");
        }
    }
    async deleteAuth(id) {
        try {
            await this._authRepository.delete(id);
        }
        catch (error) {
            throw new Error("계정 삭제 중 오류 발생");
        }
    }
}
exports.AuthServicesImpl = AuthServicesImpl;
//# sourceMappingURL=auth.service.js.map