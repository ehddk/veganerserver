"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
class CryptoService {
    /** 솔트 생성 */
    static generateSalt() {
        return node_crypto_1.default.randomBytes(64).toString("hex");
    }
    /** 비밀번호 암호화 */
    static encryptPassword(password) {
        const salt = this.generateSalt();
        return {
            hashedPassword: password
                ? this._encryptPassword(password, salt)
                : undefined,
            salt: password ? salt : undefined,
        };
    }
    /** 비밀번호 일치 확인 */
    static matchPassword(plainPassword, hashedPassword, salt) {
        return hashedPassword === this._encryptPassword(plainPassword, salt);
    }
    static _encryptPassword(password, salt) {
        return node_crypto_1.default
            .pbkdf2Sync(password, salt, 100000, 64, "sha512")
            .toString("hex");
    }
}
exports.CryptoService = CryptoService;
//# sourceMappingURL=crypto.service.js.map