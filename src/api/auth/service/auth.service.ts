import HttpException from "@/api/common/exceptions/http.exception";
import { AuthResponseDTO } from "../dto/authResponse.dto";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "./auth.service.type";
import { CryptoService } from "@/api/common/services/crypto.service";
import { JwtService } from "@/api/common/services/jwt.service";

export class AuthServicesImpl implements AuthService {
  private readonly _authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this._authRepository = authRepository;
  }

  async login(email: string, password: string): Promise<string> {
    const findUser = await this._authRepository.findByEmail(email);

    if (!findUser) {
      throw new HttpException(404, "존재하지 않는 회원입니다.");
    }

    const isSamePassword = CryptoService.matchPassword(
      password,
      findUser?.password || "",
      findUser.salt ?? ""
    );

    if (!isSamePassword) {
      throw new HttpException(401, "비밀번호가 일치하지 않습니다.");
    }

    const accessToken = JwtService.generateAccessToken({
      role: findUser.role,
      userId: findUser.id,
      expiresIn: "7d",
    });

    return accessToken;
  }

  async getAuthById(id: string): Promise<AuthResponseDTO> {
    try {
      const auth = await this._authRepository.findById(id);
      console.log("서비스에서", auth);
      if (!auth) {
        throw new HttpException(404, "해당 계정을 찾을 수 없습니다.");
      }
      return new AuthResponseDTO(auth);
    } catch (error) {
      throw new Error("계정 조회 중 오류 발생");
    }
  }

  async createAuth(auth: Omit<IAuth, "id">): Promise<AuthResponseDTO> {
    try {
      const newAuth = await this._authRepository.save(auth);

      return new AuthResponseDTO(newAuth);
    } catch (error) {
      throw new Error("계정 생성 중 오류 발생");
    }
  }
  async updateAuth(
    id: string,
    authInfo: Omit<IAuth, "id" | "email">
  ): Promise<void> {
    try {
      const updateAuth = await this._authRepository.update(id, authInfo);
      if (!updateAuth) {
        throw new HttpException(404, "해당 계정을 찾을 수 없습니다.");
      }
    } catch (error) {
      throw new Error("계정 수정 중 오류 발생");
    }
  }
  async deleteAuth(id: string): Promise<void> {
    try {
      await this._authRepository.delete(id);
    } catch (error) {
      throw new Error("계정 삭제 중 오류 발생");
    }
  }
}
