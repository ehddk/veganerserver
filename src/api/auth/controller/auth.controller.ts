import HttpException from "@/api/common/exceptions/http.exception";
import { AuthService } from "../service/auth.service.type";
import { NextFunction, Request, Response } from "express";
import { CryptoService } from "@/api/common/services/crypto.service";

export default class AuthController {
  private readonly _authService: AuthService;
  constructor(authService: AuthService) {
    this._authService = authService;

    this.login = this.login.bind(this);
    this.getAuthById = this.getAuthById.bind(this);
    this.createAuth = this.createAuth.bind(this);
    this.updateAuth = this.updateAuth.bind(this);
    this.deleteAuth = this.deleteAuth.bind(this);
  }

  async getAuthById(
    req: Request<
      getMemberRequest["path"],
      getMemberRequest["body"],
      getMemberRequest["params"],
      getMemberResponse
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    console.log("id는!!!", id);

    try {
      const values = await this._authService.getAuthById(id);
      res.status(200).json(values);
    } catch (error) {
      console.error("Error retrieving auth in Controller:", error);
      next(error);
      throw new HttpException(404, "계정 조회 중 오류 발생");
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  async createAuth(
    req: Request<
      createMemberRequest["params"],
      createMemberResponse,
      createMemberRequest["body"],
      createMemberRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, password } = req.body;
      const { hashedPassword, salt } = CryptoService.encryptPassword(password);
      const values = await this._authService.createAuth({
        name,
        email,
        password: hashedPassword,
        salt: salt,
      });
      res.status(200).json(values);
    } catch (error) {
      console.error("Error create auth in Controller:", error);
      next(error);
      throw new HttpException(404, "계정 생성 중 오류 발생");
    }
  }

  async updateAuth(
    req: Request<
      updateMemberRequest["path"],
      updateMemberResponse,
      updateMemberRequest["body"],
      updateMemberRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      await this._authService.updateAuth(id, req.body);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "계정 수정 중 오류 발생");
    }
  }
  async deleteAuth(
    req: Request<
      deleteMemberRequest["path"],
      deleteMemberRequest["body"],
      deleteMemberRequest["params"],
      deleteMemberResponse
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      await this._authService.deleteAuth(id);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "계정 삭제 중 오류 발생");
    }
  }
}
