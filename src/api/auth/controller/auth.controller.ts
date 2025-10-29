import HttpException from "@/api/common/exceptions/http.exception";
import { AuthService } from "../service/auth.service.type";
import { NextFunction, Request, Response } from "express";

export default class AuthController {
  private readonly _authService: AuthService;
  constructor(authService: AuthService) {
    this._authService = authService;
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
      throw new HttpException(404, "게시글 조회 중 오류 발생");
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
      const values = await this._authService.createAuth({
        name,
        email,
        password,
      });
      res.status(200).json(values);
    } catch (error) {
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
  async deleteMember(
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
