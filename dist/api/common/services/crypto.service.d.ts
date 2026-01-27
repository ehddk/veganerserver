export declare class CryptoService {
    /** 솔트 생성 */
    static generateSalt(): string;
    /** 비밀번호 암호화 */
    static encryptPassword(password?: string): {
        hashedPassword?: string;
        salt?: string;
    };
    /** 비밀번호 일치 확인 */
    static matchPassword(plainPassword: string, hashedPassword: string, salt: string): boolean;
    private static _encryptPassword;
}
