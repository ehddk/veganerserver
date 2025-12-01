import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import { JwtService } from "../services/jwt.service";

/** 인증 & 인가 미들웨어 */
export const authRoleMiddleware = (roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
        throw new HttpException(401, "토큰이 없습니다!!");
      }

      // 페이로드에서 역할을 확인합니다.
      const payload = JwtService.verifyAccessToken(token);

      // 역할이 없으면 에러를 던집니다.
      if (!roles.includes(payload.role)) {
        throw new HttpException(403, "권한이 없습니다.");
      }

      req.user = {
        userId: payload.userId,
        role: payload.role,
      };

      next();
    } catch (error: any) {
      next(
        new HttpException(
          error.statusCode ?? 401,
          `인증 실패했습니다. ${error.message}`
        )
      );
    }
  };
};
